<template>
  <view v-if="visible" class="popup-overlay" @click="handleClose">
    <view class="popup-panel" @click.stop>
      <view class="popup__handle"></view>

      <!-- 彩蛋头部 -->
      <view class="popup__header">
        <view class="popup__icon-wrap">
          <text class="popup__icon">🥚</text>
        </view>
        <text class="popup__title">连错彩蛋！</text>
        <text class="popup__subtitle">你已经连错 {{ wrongCount }} 题了，送你个冷笑话冷静一下～</text>
      </view>

      <!-- 冷笑话内容 -->
      <view class="popup__joke">
        <text class="popup__joke-text">{{ joke }}</text>
      </view>

      <!-- 关闭按钮 -->
      <view class="popup__footer">
        <view class="popup__btn" @click="handleClose">
          <text>我知道了</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { aiTaunts } from '@/data/aiTaunts.js'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  wrongCount: {
    type: Number,
    default: 3
  }
})

const emit = defineEmits(['close', 'update:visible'])

const joke = computed(() => {
  if (!aiTaunts.coldJokes || aiTaunts.coldJokes.length === 0) {
    return '有个人总爱连错，后来……他成了笑话大全！'
  }
  const idx = Math.floor(Math.random() * aiTaunts.coldJokes.length)
  return aiTaunts.coldJokes[idx]
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

.popup__icon-wrap {
  width: 100rpx;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FFF3E0, #FFE0B2);
  border-radius: 50%;
  margin-bottom: 8rpx;
}

.popup__icon {
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
  text-align: center;
}

.popup__joke {
  width: 100%;
  padding: 28rpx 24rpx;
  background: linear-gradient(135deg, #FFF8E1, #FFF3CD);
  border-radius: var(--radius-md);
  margin-bottom: 32rpx;
  border: 1rpx solid #FFE082;
}

.popup__joke-text {
  font-size: 30rpx;
  color: #E65100;
  line-height: 1.7;
  text-align: center;
  white-space: pre-line;
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
