<template>
  <scroll-view class="page-shell" scroll-y>
    <!-- ===== 顶部标题 ===== -->
    <view class="page-header">
      <text class="page-header__back" @click="goBack">‹</text>
      <text class="page-header__title">📊 学习统计</text>
    </view>

    <!-- ===== 总体概览 ===== -->
    <view class="summary-row">
      <view class="summary-row__card summary-row__card--score">
        <text class="summary-row__num">{{ user.score }}</text>
        <text class="summary-row__label">总积分</text>
      </view>
      <view class="summary-row__card summary-row__card--today">
        <text class="summary-row__num">+{{ todayScore }}</text>
        <text class="summary-row__label">今日得分</text>
      </view>
      <view class="summary-row__card summary-row__card--accuracy">
        <text class="summary-row__num">{{ accuracy }}%</text>
        <text class="summary-row__label">总正确率</text>
      </view>
    </view>

    <!-- ===== 答题进度 ===== -->
    <view class="section-card">
      <text class="section-card__title">📝 累计答题</text>
      <view class="progress-stats">
        <view class="progress-stats__item">
          <text class="progress-stats__num progress-stats__num--total">{{ user.totalQuestions }}</text>
          <text class="progress-stats__label">总题数</text>
        </view>
        <view class="progress-stats__item">
          <text class="progress-stats__num progress-stats__num--correct">{{ user.totalCorrect }}</text>
          <text class="progress-stats__label">答对</text>
        </view>
        <view class="progress-stats__item">
          <text class="progress-stats__num progress-stats__num--wrong">{{ totalWrong }}</text>
          <text class="progress-stats__label">答错</text>
        </view>
        <view class="progress-stats__item">
          <text class="progress-stats__num progress-stats__num--rounds">{{ user.totalRounds }}</text>
          <text class="progress-stats__label">总局</text>
        </view>
      </view>
      <!-- 正确/错误比例条 -->
      <view class="ratio-bar">
        <view
          class="ratio-bar__fill ratio-bar__fill--correct"
          :style="{ width: correctRatio + '%' }"
        ></view>
        <view
          class="ratio-bar__fill ratio-bar__fill--wrong"
          :style="{ width: wrongRatio + '%' }"
        ></view>
      </view>
      <view class="ratio-bar__labels">
        <text class="ratio-bar__label ratio-bar__label--correct">正确 {{ correctRatio }}%</text>
        <text class="ratio-bar__label ratio-bar__label--wrong">错误 {{ wrongRatio }}%</text>
      </view>
    </view>

    <!-- ===== 连胜记录 ===== -->
    <view class="section-card">
      <text class="section-card__title">🔥 连胜记录</text>
      <view class="streak-row">
        <view class="streak-row__item">
          <text class="streak-row__icon">🔥</text>
          <text class="streak-row__num">{{ user.winStreak }}</text>
          <text class="streak-row__label">当前连胜</text>
        </view>
        <view class="streak-row__divider"></view>
        <view class="streak-row__item">
          <text class="streak-row__icon">🏆</text>
          <text class="streak-row__num">{{ user.maxStreak }}</text>
          <text class="streak-row__label">最长连胜</text>
        </view>
        <view class="streak-row__divider"></view>
        <view class="streak-row__item">
          <text class="streak-row__icon">💯</text>
          <text class="streak-row__num">{{ user.bestRound }}</text>
          <text class="streak-row__label">最佳单轮</text>
        </view>
      </view>
    </view>

    <!-- ===== 最近局正确率趋势 ===== -->
    <view class="section-card">
      <text class="section-card__title">📈 最近 {{ recentRounds.length }} 局正确率</text>
      <view v-if="recentRounds.length === 0" class="empty-chart">
        <text class="empty-chart__text">暂无数据</text>
      </view>
      <view v-else class="chart">
        <view
          v-for="(r, i) in recentRounds"
          :key="r.id"
          class="chart__row"
        >
          <text class="chart__label">#{{ i + 1 }}</text>
          <view class="chart__bar-track">
            <view
              class="chart__bar-fill"
              :class="chartBarClass(r)"
              :style="{ width: roundRate(r) + '%' }"
            ></view>
          </view>
          <text class="chart__pct" :class="chartBarClass(r)">{{ roundRate(r) }}%</text>
          <text class="chart__mode">{{ r.mode === 'image' ? '🎨' : '📝' }}</text>
        </view>
      </view>
    </view>

    <!-- ===== 今日活动 ===== -->
    <view class="section-card">
      <text class="section-card__title">📅 今日活动</text>
      <view class="today-row">
        <view class="today-row__item">
          <text class="today-row__icon">{{ hasSignedIn ? '✅' : '⭕' }}</text>
          <text class="today-row__text">{{ hasSignedIn ? '已签到' : '未签到' }}</text>
        </view>
        <view class="today-row__divider"></view>
        <view class="today-row__item">
          <text class="today-row__icon">🎮</text>
          <text class="today-row__text">今日 {{ todayRounds }} 局</text>
        </view>
        <view class="today-row__divider"></view>
        <view class="today-row__item">
          <text class="today-row__icon">📝</text>
          <text class="today-row__text">{{ errors.length }} 道错题</text>
        </view>
      </view>
    </view>

    <TabBar current="profile" />
  </scroll-view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { user, accuracy, todayScore, hasSignedIn, errors, loadAll, getRecentRecords } from '@/data/userStore.js'
import TabBar from '@/components/TabBar.vue'

const recentRounds = ref([])
const todayRounds = ref(0)

const totalWrong = computed(() => Math.max(0, user.totalQuestions - user.totalCorrect))
const correctRatio = computed(() => {
  if (user.totalQuestions === 0) return 0
  return Math.round((user.totalCorrect / user.totalQuestions) * 100)
})
const wrongRatio = computed(() => 100 - correctRatio.value)

