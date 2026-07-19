<template>
  <scroll-view class="page-shell" scroll-y>
    <!-- ===== 顶部：进度 + 退出 ===== -->
    <view class="game-top">
      <view class="game-top__back" @click="handleQuit">
        <text>‹</text>
      </view>
      <view class="game-top__progress-text">
        <text>第 {{ currentIndex + 1 }} / {{ total }}</text>
      </view>
      <view v-if="reviewMode" class="game-top__badge">复习</view>
    </view>

    <!-- 进度条 -->
    <view class="progress-bar">
      <view class="progress-bar__fill" :style="{ width: (currentIndex / total) * 100 + '%' }"></view>
    </view>

    <!-- ===== 谜面区 ===== -->
    <view class="riddle-area">
      <!-- 文字模式：纯文字谜面 -->
      <template v-if="mode === 'text'">
        <text class="riddle-area__text">{{ currentRiddle }}</text>
        <text class="riddle-area__hint">猜一个成语</text>
      </template>
      <!-- 看图模式：纯图形提示 -->
      <template v-else>
        <text class="riddle-area__emoji">{{ currentQuestion?.emoji || '🤔' }}</text>
        <text class="riddle-area__hint">根据图示猜成语</text>
      </template>
    </view>

    <!-- ===== 倒计时 ===== -->
    <view class="timer">
      <view
        class="timer__bar"
        :class="{ 'timer__bar--warn': timeLeft <= 5 }"
        :style="{ width: (timeLeft / 20) * 100 + '%' }"
      ></view>
      <text class="timer__text" :class="{ 'timer__text--warn': timeLeft <= 5 }">{{ timeLeft }}s</text>
    </view>

    <!-- ===== 答题区 ===== -->
    <view class="answer-section">
      <!-- 选项模式 -->
      <view v-if="answerMode === 'choice' && !isAnswered">
        <view
          v-for="(opt, i) in displayOptions"
          :key="i"
          class="choice-btn"
          :class="{ 'choice-btn--disabled': opt.disabled }"
          @click="handleChoice(opt)"
        >
          <view class="choice-btn__mark">{{ optionLabels[i] }}</view>
          <text class="choice-btn__text">{{ opt.label }}</text>
          <text v-if="opt.disabled" class="choice-btn__remove">✕</text>
        </view>
      </view>

      <!-- 输入模式 -->
      <view v-if="answerMode === 'input' && !isAnswered">
        <view class="input-box">
          <input
            class="input-box__field"
            :value="inputValue"
            placeholder="输入成语…"
            placeholder-class="input-placeholder"
            @input="handleInput"
            @confirm="handleInputSubmit"
          />
        </view>
        <view class="input-submit" @click="handleInputSubmit">
          <text>确认</text>
        </view>
      </view>

      <!-- 答题后结果 -->
      <view v-show="isAnswered" class="result-area">
        <view class="result-area__icon">
          <text>{{ isCorrect ? '✅' : '❌' }}</text>
        </view>
        <text class="result-area__word">{{ currentQuestion.word }}</text>
        <text class="result-area__meaning">{{ currentQuestion.meaning }}</text>
        <text class="result-area__pinyin">{{ currentQuestion.pinyin }}</text>
      </view>
    </view>

    <!-- ===== 底部操作栏 ===== -->
    <view class="game-actions" v-if="!isAnswered">
      <view class="game-actions__btn game-actions__btn--hint">
        <text>💡 提示</text>
      </view>
      <view
        class="game-actions__btn"
        :class="{ 'game-actions__btn--disabled': usedRemove }"
        @click="handleRemoveOption"
      >
        <text>{{ usedRemove ? '✓ 已用' : '排除错项' }}</text>
      </view>
      <view
        class="game-actions__btn"
        :class="{ 'game-actions__btn--disabled': usedPeek }"
        @click="handlePeekChar"
      >
        <text>{{ usedPeek ? '✓ 已用' : '偷看单字' }}</text>
      </view>
      <!-- 两项都用完后显示积分兑换 -->
      <view
        v-if="usedRemove && usedPeek"
        class="game-actions__btn game-actions__btn--redeem"
        @click="handleRedeem"
      >
        <text>🔄 兑换 (50分)</text>
      </view>
    </view>

    <!-- ===== 下一题按钮 ===== -->
    <view v-if="isAnswered" class="next-area">
      <view class="next-btn" @click="handleNext">
        <text>{{ currentIndex + 1 >= total ? '查看结果' : '下一题' }}</text>
      </view>
    </view>

    <!-- ===== 弹窗 ===== -->
    <AiTauntPopup
      :visible="showAiTaunt"
      :type="aiTauntType"
      :text="aiTauntText"
      @close="showAiTaunt = false"
    />
    <JokePopup
      :visible="showJoke"
      :wrong-count="consecutiveWrong"
      @close="showJoke = false"
    />

    <TabBar current="game" />
  </scroll-view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getQuestionPool, getRiddle, getChoiceOptions, shuffle } from '@/data/idiomEngine.js'
