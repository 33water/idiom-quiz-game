<template>
  <scroll-view class="page-shell" scroll-y>
    <!-- ===== 顶部：标题 + 连胜 ===== -->
    <view class="top-bar">
      <view class="top-bar__left">
        <text class="top-bar__logo">🤯</text>
        <text class="top-bar__title">脑洞大翻车</text>
      </view>
      <view v-if="user.winStreak > 0" class="top-bar__streak">
        <text class="top-bar__streak-icon">🔥</text>
        <text class="top-bar__streak-num">{{ user.winStreak }}</text>
        <text class="top-bar__streak-label">连胜</text>
      </view>
    </view>

    <!-- ===== 积分卡 + 签到 ===== -->
    <view class="score-card">
      <view class="score-card__info">
        <text class="score-card__label">当前积分</text>
        <text class="score-card__score">{{ user.score }}</text>
      </view>
      <view class="score-card__sign" @click="handleSignIn">
        <view v-if="!hasSignedIn" class="score-card__reddot"></view>
        <text class="score-card__sign-icon">📅</text>
        <text class="score-card__sign-text">签到</text>
      </view>
    </view>

    <!-- ===== 搜索栏 ===== -->
    <view class="search-bar" @click="handleSearch">
      <text class="search-bar__icon">🔍</text>
      <text class="search-bar__placeholder">搜索成语或谜面…</text>
    </view>

    <!-- ===== 每日推荐轮播 ===== -->
    <view v-if="slides.length > 0" class="carousel-section">
      <text class="section-title">🌟 每日推荐</text>
      <swiper
        class="carousel"
        :indicator-dots="true"
        :autoplay="true"
        :interval="4000"
        :duration="400"
        indicator-color="var(--theme-border)"
        indicator-active-color="var(--theme-primary)"
      >
        <swiper-item v-for="(item, i) in slides" :key="i">
          <view class="carousel__card" @click="handleSlideClick(item)">
            <text class="carousel__emoji">{{ item.emoji || '📝' }}</text>
            <view class="carousel__text">
              <text class="carousel__word">{{ item.word }}</text>
              <text class="carousel__hint">{{ item.meaning.slice(0, 30) }}…</text>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- ===== 常用小工具 ===== -->
    <view class="tools-section">
      <text class="section-title">🔧 常用工具</text>
      <view class="tools-grid">
        <view
          v-for="tool in tools"
          :key="tool.id"
          class="tools-grid__item"
          @click="handleToolClick(tool)"
        >
          <view class="tools-grid__icon" :style="{ backgroundColor: tool.bg }">
            <text>{{ tool.icon }}</text>
          </view>
          <text class="tools-grid__label">{{ tool.label }}</text>
        </view>
      </view>
    </view>

    <!-- ===== 游戏模式入口 ===== -->
    <view class="modes-section">
      <text class="section-title">🎮 游戏模式</text>

      <view class="mode-card mode-card--text" @click="handleModeClick('text')">
        <view class="mode-card__content">
          <text class="mode-card__icon">📝</text>
          <view class="mode-card__info">
            <text class="mode-card__title">文字猜成语</text>
            <text class="mode-card__desc">从文字提示猜出正确的成语</text>
          </view>
        </view>
        <text class="mode-card__arrow">›</text>
      </view>

      <view class="mode-card mode-card--image" @click="handleModeClick('image')">
        <view class="mode-card__content">
          <text class="mode-card__icon">🎨</text>
          <view class="mode-card__info">
            <text class="mode-card__title">看图猜成语</text>
            <text class="mode-card__desc">从图形意境联想成语</text>
          </view>
        </view>
        <text class="mode-card__arrow">›</text>
      </view>
    </view>

    <!-- ===== 答题模式切换 ===== -->
    <view class="answer-mode">
      <text class="answer-mode__label">答题模式</text>
      <view class="answer-mode__tabs">
        <view
          class="answer-mode__tab"
          :class="{ 'answer-mode__tab--active': answerMode === 'choice' }"
          @click="answerMode = 'choice'"
        >
          <text>📋 选项选择</text>
        </view>
        <view
          class="answer-mode__tab"
          :class="{ 'answer-mode__tab--active': answerMode === 'input' }"
          @click="answerMode = 'input'"
        >
          <text>✏️ 手动输入</text>
        </view>
      </view>
    </view>

    <!-- ===== 签到弹窗 ===== -->
    <SignInPopup
      :visible="showSignIn"
      @close="showSignIn = false"
    />

    <TabBar current="index" />
  </scroll-view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { user, hasSignedIn } from '@/data/userStore.js'
import { idioms } from '@/data/idioms.js'
import TabBar from '@/components/TabBar.vue'
import SignInPopup from '@/components/SignInPopup.vue'

const showSignIn = ref(false)
const slides = ref([])
const answerMode = ref('choice')