onMounted(() => {
  loadAll()
  recentRounds.value = getRecentRecords(10)

  // 计算今日局数
  const today = new Date().toISOString().slice(0, 10)
  todayRounds.value = recentRounds.value.filter(r => r.date && r.date.slice(0, 10) === today).length
})

function roundRate(record) {
  if (!record.totalQuestions) return 0
  return Math.round((record.correctCount / record.totalQuestions) * 100)
}

// ===== 返回上一页 =====
function goBack() {
  uni.navigateBack()
}

function chartBarClass(record) {
  const pct = roundRate(record)
  if (pct === 100) return 'chart__bar-fill--perfect'
  if (pct >= 70) return 'chart__bar-fill--good'
  if (pct >= 40) return 'chart__bar-fill--ok'
  return 'chart__bar-fill--bad'
}
</script>

<style lang="scss" scoped>
.page-shell {
  width: 100%;
  height: 100vh;
  background-color: var(--theme-bg);
  padding: 0 32rpx 140rpx;
}

// ===== 页面标题 =====
.page-header {
  display: flex;
  align-items: center;
  padding: 24rpx 0 20rpx;
}

.page-header__title {
  font-size: 34rpx;
  font-weight: 700;
  color: var(--theme-text);
}

.page-header__back {
  font-size: 44rpx;
  font-weight: 300;
  color: var(--theme-text);
  cursor: pointer;
  padding: 8rpx 12rpx 8rpx 0;
  flex-shrink: 0;
  line-height: 1;
}

// ===== 总体概览 =====
.summary-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.summary-row__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 24rpx 12rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.summary-row__num {
  font-size: 42rpx;
  font-weight: 700;
  line-height: 1;
}

.summary-row__label {
  font-size: 22rpx;
  color: var(--theme-text-tertiary);
}

.summary-row__card--score .summary-row__num { color: var(--theme-primary); }
.summary-row__card--today .summary-row__num { color: var(--theme-accent); }
.summary-row__card--accuracy .summary-row__num { color: var(--theme-warning); }

// ===== 分区卡片 =====
.section-card {
  padding: 24rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  margin-bottom: 20rpx;
}

.section-card__title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: var(--theme-text);
  margin-bottom: 20rpx;
}

// ===== 答题进度 =====
.progress-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8rpx;
  margin-bottom: 20rpx;
}

.progress-stats__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.progress-stats__num {
  font-size: 36rpx;
  font-weight: 700;
}

.progress-stats__num--total { color: var(--theme-text); }
.progress-stats__num--correct { color: var(--theme-success); }
.progress-stats__num--wrong { color: var(--theme-error); }
.progress-stats__num--rounds { color: var(--theme-primary); }

.progress-stats__label {
  font-size: 20rpx;
  color: var(--theme-text-tertiary);
}

// 比例条
.ratio-bar {
  display: flex;
  height: 16rpx;
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 8rpx;
}

.ratio-bar__fill--correct {
  background-color: var(--theme-success);
  transition: width 0.5s ease;
}

.ratio-bar__fill--wrong {
  background-color: var(--theme-error);
  transition: width 0.5s ease;
}

.ratio-bar__labels {
  display: flex;
  justify-content: space-between;
}

.ratio-bar__label {
  font-size: 20rpx;
}

.ratio-bar__label--correct {
  color: var(--theme-success);
}

.ratio-bar__label--wrong {
  color: var(--theme-error);
}

// ===== 连胜记录 =====
.streak-row {
  display: flex;
  align-items: center;
}

.streak-row__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
}

.streak-row__icon {
  font-size: 40rpx;
}

.streak-row__num {
  font-size: 40rpx;
  font-weight: 700;
  color: #E65100;
}

.streak-row__label {
  font-size: 22rpx;
  color: var(--theme-text-tertiary);
}

.streak-row__divider {
  width: 1rpx;
  height: 48rpx;
  background-color: var(--theme-border);
}

// ===== 正确率趋势 =====
.empty-chart {
  text-align: center;
  padding: 40rpx 0;
}

.empty-chart__text {
  font-size: 26rpx;
  color: var(--theme-text-tertiary);
}

.chart {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.chart__row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.chart__label {
  width: 48rpx;
  font-size: 22rpx;
  color: var(--theme-text-tertiary);
  text-align: right;
  flex-shrink: 0;
}

.chart__bar-track {
  flex: 1;
  height: 20rpx;
  background-color: var(--theme-bg);
  border-radius: 10rpx;
  overflow: hidden;
}

.chart__bar-fill {
  height: 100%;
  border-radius: 10rpx;
  transition: width 0.5s ease;
}

.chart__bar-fill--perfect { background-color: var(--theme-success); }
.chart__bar-fill--good { background-color: var(--theme-primary); }
.chart__bar-fill--ok { background-color: var(--theme-warning); }
.chart__bar-fill--bad { background-color: var(--theme-error); }

.chart__pct {
  width: 54rpx;
  font-size: 22rpx;
  font-weight: 600;
  text-align: right;
  flex-shrink: 0;
}

.chart__mode {
  width: 36rpx;
  font-size: 24rpx;
  text-align: center;
  flex-shrink: 0;
}

// ===== 今日活动 =====
.today-row {
  display: flex;
  align-items: center;
}

.today-row__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
}

.today-row__icon {
  font-size: 36rpx;
}

.today-row__text {
  font-size: 24rpx;
  color: var(--theme-text-secondary);
}

.today-row__divider {
  width: 1rpx;
  height: 36rpx;
  background-color: var(--theme-border);
}
</style>
