<template>
  <scroll-view class="page-shell" scroll-y>
    <!-- ===== 装饰区 ===== -->
    <view class="encourage-hero">
      <text class="encourage-hero__emoji">{{ heroEmoji }}</text>
      <text class="encourage-hero__text">{{ motto }}</text>
      <text class="encourage-hero__sub">
        {{ correctCount }} / {{ totalQuestions }} 题正确
      </text>
    </view>

    <!-- ===== 积分卡片 ===== -->
    <view class="score-card">
      <view class="score-card__header">
        <text class="score-card__label">本轮获得积分</text>
      </view>
      <text class="score-card__amount">+{{ score }}</text>
      <view v-if="streakBonus > 0" class="score-card__streak">
        <text>🔥 连胜加成 +{{ streakBonus }}</text>
      </view>
      <view class="score-card__total">
        <text class="score-card__total-label">当前总积分</text>
        <text class="score-card__total-num">{{ currentScore }}</text>
      </view>
    </view>

    <!-- ===== 操作按钮 ===== -->
    <view class="actions">
      <view class="actions__btn actions__btn--share" @click="handleShare">
        <text>📤 分享趣图</text>
      </view>
      <view class="actions__btn actions__btn--replay" @click="handleReplay">
        <text>🔄 再来一局</text>
      </view>
      <view class="actions__btn" @click="handleHome">
        <text>🏠 返回首页</text>
      </view>
    </view>

    <!-- ===== 再来一局弹窗 ===== -->
    <view v-if="showReplayPopup" class="popup-overlay" @click="showReplayPopup = false">
      <view class="replay-panel" @click.stop>
        <view class="replay-panel__handle"></view>
        <text class="replay-panel__title">再来一局</text>

        <text class="replay-panel__section-label">游戏模式</text>
        <view class="replay-panel__options">
          <view
            class="replay-panel__option"
            :class="{ 'replay-panel__option--active': replayMode === 'text' }"
            @click="replayMode = 'text'"
          >
            <text>📝 文字猜成语</text>
          </view>
          <view
            class="replay-panel__option"
            :class="{ 'replay-panel__option--active': replayMode === 'image' }"
            @click="replayMode = 'image'"
          >
            <text>🎨 看图猜成语</text>
          </view>
        </view>

        <text class="replay-panel__section-label">答题方式</text>
        <view class="replay-panel__options">
          <view
            class="replay-panel__option"
            :class="{ 'replay-panel__option--active': replayAnswerMode === 'choice' }"
            @click="replayAnswerMode = 'choice'"
          >
            <text>📋 选项选择</text>
          </view>
          <view
            class="replay-panel__option"
            :class="{ 'replay-panel__option--active': replayAnswerMode === 'input' }"
            @click="replayAnswerMode = 'input'"
          >
            <text>✏️ 手动输入</text>
          </view>
        </view>

        <view class="replay-panel__btn" @click="handleStartNewGame">
          <text>开始游戏</text>
        </view>
      </view>
    </view>

    <!-- ===== 分享趣图弹窗 ===== -->
    <view v-if="showSharePopup" class="popup-overlay" @click="showSharePopup = false">
      <view class="share-panel" @click.stop>
        <view class="share-panel__handle"></view>

        <!-- 趣图区 -->
        <view class="share-image">
          <view class="share-image__bg">
            <text class="share-image__emoji">{{ heroEmoji }}</text>
            <view class="share-image__decoration"></view>
          </view>
          <view class="share-image__content">
            <text class="share-image__title">脑洞大翻车</text>
            <text class="share-image__text">{{ shareText }}</text>
            <view class="share-image__stats">
              <text>{{ correctCount }} / {{ totalQuestions }} 题</text>
              <text>{{ accuracy }}% 正确率</text>
            </view>
          </view>
        </view>

        <!-- 操作 -->
        <view class="share-panel__actions">
          <view class="share-panel__btn share-panel__btn--share" @click="handleShareAction">
            <text>📤 去分享</text>
          </view>
          <view class="share-panel__btn share-panel__btn--cancel" @click="showSharePopup = false">
            <text>关闭</text>
          </view>
        </view>
      </view>
    </view>

    <TabBar current="game" />
  </scroll-view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { user, loadAll } from '@/data/userStore.js'
