<template>
  <scroll-view class="page-shell" scroll-y>
    <!-- ===== 顶部标题 ===== -->
    <view class="page-header">
      <text class="page-header__back" @click="goBack">‹</text>
      <text class="page-header__title">📖 成语词典</text>
    </view>

    <!-- ===== 搜索栏 ===== -->
    <view class="search-box">
      <text class="search-box__icon">🔍</text>
      <input
        class="search-box__input"
        type="text"
        placeholder="输入成语、拼音或释义…"
        placeholder-class="search-box__placeholder"
        :value="keyword"
        @input="handleInput"
        confirm-type="search"
      />
      <text v-if="keyword.length > 0" class="search-box__clear" @click="handleClear">✕</text>
    </view>

    <!-- ===== 分类筛选 ===== -->
    <view class="category-bar">
      <scroll-view scroll-x class="category-bar__scroll" show-scrollbar="false">
        <view
          v-for="cat in allCategories"
          :key="cat"
          class="category-bar__chip"
          :class="{ 'category-bar__chip--active': selectedCategory === cat }"
          @click="selectedCategory = cat"
        >
          <text>{{ cat }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- ===== 搜索结果提示 ===== -->
    <view v-if="keyword.length > 0 && filteredList.length > 0" class="result-hint">
      <text>共找到 {{ filteredList.length }} 条结果</text>
    </view>

    <!-- ===== 空状态 ===== -->
    <view v-if="filteredList.length === 0" class="empty">
      <text class="empty__icon">{{ keyword.length > 0 ? '😅' : '📖' }}</text>
      <text class="empty__text">{{ keyword.length > 0 ? '没有找到匹配的成语' : '搜索你感兴趣的成语吧' }}</text>
      <text v-if="keyword.length > 0" class="empty__sub">试试其他关键词</text>
    </view>

    <!-- ===== 成语列表 ===== -->
    <view v-else class="dict-list">
      <view
        v-for="item in filteredList"
        :key="item.id"
        class="dict-card"
        @click="handleCardClick(item)"
      >
        <view class="dict-card__top">
          <text class="dict-card__emoji">{{ item.emoji || '📝' }}</text>
          <view class="dict-card__header-text">
            <text class="dict-card__word">{{ item.word }}</text>
            <text class="dict-card__pinyin">{{ item.pinyin }}</text>
          </view>
          <view class="dict-card__difficulty">
            <text
              v-for="d in item.difficulty"
              :key="d"
              class="dict-card__dot"
            ></text>
          </view>
        </view>
        <text class="dict-card__meaning">{{ item.meaning }}</text>
        <view class="dict-card__bottom">
          <text class="dict-card__category">{{ item.category }}</text>
          <text class="dict-card__source">{{ item.source }}</text>
        </view>
      </view>
    </view>

    <!-- ===== 成语详情弹窗 ===== -->
    <IdiomDetailPopup
      v-model:visible="showDetail"
      :idiom="selectedIdiom"
      @close="showDetail = false"
    />

    <TabBar current="index" />
  </scroll-view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { idioms, categories } from '@/data/idioms.js'
import TabBar from '@/components/TabBar.vue'
import IdiomDetailPopup from '@/components/IdiomDetailPopup.vue'

const keyword = ref('')
const selectedCategory = ref('全部')
const showDetail = ref(false)
const selectedIdiom = ref({})

const allCategories = computed(() => ['全部', ...categories])

const filteredList = computed(() => {
  let result = idioms

  // 分类筛选
  if (selectedCategory.value !== '全部') {
    result = result.filter(item => item.category === selectedCategory.value)
  }

  // 关键词搜索
  const kw = keyword.value.trim().toLowerCase()
  if (kw.length > 0) {
    result = result.filter(item => {
      return (
        item.word.includes(kw) ||
        item.pinyin.toLowerCase().includes(kw) ||
        item.meaning.toLowerCase().includes(kw)
      )
    })
  }

  return result
})

onMounted(() => {
  loadAll()
})

function loadAll() {
  // 从 userStore 加载数据（确保收藏/错题状态同步）
  // 实际 store 加载由 IdiomDetailPopup 内部处理
}

function handleInput(e) {
  keyword.value = e.detail.value
}

function handleClear() {
  keyword.value = ''
}

// ===== 返回上一页 =====
function goBack() {
  uni.navigateBack()
}

function handleCardClick(item) {
  selectedIdiom.value = item
  showDetail.value = true
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
  padding: 24rpx 0 16rpx;
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

// ===== 搜索栏 =====
.search-box {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 0 24rpx;
  height: 80rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  margin-bottom: 16rpx;
}

.search-box__icon {
  font-size: 28rpx;
  flex-shrink: 0;
}

.search-box__input {
  flex: 1;
  font-size: 28rpx;
  color: var(--theme-text);
  height: 100%;
}

.search-box__placeholder {
  color: var(--theme-text-placeholder);
  font-size: 28rpx;
}

.search-box__clear {
  font-size: 28rpx;
  color: var(--theme-text-placeholder);
  cursor: pointer;
  padding: 8rpx;
  flex-shrink: 0;

  &:active {
    color: var(--theme-text-tertiary);
  }
}

// ===== 分类筛选 =====
.category-bar {
  margin-bottom: 16rpx;
}

.category-bar__scroll {
  display: flex;
  white-space: nowrap;
  padding-bottom: 4rpx;
}

.category-bar__chip {
  display: inline-flex;
  align-items: center;
  padding: 10rpx 24rpx;
  margin-right: 12rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: all 0.25s ease;

  text {
    font-size: 24rpx;
    color: var(--theme-text-tertiary);
  }

  &:active {
    transform: scale(0.95);
  }
}

.category-bar__chip--active {
  background: linear-gradient(135deg, var(--theme-primary), var(--theme-primary-dark, #E55A2B));

  text {
    color: #ffffff;
    font-weight: 500;
  }
}

// ===== 结果提示 =====
.result-hint {
  margin-bottom: 12rpx;

  text {
    font-size: 22rpx;
    color: var(--theme-text-tertiary);
  }
}

// ===== 空状态 =====
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
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

// ===== 成语列表 =====
.dict-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.dict-card {
  padding: 24rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.dict-card__top {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.dict-card__emoji {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #E3F2FD;
  border-radius: var(--radius-md);
  font-size: 36rpx;
  flex-shrink: 0;
}

.dict-card__header-text {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
  flex: 1;
}

.dict-card__word {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--theme-text);
}

.dict-card__pinyin {
  font-size: 22rpx;
  color: var(--theme-text-tertiary);
}

.dict-card__difficulty {
  display: flex;
  gap: 6rpx;
  flex-shrink: 0;
}

.dict-card__dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background-color: var(--theme-primary);
}

.dict-card__meaning {
  font-size: 26rpx;
  color: var(--theme-text-secondary);
  line-height: 1.6;
  margin-bottom: 12rpx;
}

.dict-card__bottom {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.dict-card__category {
  font-size: 22rpx;
  color: var(--theme-accent);
  font-weight: 500;
}

.dict-card__source {
  font-size: 20rpx;
  color: var(--theme-text-placeholder);
}
</style>
