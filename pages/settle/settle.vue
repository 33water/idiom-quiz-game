<template>
  <scroll-view class="page-shell" scroll-y>
    <!-- ===== 顶部 ===== -->
    <view class="settle-top">
      <text class="settle-top__title">本轮结算</text>
      <view v-if="readonly" class="settle-top__badge">历史记录</view>
    </view>

    <!-- ===== 正确率大号数字 ===== -->
    <view class="accuracy-ring">
      <view class="accuracy-ring__circle">
        <text class="accuracy-ring__num">{{ accuracy }}%</text>
        <text class="accuracy-ring__label">正确率</text>
      </view>
    </view>

    <!-- ===== 鼓励文案 ===== -->
    <text class="settle-motto">{{ motto }}</text>

    <!-- ===== 三栏统计 ===== -->
    <view class="stats-row">
      <view class="stats-row__item">
        <text class="stats-row__num stats-row__num--correct">{{ correctCount }}</text>
        <text class="stats-row__label">答对</text>
      </view>
      <view class="stats-row__divider"></view>
      <view class="stats-row__item">
        <text class="stats-row__num stats-row__num--wrong">{{ wrongCount }}</text>
        <text class="stats-row__label">答错</text>
      </view>
      <view class="stats-row__divider"></view>
      <view class="stats-row__item">
        <text class="stats-row__num stats-row__num--total">{{ totalQuestions }}</text>
        <text class="stats-row__label">总题</text>
      </view>
    </view>

    <!-- ===== 积分预览（非只读时显示） ===== -->
    <view v-if="!readonly && !reviewMode" class="score-preview">
      <text class="score-preview__label">本轮积分</text>
      <text class="score-preview__amount">+{{ scorePreview }}</text>
      <text v-if="streakPreview > 0" class="score-preview__streak">
        （含连胜加成 +{{ streakPreview }}）
      </text>
    </view>

    <!-- ===== 操作按钮（非只读时显示） ===== -->
    <view v-if="!readonly" class="settle-actions">
      <!-- 复习错题（有错题时显示） -->
      <view v-if="wrongCount > 0 && !reviewMode" class="settle-actions__btn" @click="handleReview">
        <text class="settle-actions__btn-icon">📝</text>
        <text>复习错题（{{ wrongCount }} 题）</text>
      </view>

      <!-- 跳过 / 继续 -->
      <view class="settle-actions__btn settle-actions__btn--primary" @click="handleContinue">
        <text>{{ reviewMode || wrongCount === 0 ? '继续' : '跳过复习' }}</text>
      </view>
    </view>

    <TabBar current="game" />
  </scroll-view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { calcScore } from '@/data/idiomEngine.js'
import { user, recordRound, loadAll } from '@/data/userStore.js'
import TabBar from '@/components/TabBar.vue'

// ===== 路由参数 =====
const correctCount = ref(0)
const wrongCount = ref(0)
const wrongIds = ref([])
const totalQuestions = ref(10)
const reviewMode = ref(false)
const readonly = ref(false)
const streakCount = ref(0)

// ===== 计算属性 =====
const accuracy = computed(() => {
  if (totalQuestions.value === 0) return 0
  return Math.round((correctCount.value / totalQuestions.value) * 100)
})

const motto = computed(() => {
  const acc = accuracy.value
  if (acc === 100) return '🎉 满分！太强了！'
  if (acc >= 70) return '👏 本轮表现不错！'
  if (acc >= 40) return '💪 继续加油！'
  return '😅 别灰心，再来一次！'
})

const scorePreview = computed(() => {
  const result = calcScore(correctCount.value, streakCount.value, reviewMode.value)
  return result.score
})

const streakPreview = computed(() => {
  const result = calcScore(correctCount.value, streakCount.value, reviewMode.value)
  return result.streakBonus
})