import { aiTaunts } from '@/data/aiTaunts.js'
import { user, addScore, recordRound, loadAll } from '@/data/userStore.js'
import { playCorrect, playWrong, playTimeout, startBGM, stopBGM } from '@/data/soundManager.js'
import TabBar from '@/components/TabBar.vue'
import AiTauntPopup from '@/components/AiTauntPopup.vue'
import JokePopup from '@/components/JokePopup.vue'

// ===== 路由参数 =====
const mode = ref('text')
const answerMode = ref('choice')
const reviewMode = ref(false)
const reviewIds = ref([])

const optionLabels = ['A', 'B', 'C', 'D']

// ===== 游戏状态 =====
const total = ref(10)
const questions = ref([])
const currentIndex = ref(0)
const isAnswered = ref(false)
const isCorrect = ref(false)
const userAnswers = ref([])
const wrongIds = ref([])
const correctCount = ref(0)

// ===== 输入模式 =====
const inputValue = ref('')

// ===== 倒计时 =====
const timeLeft = ref(20)
let timer = null

// ===== 后悔药 =====
const usedRemove = ref(false)
const usedPeek = ref(false)
const removedOptionIndex = ref(-1)
const peekChar = ref('')

// ===== AI 调侃 =====
const showAiTaunt = ref(false)
const aiTauntType = ref('correct')
const aiTauntText = ref('')

// ===== 连错彩蛋 =====
const consecutiveWrong = ref(0)
const showJoke = ref(false)

// ===== 计算属性 =====
const currentQuestion = computed(() => {
  return questions.value[currentIndex.value] || null
})

const currentRiddle = computed(() => {
  if (!currentQuestion.value) return ''
  const level = currentIndex.value < 3 ? 1 : currentIndex.value < 7 ? 2 : 3
  return getRiddle(currentQuestion.value, level)
})

const displayOptions = computed(() => {
  if (!currentQuestion.value) return []
  const opts = getChoiceOptions(currentQuestion.value)
  return opts.map(label => ({
    label,
    disabled: removedOptionIndex.value !== -1 && opts.indexOf(label) === removedOptionIndex.value
  }))
})

// ===== 生命周期 =====
onLoad((params) => {
  if (params.mode) mode.value = params.mode
  if (params.answerMode) answerMode.value = params.answerMode
  if (params.reviewMode === 'true') reviewMode.value = true
  if (params.reviewIds) {
    reviewIds.value = params.reviewIds.split(',').map(Number)
  }

  loadAll()

  // 出题
  questions.value = getQuestionPool([], total.value, reviewIds.value.length > 0 ? reviewIds.value : null)
  if (questions.value.length === 0) {
    uni.showToast({ title: '没有可用的题目', icon: 'none' })
    return
  }
  total.value = questions.value.length

  // 背景音乐
  startBGM()

  startTimer()
})

onUnmounted(() => {
  clearInterval(timer)
  stopBGM()
})

// ===== 计时器 =====
function startTimer() {
  timeLeft.value = 20
  clearInterval(timer)
  timer = setInterval(() => {
    timeLeft.value -= 1
    if (timeLeft.value <= 0) {
      clearInterval(timer)
      handleTimeout()
    }
  }, 1000)
}

function stopTimer() {
  clearInterval(timer)
}

// ===== 答题逻辑 =====
function handleChoice(opt) {
  if (isAnswered.value || opt.disabled) return
  stopTimer()
  checkAnswer(opt.label)
}

function handleInput(e) {
  inputValue.value = (e.detail.value || '').trim()
}

function handleInputSubmit() {
  if (isAnswered.value || !inputValue.value) return
  stopTimer()
  checkAnswer(inputValue.value)
}

