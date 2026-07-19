<template>
  <view v-if="visible" class="popup-overlay" @click="handleClose">
    <view class="popup-panel" @click.stop>
      <!-- 拖拽手柄 -->
      <view class="popup__handle"></view>

      <!-- 头部 -->
      <view class="popup__header">
        <text class="popup__icon">{{ type === 'correct' ? '🎉' : '💥' }}</text>
        <text class="popup__title">{{ type === 'correct' ? '答对啦！' : '答错了～' }}</text>
      </view>

      <!-- 调侃文案 -->
      <view class="popup__body">
        <text class="popup__text">{{ text }}</text>
      </view>

      <!-- 关闭按钮 -->
      <view class="popup__footer">
        <view class="popup__btn" @click="handleClose">
          <text>继续</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'correct' // 'correct' | 'wrong'
  },
  text: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'update:visible'])

watch(() => props.visible, (val) => {
  if (val) {
    // 3 秒后自动关闭
    setTimeout(() => {
      if (props.visible) handleClose()
    }, 3000)
  }
})

function handleClose() {
  emit('update:visible', false)
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

.popup__icon {
  font-size: 64rpx;
  line-height: 1;
}

.popup__title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--theme-text);
}

.popup__body {
  width: 100%;
  padding: 24rpx;
  background-color: var(--theme-bg);
  border-radius: var(--radius-md);
  margin-bottom: 28rpx;
  text-align: center;
}

.popup__text {
  font-size: 30rpx;
  color: var(--theme-text-secondary);
  line-height: 1.6;
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
  transition: opacity 0.2s ease;

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