// ===== 生命周期 =====
onLoad((params) => {
  loadAll()

  correctCount.value = parseInt(params.correctCount || '0', 10)
  wrongCount.value = parseInt(params.wrongCount || '0', 10)
  totalQuestions.value = parseInt(params.totalQuestions || '10', 10)
  reviewMode.value = params.reviewMode === 'true'
  readonly.value = params.readonly === 'true'
  streakCount.value = parseInt(params.streakCount || '0', 10)

  if (params.wrongIds) {
    wrongIds.value = params.wrongIds.split(',').map(Number)
  }

  // 非只读、非复习模式：记录本轮成绩到 userStore
  if (!readonly.value && !reviewMode.value) {
    recordRound({
      correctCount: correctCount.value,
      wrongCount: wrongCount.value,
      scoreEarned: scorePreview.value,
      streakBonus: streakPreview.value,
      wrongIds: wrongIds.value,
      mode: params.mode || 'text'
    })
  }
})

// ===== 跳转 =====
function handleReview() {
  if (wrongIds.value.length === 0) return
  uni.redirectTo({
    url: `/pages/game/game?reviewMode=true&reviewIds=${wrongIds.value.join(',')}`
  })
}

function handleContinue() {
  const params = {
    correctCount: correctCount.value,
    wrongCount: wrongCount.value,
    score: scorePreview.value,
    streakBonus: streakPreview.value,
    totalQuestions: totalQuestions.value,
    reviewMode: reviewMode.value ? 'true' : 'false'
  }

  const qs = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')

  uni.redirectTo({ url: `/pages/encourage/encourage?${qs}` })
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

// ===== 顶部 =====
.settle-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 28rpx 0 16rpx;
}

.settle-top__title {
  font-size: 34rpx;
  font-weight: 700;
  color: var(--theme-text);
}

.settle-top__badge {
  padding: 4rpx 16rpx;
  background-color: var(--theme-bg);
  border-radius: var(--radius-sm);
  font-size: 22rpx;
  color: var(--theme-text-tertiary);
  border: 1rpx solid var(--theme-border);
}

// ===== 正确率大圆 =====
.accuracy-ring {
  padding: 40rpx 0 16rpx;
}

.accuracy-ring__circle {
  width: 240rpx;
  height: 240rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: conic-gradient(
    var(--theme-primary) 0%,
    var(--theme-primary) v-bind('accuracy + "%"'),
    var(--theme-border) v-bind('accuracy + "%"'),
    var(--theme-border) 100%
  );
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 210rpx;
    height: 210rpx;
    border-radius: 50%;
    background-color: var(--theme-card);
  }
}

.accuracy-ring__num,
.accuracy-ring__label {
  position: relative;
  z-index: 1;
}

.accuracy-ring__num {
  font-size: 64rpx;
  font-weight: 800;
  color: var(--theme-text);
  line-height: 1;
}

.accuracy-ring__label {
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
  margin-top: 4rpx;
}

// ===== 鼓励文案 =====
.settle-motto {
  font-size: 32rpx;
  font-weight: 500;
  color: var(--theme-text-secondary);
  text-align: center;
  margin-bottom: 36rpx;
}

// ===== 三栏统计 =====
.stats-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  width: 100%;
  padding: 28rpx 0;
  background-color: var(--theme-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  margin-bottom: 24rpx;
}

.stats-row__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
}

.stats-row__num {
  font-size: 40rpx;
  font-weight: 700;
  line-height: 1;
}

.stats-row__num--correct { color: var(--theme-success); }
.stats-row__num--wrong { color: var(--theme-error); }
.stats-row__num--total { color: var(--theme-primary); }

.stats-row__label {
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
}

.stats-row__divider {
  width: 1rpx;
  height: 48rpx;
  background-color: var(--theme-border);
}

// ===== 积分预览 =====
.score-preview {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
  margin-bottom: 32rpx;
}

.score-preview__label {
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
}

.score-preview__amount {
  font-size: 48rpx;
  font-weight: 800;
  color: var(--theme-primary);
}

.score-preview__streak {
  font-size: 22rpx;
  color: var(--theme-accent);
}

// ===== 操作按钮 =====
.settle-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.settle-actions__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  height: 88rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: opacity 0.2s;

  &:active { opacity: 0.8; }

  text {
    font-size: 28rpx;
    color: var(--theme-text-secondary);
    font-weight: 500;
  }
}

.settle-actions__btn-icon {
  font-size: 32rpx;
}

.settle-actions__btn--primary {
  background-color: var(--theme-primary);

  text { color: #ffffff; }
}
</style>