function checkAnswer(answer) {
  isAnswered.value = true
  const correct = currentQuestion.value.word
  const match = answer === correct
  isCorrect.value = match
  // 音效
  if (match) {
    playCorrect()
  } else {
    playWrong()
  }

  userAnswers.value.push({ word: correct, answer, correct: match })

  if (match) {
    correctCount.value++
    consecutiveWrong.value = 0
  } else {
    wrongIds.value.push(currentQuestion.value.id)
    consecutiveWrong.value++
  }

  // AI 调侃
  showTaunt(match)

  // 连错彩蛋
  if (consecutiveWrong.value >= 3) {
    showJoke.value = true
  }
}

function handleTimeout() {
  isAnswered.value = true
  isCorrect.value = false
  playTimeout()
  wrongIds.value.push(currentQuestion.value.id)
  consecutiveWrong.value++
  userAnswers.value.push({ word: currentQuestion.value.word, answer: '', correct: false })

  showTaunt(false)
  if (consecutiveWrong.value >= 3) {
    showJoke.value = true
  }
}

// ===== 后悔药 =====
function handleRemoveOption() {
  if (usedRemove.value || isAnswered.value || answerMode.value !== 'choice') return
  // 随机禁用一个错误选项
  const opts = displayOptions.value
  const available = opts
    .map((o, i) => ({ i, label: o.label }))
    .filter(o => o.label !== currentQuestion.value.word && !o.disabled)

  if (available.length > 0) {
    const pick = available[Math.floor(Math.random() * available.length)]
    removedOptionIndex.value = opts.findIndex(o => o.label === pick.label)
    usedRemove.value = true
  }
}

function handlePeekChar() {
  if (usedPeek.value || isAnswered.value) return
  const word = currentQuestion.value.word
  // 展示第一个字
  peekChar.value = word[0]
  uni.showToast({
    title: `提示：第一个字是「${word[0]}」`,
    icon: 'none',
    duration: 2000
  })
  usedPeek.value = true
}

// ===== 积分兑换 =====
function handleRedeem() {
  if (isAnswered.value) return
  if (user.score < 50) {
    uni.showToast({ title: '积分不足，需要50分', icon: 'none' })
    return
  }
  uni.showModal({
    title: '积分兑换',
    content: `消耗 50 积分兑换一次后悔药使用机会？（当前积分：${user.score}）`,
    success: (res) => {
      if (res.confirm) {
        addScore(-50)
        usedRemove.value = false
        usedPeek.value = false
        removedOptionIndex.value = -1
        uni.showToast({ title: '兑换成功！', icon: 'success' })
      }
    }
  })
}

// ===== AI 调侃 =====
function showTaunt(correct) {
  const list = correct ? aiTaunts.correct : aiTaunts.wrong
  aiTauntType.value = correct ? 'correct' : 'wrong'
  aiTauntText.value = list[Math.floor(Math.random() * list.length)]
  showAiTaunt.value = true
}

// ===== 下一题 / 结束 =====
function handleNext() {
  if (currentIndex.value + 1 >= total.value) {
    // 结算
    goSettle()
    return
  }

  currentIndex.value++
  isAnswered.value = false
  isCorrect.value = false
  inputValue.value = ''
  removedOptionIndex.value = -1
  startTimer()
}

function goSettle() {
  stopBGM()
  const params = {
    correctCount: correctCount.value,
    wrongCount: total.value - correctCount.value,
    wrongIds: wrongIds.value.join(','),
    totalQuestions: total.value,
    reviewMode: reviewMode.value ? 'true' : 'false',
    streakCount: user.winStreak
  }

  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')

  uni.redirectTo({ url: `/pages/settle/settle?${qs}` })
}