import TabBar from '@/components/TabBar.vue'

// ===== 路由参数 =====
const correctCount = ref(0)
const wrongCount = ref(0)
const totalQuestions = ref(10)
const score = ref(0)
const streakBonus = ref(0)
const reviewMode = ref(false)

// ===== 再来一局状态 =====
const showReplayPopup = ref(false)
const replayMode = ref('text')
const replayAnswerMode = ref('choice')

// ===== 计算属性 =====
const accuracy = computed(() => {
  if (totalQuestions.value === 0) return 0
  return Math.round((correctCount.value / totalQuestions.value) * 100)
})

const motto = computed(() => {
  const acc = accuracy.value
  if (acc === 100) return '满分太强了！'
  if (acc >= 70) return '本轮表现不错！'
  if (acc >= 40) return '继续加油！'
  return '别灰心，再来一次！'
})

const heroEmoji = computed(() => {
  const acc = accuracy.value
  if (acc === 100) return '🏆'
  if (acc >= 70) return '🎉'
  if (acc >= 40) return '💪'
  return '😅'
})

const currentScore = computed(() => user.score || 0)

// ===== 分享文案 =====
const shareText = computed(() => {
  const acc = accuracy.value
  if (acc === 100) return '我居然全对了！脑洞大翻车也太好玩了吧！🎉'
  if (acc >= 70) return '猜对了 ' + correctCount.value + '/' + totalQuestions.value + ' 题，成语小天才就是我！'
  if (acc >= 40) return '还差一点就及格了，谁来跟我 PK 一局？'
  return '翻车了翻车了…但真的很好玩，不信你来试试！😅'
})

// ===== 生命周期 =====
onLoad((params) => {
  loadAll()
  correctCount.value = parseInt(params.correctCount || '0', 10)
  wrongCount.value = parseInt(params.wrongCount || '0', 10)
  totalQuestions.value = parseInt(params.totalQuestions || '10', 10)
  score.value = parseInt(params.score || '0', 10)
  streakBonus.value = parseInt(params.streakBonus || '0', 10)
  reviewMode.value = params.reviewMode === 'true'
})

// ===== 分享弹窗 =====
const showSharePopup = ref(false)

function handleShare() {
  showSharePopup.value = true
}

function handleShareAction() {
  uni.showToast({ title: '开发中，敬请期待', icon: 'none' })
}

// ===== 再来一局 =====
function handleReplay() {
  replayMode.value = 'text'
  replayAnswerMode.value = 'choice'
  showReplayPopup.value = true
}

function handleStartNewGame() {
  showReplayPopup.value = false
  uni.redirectTo({
    url: `/pages/game/game?mode=${replayMode.value}&answerMode=${replayAnswerMode.value}`
  })
}

// ===== 返回首页 =====
function handleHome() {
  uni.reLaunch({ url: '/pages/index/index' })
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
  align-items: center;
}

// ===== 鼓励区 =====
.encourage-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 48rpx 0 32rpx;
}

.encourage-hero__emoji {
  font-size: 96rpx;
  line-height: 1;
}

.encourage-hero__text {
  font-size: 40rpx;
  font-weight: 700;
  color: var(--theme-text);
}

.encourage-hero__sub {
  font-size: 26rpx;
  color: var(--theme-text-tertiary);
}

// ===== 积分卡片 =====
.score-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32rpx 28rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  margin-bottom: 36rpx;
}

.score-card__label {
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
}

.score-card__amount {
  font-size: 72rpx;
  font-weight: 800;
  color: var(--theme-primary);
  line-height: 1.2;
  margin: 8rpx 0;
}

