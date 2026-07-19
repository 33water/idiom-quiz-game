<template>
  <scroll-view class="page-shell" scroll-y>
    <!-- ===== 顶部标题 ===== -->
    <view class="page-header">
      <view class="page-header__left">
        <text class="page-header__back" @click="goBack">‹</text>
        <text class="page-header__title">❤️ 收藏夹</text>
        <text class="page-header__count" v-if="favList.length > 0">
          {{ favList.length }} 条
        </text>
      </view>
      <text
        v-if="favList.length > 0"
        class="page-header__clear"
        @click="handleClearAll"
      >清空</text>
    </view>

    <!-- ===== 空状态 ===== -->
    <view v-if="favList.length === 0" class="empty">
      <text class="empty__icon">🤍</text>
      <text class="empty__text">还没有收藏的成语</text>
      <text class="empty__sub">遇到喜欢的成语可以收藏起来</text>
    </view>

    <!-- ===== 收藏列表 ===== -->
    <view v-else class="fav-list">
      <view
        v-for="(item, i) in favList"
        :key="item.id"
        class="fav-card"
        @click="handleCardClick(item)"
      >
        <view class="fav-card__left">
          <text class="fav-card__emoji">{{ item.emoji || '📝' }}</text>
          <view class="fav-card__info">
            <view class="fav-card__top-row">
              <text class="fav-card__word">{{ item.word }}</text>
              <text class="fav-card__pinyin">{{ item.pinyin }}</text>
            </view>
            <text class="fav-card__meaning">{{ item.meaning.slice(0, 40) }}…</text>
          </view>
        </view>
        <view class="fav-card__remove" @click.stop="handleRemove(item.id)">
          <text>✕</text>
        </view>
      </view>
    </view>

    <!-- ===== 成语详情弹窗 ===== -->
    <IdiomDetailPopup
      v-model:visible="showDetail"
      :idiom="selectedIdiom"
      @close="showDetail = false"
    />

    <TabBar current="profile" />
  </scroll-view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { favorites, loadAll, toggleFavorite, clearFavorites } from '@/data/userStore.js'
import { idioms } from '@/data/idioms.js'
import TabBar from '@/components/TabBar.vue'
import IdiomDetailPopup from '@/components/IdiomDetailPopup.vue'

const showDetail = ref(false)
const selectedIdiom = ref({})

const favList = computed(() => {
  return favorites
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
  toggleFavorite(id)
}

// ===== 返回上一页 =====
function goBack() {
  uni.navigateBack()
}

function handleClearAll() {
  uni.showModal({
    title: '清空收藏夹',
    content: '确定要清空所有收藏吗？',
    success: (res) => {
      if (res.confirm) {
        clearFavorites()
      }
    }
  })
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

// ===== 收藏卡片列表 =====
.fav-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.fav-card {
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

.fav-card__left {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex: 1;
  min-width: 0;
}

.fav-card__emoji {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FCE4EC;
  border-radius: var(--radius-md);
  font-size: 40rpx;
  flex-shrink: 0;
}

.fav-card__info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  min-width: 0;
}

.fav-card__top-row {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
}

.fav-card__word {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--theme-text);
}

.fav-card__pinyin {
  font-size: 22rpx;
  color: var(--theme-text-tertiary);
}

.fav-card__meaning {
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
}

.fav-card__remove {
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
</style>
