<template>
  <view class="tab-bar">
    <view
      v-for="tab in tabs"
      :key="tab.page"
      class="tab-bar__item"
      :class="{ 'tab-bar__item--active': currentTab === tab.page }"
      @click="handleTabClick(tab)"
    >
      <text class="tab-bar__icon">{{ tab.icon }}</text>
      <text class="tab-bar__label">{{ tab.label }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: {
    type: String,
    default: 'index'
  }
})

const tabs = [
  { page: 'index', icon: '🏠', label: '首页', path: '/pages/index/index' },
  { page: 'game', icon: '🎮', label: '猜谜', path: '/pages/game/game' },
  { page: 'profile', icon: '👤', label: '我的', path: '/pages/profile/profile' }
]

const currentTab = computed(() => props.current)

function handleTabClick(tab) {
  // 已在当前页面则忽略
  if (currentTab.value === tab.page) return

  uni.reLaunch({
    url: tab.path
  })
}
</script>

<style lang="scss" scoped>
.tab-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  height: 100rpx;
  padding-bottom: env(safe-area-inset-bottom, 0);
  background-color: var(--theme-card);
  border-top: 1rpx solid var(--theme-border);
  z-index: 9998;
  box-shadow: 0 -1rpx 4rpx rgba(0, 0, 0, 0.04);
}

.tab-bar__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 4rpx;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.92);
  }
}

.tab-bar__icon {
  font-size: 44rpx;
  line-height: 1;
  transition: transform 0.25s ease;
}

.tab-bar__label {
  font-size: 20rpx;
  line-height: 1;
  color: var(--theme-text-tertiary);
  transition: color 0.25s ease;
}

.tab-bar__item--active {
  .tab-bar__icon {
    transform: scale(1.1);
  }

  .tab-bar__label {
    color: var(--theme-primary);
    font-weight: 500;
  }
}
</style>
