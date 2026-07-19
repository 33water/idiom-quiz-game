<template>
  <scroll-view class="page-shell" scroll-y>
    <!-- ===== 顶部标题 ===== -->
    <view class="page-header">
      <text class="page-header__back" @click="goBack">‹</text>
      <text class="page-header__title">🕐 历史记录</text>
      <text class="page-header__count" v-if="records.length > 0">
        近 {{ records.length }} 局
      </text>
    </view>

    <!-- ===== 空状态 ===== -->
    <view v-if="records.length === 0" class="empty">
      <text class="empty__icon">📭</text>
      <text class="empty__text">还没有游戏记录</text>
      <text class="empty__sub">去玩一局吧！</text>
    </view>

    <!-- ===== 记录列表 ===== -->
    <view v-else class="record-list">
      <view
        v-for="(record, i) in records"
        :key="record.id"
        class="record-card"
        @click="handleRecordClick(record)"
      >
        <!-- 顶部：时间 + 模式 -->
        <view class="record-card__top">
          <text class="record-card__date">{{ formatDate(record.date) }}</text>
          <view class="record-card__mode-badge">
            <text>{{ record.mode === 'image' ? '🎨看图' : '📝文字' }}</text>
          </view>
        </view>

        <!-- 正确率进度条 -->
        <view class="record-card__rate-row">
          <view class="record-card__rate-bar">
            <view
              class="record-card__rate-fill"
              :style="{ width: rateWidth(record) + '%' }"
              :class="rateClass(record)"
            ></view>
          </view>
          <text class="record-card__rate-text" :class="rateClass(record)">
            {{ ratePercent(record) }}%
          </text>
        </view>

        <!-- 底部统计 -->
        <view class="record-card__stats">
          <view class="record-card__stat-item">
            <text class="record-card__stat-num record-card__stat-num--correct">{{ record.correctCount }}</text>
            <text class="record-card__stat-label">对</text>
          </view>
          <view class="record-card__stat-divider"></view>
          <view class="record-card__stat-item">
            <text class="record-card__stat-num record-card__stat-num--wrong">{{ record.wrongCount }}</text>
            <text class="record-card__stat-label">错</text>
          </view>
          <view class="record-card__stat-divider"></view>
          <view class="record-card__stat-item">
            <text class="record-card__stat-num record-card__stat-num--score">+{{ record.scoreEarned }}</text>
            <text class="record-card__stat-label">分</text>
          </view>
          <view v-if="record.streakBonus > 0" class="record-card__streak-badge">
            <text>🔥+{{ record.streakBonus }}</text>
          </view>
        </view>
      </view>
    </view>

    <TabBar current="profile" />
  </scroll-view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getRecentRecords, loadAll } from '@/data/userStore.js'
import TabBar from '@/components/TabBar.vue'

const records = ref([])

onMounted(() => {
  loadAll()
  records.value = getRecentRecords(10)
})

// ===== 格式化 =====
function formatDate(isoStr) {
  if (!isoStr) return ''
  const date = new Date(isoStr)
  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  const recordDate = isoStr.slice(0, 10)

  if (recordDate === today) {
    return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (recordDate === yesterday.toISOString().slice(0, 10)) {
    return `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  return `${recordDate.slice(5)} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

function ratePercent(record) {
  if (!record.totalQuestions) return 0
  return Math.round((record.correctCount / record.totalQuestions) * 100)
}

function rateWidth(record) {
  return ratePercent(record)
}

function rateClass(record) {
  const pct = ratePercent(record)
  if (pct === 100) return 'rate--perfect'
  if (pct >= 70) return 'rate--good'
  if (pct >= 40) return 'rate--ok'
  return 'rate--bad'
}

// ===== 返回上一页 =====
function goBack() {
  uni.navigateBack()
}

// ===== 跳转结算页（只读） =====
function handleRecordClick(record) {
  const params = {
    correctCount: record.correctCount,
    wrongCount: record.wrongCount,
    totalQuestions: record.totalQuestions,
    readonly: 'true',
    streakCount: 0
  }

  if (record.wrongIds && record.wrongIds.length > 0) {
    params.wrongIds = record.wrongIds.join(',')
  }

  const qs = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')

  uni.navigateTo({ url: `/pages/settle/settle?${qs}` })
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
  align-items: baseline;
  justify-content: space-between;
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

.page-header__count {
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
}

// ===== 空状态 =====
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  gap: 12rpx;
}

.empty__icon {
  font-size: 80rpx;
}

.empty__text {
  font-size: 30rpx;
  color: var(--theme-text-secondary);
}

.empty__sub {
  font-size: 26rpx;
  color: var(--theme-text-tertiary);
}

// ===== 记录卡片 =====
.record-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.record-card {
  padding: 24rpx 24rpx 20rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: transform 0.2s;

  &:active { transform: scale(0.98); }
}

.record-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14rpx;
}

.record-card__date {
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
}

.record-card__mode-badge {
  padding: 4rpx 14rpx;
  background-color: var(--theme-bg);
  border-radius: var(--radius-sm);

  text {
    font-size: 20rpx;
    color: var(--theme-text-tertiary);
  }
}

// 正确率进度条
.record-card__rate-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 14rpx;
}

.record-card__rate-bar {
  flex: 1;
  height: 12rpx;
  background-color: var(--theme-border);
  border-radius: 6rpx;
  overflow: hidden;
}

.record-card__rate-fill {
  height: 100%;
  border-radius: 6rpx;
  transition: width 0.5s ease;
}

.rate--perfect { background-color: var(--theme-success); }
.rate--good { background-color: var(--theme-primary); }
.rate--ok { background-color: var(--theme-warning); }
.rate--bad { background-color: var(--theme-error); }

.record-card__rate-text {
  font-size: 28rpx;
  font-weight: 700;
  width: 60rpx;
  text-align: right;
}

.rate--perfect { color: var(--theme-success); }
.rate--good { color: var(--theme-primary); }
.rate--ok { color: var(--theme-warning); }
.rate--bad { color: var(--theme-error); }

// 底部统计
.record-card__stats {
  display: flex;
  align-items: center;
  gap: 0;
}

.record-card__stat-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
}

.record-card__stat-num {
  font-size: 28rpx;
  font-weight: 600;
}

.record-card__stat-num--correct { color: var(--theme-success); }
.record-card__stat-num--wrong { color: var(--theme-error); }
.record-card__stat-num--score { color: var(--theme-primary); }

.record-card__stat-label {
  font-size: 22rpx;
  color: var(--theme-text-tertiary);
}

.record-card__stat-divider {
  width: 1rpx;
  height: 24rpx;
  background-color: var(--theme-border);
}

.record-card__streak-badge {
  padding: 2rpx 12rpx;
  background-color: #FFF3E0;
  border-radius: var(--radius-sm);
  margin-left: 8rpx;

  text {
    font-size: 20rpx;
    color: #E65100;
  }
}
</style>