function handleQuit() {
  uni.showModal({
    title: '提示',
    content: '确定退出当前游戏？本轮进度将丢失。',
    success: (res) => {
      if (res.confirm) {
        stopBGM()
        uni.reLaunch({ url: '/pages/index/index' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.page-shell {
  width: 100%;
  height: 100vh;
  background-color: var(--theme-bg);
  padding: 0 32rpx 140rpx;
  display: flex;
  flex-direction: column;
}

// ===== 顶部 =====
.game-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0 12rpx;
}

.game-top__back {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--theme-card);
  border-radius: 50%;
  box-shadow: var(--shadow-card);
  cursor: pointer;

  text {
    font-size: 40rpx;
    color: var(--theme-text);
    line-height: 1;
  }
}

.game-top__progress-text {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--theme-text-secondary);
}

.game-top__badge {
  padding: 4rpx 16rpx;
  background-color: #E8F5E9;
  border-radius: var(--radius-sm);
  font-size: 22rpx;
  color: #2E7D32;
}

// ===== 进度条 =====
.progress-bar {
  height: 6rpx;
  background-color: var(--theme-border);
  border-radius: 3rpx;
  margin-bottom: 36rpx;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background-color: var(--theme-primary);
  border-radius: 3rpx;
  transition: width 0.4s ease;
}

// ===== 谜面区 =====
.riddle-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 40rpx 20rpx 32rpx;
}

.riddle-area__emoji {
  font-size: 160rpx;
  line-height: 1;
}

.riddle-area__text {
  font-size: 36rpx;
  font-weight: 600;
  color: var(--theme-text);
  text-align: center;
  line-height: 1.5;
}

.riddle-area__hint {
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
}

// ===== 倒计时 =====
.timer {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 32rpx;
}

.timer__bar {
  flex: 1;
  height: 8rpx;
  background-color: var(--theme-accent);
  border-radius: 4rpx;
  transition: width 1s linear, background-color 0.3s;
}

.timer__bar--warn {
  background-color: var(--theme-error);
}

.timer__text {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--theme-text-tertiary);
  width: 48rpx;
  text-align: right;
}

.timer__text--warn {
  color: var(--theme-error);
}

// ===== 答题区 =====
.answer-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

// 选项模式
.choice-btn {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx 20rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  margin-bottom: 16rpx;
  cursor: pointer;
  transition: transform 0.15s;

  &:active {
    transform: scale(0.97);
  }
}

.choice-btn--disabled {
  opacity: 0.35;
  pointer-events: none;
}

.choice-btn__mark {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid var(--theme-border);
  border-radius: 50%;
  font-size: 22rpx;
  font-weight: 600;
  color: var(--theme-text-tertiary);
  flex-shrink: 0;
}

.choice-btn__text {
  flex: 1;
  font-size: 30rpx;
  color: var(--theme-text);
}

.choice-btn__remove {
  font-size: 24rpx;
  color: var(--theme-error);
}

// 输入模式
.input-box {
  padding: 4rpx 24rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  margin-bottom: 16rpx;
  border: 2rpx solid var(--theme-border);
}

.input-box__field {
  height: 80rpx;
  font-size: 32rpx;
  color: var(--theme-text);
  text-align: center;
}

.input-placeholder {
  color: var(--theme-text-placeholder);
  font-size: 28rpx;
}

.input-submit {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--theme-primary);
  border-radius: var(--radius-md);
  cursor: pointer;

  &:active { opacity: 0.85; }
  text { font-size: 30rpx; font-weight: 500; color: #ffffff; }
}

// 答题后结果
.result-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  padding: 32rpx 20rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.result-area__icon text {
  font-size: 64rpx;
}

.result-area__word {
  font-size: 38rpx;
  font-weight: 700;
  color: var(--theme-text);
}

.result-area__meaning {
  font-size: 26rpx;
  color: var(--theme-text-secondary);
  text-align: center;
  line-height: 1.5;
}

.result-area__pinyin {
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
}

// ===== 底部操作栏 =====
.game-actions {
  display: flex;
  gap: 12rpx;
  padding: 20rpx 0 16rpx;
}

.game-actions__btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 72rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: opacity 0.2s;

  &:active { opacity: 0.8; }
  text { font-size: 24rpx; color: var(--theme-text-secondary); }
}

.game-actions__btn--disabled {
  opacity: 0.4;
  pointer-events: none;
}

.game-actions__btn--redeem {
  background-color: var(--theme-accent);

  text { color: #ffffff; font-weight: 500; }
}

.game-actions__btn--hint text {
  font-size: 24rpx;
}

// ===== 下一题按钮 =====
.next-area {
  padding: 16rpx 0;
}

.next-btn {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--theme-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: opacity 0.2s;

  &:active { opacity: 0.85; }
  text { font-size: 30rpx; font-weight: 500; color: #ffffff; }
}
</style>