const tools = [
  { id: 'dictionary', icon: '📖', label: '成语词典', bg: '#E3F2FD', page: '/pages/dictionary/dictionary' },
  { id: 'statistics', icon: '📊', label: '学习统计', bg: '#E8F5E9', page: '/pages/statistics/statistics' },
  { id: 'error', icon: '❌', label: '错题本', bg: '#FFF3E0', page: '/pages/error/error' },
  { id: 'favorite', icon: '❤️', label: '收藏夹', bg: '#FCE4EC', page: '/pages/collection/collection' }
]

onMounted(() => {
  // 随机选 5 条成语作为轮播推荐
  const shuffled = [...idioms].sort(() => Math.random() - 0.5)
  slides.value = shuffled.slice(0, 5)
})

function handleSignIn() {
  if (hasSignedIn.value) {
    uni.showToast({ title: '今日已签到，明天再来吧！', icon: 'none' })
    return
  }
  showSignIn.value = true
}

function handleSearch() {
  uni.navigateTo({ url: '/pages/dictionary/dictionary' })
}

function handleSlideClick(item) {
  // 点击轮播跳转词典页
  uni.navigateTo({ url: '/pages/dictionary/dictionary' })
}

function handleToolClick(tool) {
  uni.navigateTo({ url: tool.page })
}

function handleModeClick(mode) {
  uni.navigateTo({
    url: `/pages/game/game?mode=${mode}&answerMode=${answerMode.value}`
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

// ===== 顶部栏 =====
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0 12rpx;
}

.top-bar__left {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.top-bar__logo {
  font-size: 40rpx;
  line-height: 1;
}

.top-bar__title {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--theme-text);
}

.top-bar__streak {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 8rpx 16rpx;
  background-color: #FFF3E0;
  border-radius: var(--radius-xl);
}

.top-bar__streak-icon {
  font-size: 26rpx;
}

.top-bar__streak-num {
  font-size: 28rpx;
  font-weight: 700;
  color: #E65100;
}

.top-bar__streak-label {
  font-size: 22rpx;
  color: #BF360C;
}

// ===== 积分卡 =====
.score-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 28rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  margin-bottom: 20rpx;
}

.score-card__label {
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
}

.score-card__score {
  font-size: 48rpx;
  font-weight: 700;
  color: var(--theme-primary);
  line-height: 1.2;
}

.score-card__sign {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
  padding: 12rpx 24rpx;
  background-color: var(--theme-bg);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color 0.2s;

  &:active {
    background-color: var(--theme-border);
  }
}

.score-card__reddot {
  position: absolute;
  top: 8rpx;
  right: 20rpx;
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background-color: var(--theme-error);
}

.score-card__sign-icon {
  font-size: 32rpx;
}

.score-card__sign-text {
  font-size: 22rpx;
  color: var(--theme-text-tertiary);
}

// ===== 搜索栏 =====
.search-bar {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx 24rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  margin-bottom: 28rpx;
  cursor: pointer;
  transition: box-shadow 0.2s;

  &:active {
    box-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.04);
  }
}

.search-bar__icon {
  font-size: 28rpx;
}

.search-bar__placeholder {
  font-size: 28rpx;
  color: var(--theme-text-placeholder);
}

// ===== 公共标题 =====
.section-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: var(--theme-text);
  margin-bottom: 16rpx;
}

// ===== 轮播 =====
.carousel-section {
  margin-bottom: 32rpx;
}

.carousel {
  height: 180rpx;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.carousel__card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  height: 100%;
  padding: 0 28rpx;
  background: linear-gradient(135deg, var(--theme-primary-light), var(--theme-primary));
  border-radius: var(--radius-lg);
  cursor: pointer;
}

.carousel__emoji {
  font-size: 64rpx;
  flex-shrink: 0;
}

.carousel__text {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.carousel__word {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}

.carousel__hint {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

// ===== 小工具 =====
.tools-section {
  margin-bottom: 32rpx;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
}

.tools-grid__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  padding: 16rpx 0;
  background-color: var(--theme-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.95);
  }
}

.tools-grid__icon {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);

  text {
    font-size: 36rpx;
  }
}

.tools-grid__label {
  font-size: 22rpx;
  color: var(--theme-text-secondary);
}

// ===== 游戏模式 =====
.modes-section {
  margin-bottom: 24rpx;
}

.mode-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 28rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  margin-bottom: 16rpx;
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.mode-card__content {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.mode-card__icon {
  font-size: 48rpx;
}

.mode-card__info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.mode-card__title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--theme-text);
}

.mode-card__desc {
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
}

.mode-card__arrow {
  font-size: 40rpx;
  color: var(--theme-text-placeholder);
  font-weight: 300;
}

// ===== 答题模式切换 =====
.answer-mode {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  margin-bottom: 32rpx;
}

.answer-mode__label {
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
  flex-shrink: 0;
}

.answer-mode__tabs {
  display: flex;
  flex: 1;
  background-color: var(--theme-bg);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.answer-mode__tab {
  flex: 1;
  text-align: center;
  padding: 12rpx 0;
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
  cursor: pointer;
  transition: all 0.25s ease;
}

.answer-mode__tab--active {
  background-color: var(--theme-card);
  color: var(--theme-primary);
  font-weight: 500;
  box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.06);
  border-radius: var(--radius-sm);
}
</style>
