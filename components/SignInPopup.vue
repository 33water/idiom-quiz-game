<template>
  <view v-if="visible" class="popup-overlay" @click="handleClose">
    <view class="popup-panel" @click.stop>
      <view class="popup__handle"></view>

      <!-- 成功头部 -->
      <view class="popup__header">
        <view class="popup__badge">
          <text class="popup__badge-icon">🎉</text>
        </view>
        <text class="popup__title">签到成功</text>
        <text class="popup__subtitle">坚持签到，积累成语知识！</text>
      </view>

      <!-- 积分奖励 -->
      <view class="popup__reward">
        <text class="popup__reward-label">获得积分</text>
        <text class="popup__reward-amount">+{{ bonus }}</text>
      </view>

      <!-- 连续签到 -->
      <view class="popup__streak" v-if="streak > 0">
        <text class="popup__streak-num">{{ streak }}</text>
        <text class="popup__streak-label">天连续签到</text>
      </view>

      <!-- 关闭按钮 -->
      <view class="popup__footer">
        <view class="popup__btn" @click="handleClose">
          <text>关闭</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'
import { user, signIn } from '@/data/userStore.js'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const bonus = ref(0)
const streak = ref(0)

watch(() => props.visible, (newVal) => {
  if (newVal) {
    const result = signIn()
    if (result !== false) {
      bonus.value = result
      streak.value = (user.signInStreak || 0) + 1
      user.signInStreak = streak.value
      uni.setStorageSync('user_data', { ...user })
    } else {
      bonus.value = 0
      streak.value = user.signInStreak || 0
    }
  }
})

function handleClose() {
  emit('close')
}
</script>

<style lang="scss" scoped>
.popup-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  animation: fadeIn 0.25s ease;
}

.popup-panel {
  width: 100%;
  background-color: var(--theme-card);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: 16rpx 32rpx 48rpx;
  animation: slideUp 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.popup__handle {
  width: 60rpx;
  height: 6rpx;
  border-radius: 3rpx;
  background-color: var(--theme-border);
  margin-bottom: 24rpx;
}

.popup__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 24rpx;
}

.popup__badge {
  width: 100rpx;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FFF3E0, #FFE0B2);
  border-radius: 50%;
  margin-bottom: 8rpx;
}

.popup__badge-icon {
  font-size: 56rpx;
  line-height: 1;
}

.popup__title {
  font-size: 34rpx;
  font-weight: 600;
  color: var(--theme-text);
}

.popup__subtitle {
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
}

.popup__reward {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
  padding: 24rpx 48rpx;
  background: linear-gradient(135deg, #FFF8E1, #FFF3CD);
  border-radius: var(--radius-lg);
  margin-bottom: 20rpx;
}

.popup__reward-label {
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
}

.popup__reward-amount {
  font-size: 56rpx;
  font-weight: 700;
  color: var(--theme-primary);
  line-height: 1;
}

.popup__streak {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 32rpx;
}

.popup__streak-num {
  font-size: 40rpx;
  font-weight: 700;
  color: var(--theme-accent);
  line-height: 1;
}

.popup__streak-label {
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
}

.popup__footer {
  width: 100%;
}

.popup__btn {
  width: 100%;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--theme-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: opacity 0.2s;

  &:active {
    opacity: 0.85;
  }

  text {
    font-size: 30rpx;
    font-weight: 500;
    color: #ffffff;
  }
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
