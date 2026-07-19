<template>
  <view v-if="visible" class="popup-overlay" @click="handleClose">
    <view class="popup-panel" @click.stop>
      <view class="popup__handle"></view>

      <!-- 头部：成语 + emoji -->
      <view class="popup__header">
        <text class="popup__emoji">{{ idiom.emoji || '📝' }}</text>
        <view class="popup__header-text">
          <text class="popup__word">{{ idiom.word }}</text>
          <text class="popup__pinyin">{{ idiom.pinyin }}</text>
        </view>
      </view>

      <!-- 释义 -->
      <view class="popup__section">
        <text class="popup__label">释义</text>
        <text class="popup__text">{{ idiom.meaning }}</text>
      </view>

      <!-- 出处 -->
      <view v-if="idiom.source" class="popup__section">
        <text class="popup__label">出处</text>
        <text class="popup__text">{{ idiom.source }}</text>
      </view>

      <!-- 例句 -->
      <view v-if="idiom.example" class="popup__section">
        <text class="popup__label">例句</text>
        <text class="popup__text">{{ idiom.example }}</text>
      </view>

      <!-- 近义词 / 反义词 -->
      <view class="popup__row">
        <view v-if="idiom.synonyms" class="popup__chip-group">
          <text class="popup__chip-label">近义词</text>
          <view class="popup__chips">
            <text
              v-for="(s, i) in idiom.synonyms.split('、')"
              :key="i"
              class="popup__chip popup__chip--syn"
            >{{ s }}</text>
          </view>
        </view>
        <view v-if="idiom.antonyms" class="popup__chip-group">
          <text class="popup__chip-label">反义词</text>
          <view class="popup__chips">
            <text
              v-for="(a, i) in idiom.antonyms.split('、')"
              :key="i"
              class="popup__chip popup__chip--ant"
            >{{ a }}</text>
          </view>
        </view>
      </view>

      <!-- 底部按钮（支持通过 #actions slot 自定义） -->
      <slot name="actions">
        <view class="popup__actions">
          <view class="popup__action-btn" @click="handleToggleError">
            <text class="popup__action-icon">{{ isError ? '✅' : '➕' }}</text>
            <text>{{ isError ? '已在错题本' : '加入错题本' }}</text>
          </view>
          <view class="popup__action-btn" @click="handleToggleFavorite">
            <text class="popup__action-icon">{{ isFav ? '❤️' : '🤍' }}</text>
            <text>{{ isFav ? '取消收藏' : '收藏' }}</text>
          </view>
        </view>
      </slot>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { hasError, addError, removeError, isFavorite, toggleFavorite } from '@/data/userStore.js'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  idiom: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'update:visible'])

const isError = computed(() => hasError(props.idiom.id))
const isFav = computed(() => isFavorite(props.idiom.id))

function handleToggleError() {
  if (isError.value) {
    removeError(props.idiom.id)
  } else {
    addError(props.idiom.id)
  }
}

function handleToggleFavorite() {
  toggleFavorite(props.idiom.id)
}

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
  max-height: 80vh;
  overflow-y: auto;
  background-color: var(--theme-card);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: 16rpx 32rpx 48rpx;
  animation: slideUp 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.popup__handle {
  width: 60rpx;
  height: 6rpx;
  border-radius: 3rpx;
  background-color: var(--theme-border);
  margin: 0 auto 24rpx;
}

.popup__header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 28rpx;
}

.popup__emoji {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--theme-bg);
  border-radius: var(--radius-md);
  font-size: 52rpx;
  flex-shrink: 0;
}

.popup__header-text {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.popup__word {
  font-size: 38rpx;
  font-weight: 700;
  color: var(--theme-text);
}

.popup__pinyin {
  font-size: 26rpx;
  color: var(--theme-text-tertiary);
}

.popup__section {
  margin-bottom: 20rpx;
}

.popup__label {
  display: block;
  font-size: 22rpx;
  font-weight: 500;
  color: var(--theme-text-tertiary);
  margin-bottom: 6rpx;
  text-transform: uppercase;
  letter-spacing: 1rpx;
}

.popup__text {
  font-size: 28rpx;
  color: var(--theme-text-secondary);
  line-height: 1.6;
}

.popup__row {
  display: flex;
  gap: 20rpx;
  margin-bottom: 28rpx;
}

.popup__chip-group {
  flex: 1;
}

.popup__chip-label {
  display: block;
  font-size: 22rpx;
  color: var(--theme-text-tertiary);
  margin-bottom: 8rpx;
}

.popup__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.popup__chip {
  padding: 6rpx 16rpx;
  font-size: 24rpx;
  border-radius: var(--radius-sm);
  line-height: 1.4;
}

.popup__chip--syn {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.popup__chip--ant {
  background-color: #fce4ec;
  color: #c62828;
}

.popup__actions {
  display: flex;
  gap: 16rpx;
}

.popup__action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  height: 80rpx;
  background-color: var(--theme-bg);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:active {
    background-color: var(--theme-border);
  }

  text {
    font-size: 26rpx;
    color: var(--theme-text-secondary);
  }
}

.popup__action-icon {
  font-size: 30rpx;
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
