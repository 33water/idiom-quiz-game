<template>
  <scroll-view class="page-shell" scroll-y>
    <!-- ===== 顶部标题 ===== -->
    <view class="page-header">
      <view class="page-header__left">
        <text class="page-header__back" @click="goBack">‹</text>
        <text class="page-header__title">❌ 错题本</text>
        <text class="page-header__count" v-if="errorList.length > 0">
          {{ errorList.length }} 条
        </text>
      </view>
      <text
        v-if="errorList.length > 0"
        class="page-header__clear"
        @click="handleClearAll"
      >清空</text>
    </view>

    <!-- ===== 空状态 ===== -->
    <view v-if="errorList.length === 0" class="empty">
      <text class="empty__icon">🎉</text>
      <text class="empty__text">暂无错题记录</text>
      <text class="empty__sub">继续保持！</text>
    </view>

    <!-- ===== 错题列表 ===== -->
    <view v-else class="error-list">
      <view
        v-for="(item, i) in errorList"
        :key="item.id"
        class="error-card"
        @click="handleCardClick(item)"
      >
        <view class="error-card__left">
          <text class="error-card__emoji">{{ item.emoji || '📝' }}</text>
          <view class="error-card__info">
            <view class="error-card__top-row">
              <text class="error-card__word">{{ item.word }}</text>
              <text class="error-card__pinyin">{{ item.pinyin }}</text>
            </view>
            <text class="error-card__meaning">{{ item.meaning.slice(0, 40) }}…</text>
          </view>
        </view>
        <view class="error-card__remove" @click.stop="handleRemove(item.id)">
          <text>✕</text>
        </view>
      </view>
    </view>

    <!-- ===== 底部复习按钮 ===== -->
    <view v-if="errorList.length > 0" class="bottom-bar">
      <view class="review-btn" @click="handleReview">
        <text class="review-btn__icon">🔄</text>
        <text>复习错题（{{ errorList.length }} 题）</text>
      </view>
    </view>

    <!-- ===== 成语详情弹窗 ===== -->
    <IdiomDetailPopup
      v-model:visible="showDetail"
      :idiom="selectedIdiom"
      @close="showDetail = false"
    >
      <template #actions>
        <view class="popup__actions">
          <view class="popup__action-btn" @click="handleDetailRemoveError">
            <text class="popup__action-icon">{{ isErrorInDetail ? '✅' : '➕' }}</text>
            <text>{{ isErrorInDetail ? '已在错题本' : '加入错题本' }}</text>
          </view>
          <view class="popup__action-btn" @click="handleDetailToggleFav">
            <text class="popup__action-icon">{{ isFavInDetail ? '❤️' : '🤍' }}</text>
            <text>{{ isFavInDetail ? '取消收藏' : '收藏' }}</text>
          </view>
        </view>
      </template>
    </IdiomDetailPopup>

    <TabBar current="profile" />
  </scroll-view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { errors, loadAll, removeError, clearErrors, hasError, addError, toggleFavorite, isFavorite } from '@/data/userStore.js'
import { idioms } from '@/data/idioms.js'
import TabBar from '@/components/TabBar.vue'
import IdiomDetailPopup from '@/components/IdiomDetailPopup.vue'

const showDetail = ref(false)
const selectedIdiom = ref({})

// slot #actions 所需的状态和操作
const isErrorInDetail = computed(() => hasError(selectedIdiom.value.id))
const isFavInDetail = computed(() => isFavorite(selectedIdiom.value.id))

function handleDetailRemoveError() {
  if (isErrorInDetail.value) {
    removeError(selectedIdiom.value.id)
  } else {
    addError(selectedIdiom.value.id)
  }
}

function handleDetailToggleFav() {
  toggleFavorite(selectedIdiom.value.id)
}

const errorList = computed(() => {
  return errors
    .map(id => idioms.find(item => item.id === id))
    .filter(Boolean)
})

onMounted(() => {
  loadAll()
})

function handleCardClick(item) {
  selectedIdiom.value = item
  showDetail.value = true
}

function handleRemove(id) {
  removeError(id)
}

function handleClearAll() {
  uni.showModal({
    title: '清空错题本',
    content: '确定要清空所有错题记录吗？',
    success: (res) => {
      if (res.confirm) {
        clearErrors()
      }
    }
  })
}

// ===== 返回上一页 =====
function goBack() {
  uni.navigateBack()
}

function handleReview() {
  const ids = errors.join(',')
  uni.navigateTo({
    url: `/pages/game/game?mode=text&answerMode=choice&reviewMode=true&reviewIds=${ids}`
  })
}
</script>

<style lang="scss" scoped>
.page-shell {
  width: 100%;
  height: 100vh;
  background-color: var(--theme-bg);
  padding: 0 32rpx 180rpx;
}

// ===== 页面标题 =====
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0 20rpx;
}

.page-header__left {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
}

.page-header__back {
  font-size: 44rpx;
  font-weight: 300;
  color: var(--theme-text);
  cursor: pointer;
  padding: 8rpx 8rpx 8rpx 0;
  flex-shrink: 0;
  line-height: 1;
}

.page-header__title {
  font-size: 34rpx;
  font-weight: 700;
  color: var(--theme-text);
}

.page-header__count {
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
}

.page-header__clear {
  font-size: 26rpx;
  color: var(--theme-error);
  cursor: pointer;
  padding: 8rpx 16rpx;
  border-radius: var(--radius-sm);
  transition: background-color 0.2s;

  &:active {
    background-color: rgba(244, 67, 54, 0.08);
  }
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

// ===== 错题卡片列表 =====
.error-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.error-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 20rpx 20rpx 24rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.error-card__left {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex: 1;
  min-width: 0;
}

.error-card__emoji {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFF3E0;
  border-radius: var(--radius-md);
  font-size: 40rpx;
  flex-shrink: 0;
}

.error-card__info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  min-width: 0;
}

.error-card__top-row {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
}

.error-card__word {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--theme-text);
}

.error-card__pinyin {
  font-size: 22rpx;
  color: var(--theme-text-tertiary);
}

.error-card__meaning {
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
}

.error-card__remove {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--theme-bg);
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.2s;

  &:active {
    background-color: #fce4ec;
  }

  text {
    font-size: 26rpx;
    color: var(--theme-text-placeholder);
  }
}

// ===== 底部复习按钮 =====
.bottom-bar {
  position: fixed;
  bottom: calc(140rpx + env(safe-area-inset-bottom));
  left: 0;
  right: 0;
  padding: 16rpx 32rpx;
  background-color: var(--theme-bg);
}

.review-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  height: 88rpx;
  background: linear-gradient(135deg, var(--theme-primary), var(--theme-primary-dark, #E55A2B));
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: opacity 0.2s;

  &:active {
    opacity: 0.9;
  }

  text {
    font-size: 30rpx;
    font-weight: 600;
    color: #ffffff;
  }
}

.review-btn__icon {
  font-size: 34rpx;
}

// ===== TabBar 覆盖 =====
.tab-bar {
  z-index: 10;
}
</style>