.score-card__streak {
  padding: 6rpx 20rpx;
  background-color: #FFF3E0;
  border-radius: var(--radius-xl);
  margin-bottom: 20rpx;

  text {
    font-size: 24rpx;
    color: #E65100;
    font-weight: 500;
  }
}

.score-card__total {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid var(--theme-border);
  width: 100%;
  justify-content: center;
}

.score-card__total-label {
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
}

.score-card__total-num {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--theme-text);
}

// ===== 操作按钮 =====
.actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.actions__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: opacity 0.2s;

  &:active { opacity: 0.8; }

  text { font-size: 28rpx; color: var(--theme-text-secondary); font-weight: 500; }
}

.actions__btn--replay {
  background-color: var(--theme-primary);
  text { color: #ffffff; }
}

.actions__btn--share {
  border: 2rpx solid var(--theme-primary);
  background-color: transparent;
  text { color: var(--theme-primary); }
}

// ===== 再来一局弹窗 =====
.popup-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  animation: fadeIn 0.25s ease;
}

.replay-panel {
  width: 100%;
  background-color: var(--theme-card);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: 16rpx 32rpx 48rpx;
  animation: slideUp 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.replay-panel__handle {
  width: 60rpx;
  height: 6rpx;
  border-radius: 3rpx;
  background-color: var(--theme-border);
  margin: 0 auto 24rpx;
}

.replay-panel__title {
  display: block;
  text-align: center;
  font-size: 34rpx;
  font-weight: 600;
  color: var(--theme-text);
  margin-bottom: 28rpx;
}

.replay-panel__section-label {
  display: block;
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
  margin-bottom: 12rpx;
}

.replay-panel__options {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.replay-panel__option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80rpx;
  background-color: var(--theme-bg);
  border-radius: var(--radius-md);
  border: 2rpx solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  text { font-size: 26rpx; color: var(--theme-text-secondary); }
}

.replay-panel__option--active {
  border-color: var(--theme-primary);
  background-color: #FFF5F0;

  text { color: var(--theme-primary); font-weight: 500; }
}

.replay-panel__btn {
  width: 100%;
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

// ===== 分享趣图弹窗 =====
.share-panel {
  width: 100%;
  background-color: var(--theme-card);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: 16rpx 32rpx 48rpx;
  animation: slideUp 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.share-panel__handle {
  width: 60rpx;
  height: 6rpx;
  border-radius: 3rpx;
  background-color: var(--theme-border);
  margin: 0 auto 24rpx;
}

// 趣图卡片
.share-image {
  background-color: var(--theme-bg);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 28rpx;
}

.share-image__bg {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
  background: linear-gradient(135deg, var(--theme-primary-light), var(--theme-accent-light));
  overflow: hidden;
}

.share-image__emoji {
  font-size: 100rpx;
  line-height: 1;
  z-index: 1;
}

.share-image__decoration {
  position: absolute;
  top: -60rpx;
  right: -60rpx;
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
}

.share-image__content {
  padding: 24rpx 28rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.share-image__title {
  font-size: 22rpx;
  color: var(--theme-text-tertiary);
  letter-spacing: 4rpx;
}

.share-image__text {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--theme-text);
  line-height: 1.5;
}

.share-image__stats {
  display: flex;
  gap: 24rpx;
  padding-top: 12rpx;
  border-top: 1rpx solid var(--theme-border);

  text {
    font-size: 24rpx;
    color: var(--theme-text-tertiary);
  }
}

// 分享按钮区
.share-panel__actions {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.share-panel__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: opacity 0.2s;
  &:active { opacity: 0.85; }
}

.share-panel__btn--share {
  background-color: var(--theme-primary);
  text { font-size: 30rpx; font-weight: 500; color: #ffffff; }
}

.share-panel__btn--cancel {
  background-color: var(--theme-card);
  border: 2rpx solid var(--theme-border);

  text { font-size: 28rpx; color: var(--theme-text-secondary); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>
