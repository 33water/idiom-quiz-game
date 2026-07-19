<template>
  <scroll-view class="page-shell" scroll-y>
    <!-- ===== 顶部个人资料 ===== -->
    <view class="profile-header">
      <view class="profile-header__bg"></view>
      <view class="profile-header__avatar-ring" @click="handlePickAvatar">
        <image v-if="user.avatar" class="profile-header__avatar-img" :src="user.avatar" mode="aspectFill" />
        <text v-else class="profile-header__avatar">🤯</text>
        <view class="profile-header__avatar-overlay">
          <text class="profile-header__avatar-overlay-icon">📷</text>
        </view>
      </view>
      <view class="profile-header__nickname-row">
        <text class="profile-header__nickname">{{ user.nickname || '猜谜达人' }}</text>
        <text class="profile-header__nickname-edit" @click="showNicknameInput = true">✏️</text>
      </view>
      <view v-if="showNicknameInput" class="profile-header__nickname-overlay">
        <view class="profile-header__nickname-panel" @click.stop>
          <text class="profile-header__nickname-panel-title">修改昵称</text>
          <input
            class="profile-header__nickname-input"
            :value="nicknameDraft"
            @input="nicknameDraft = $event.detail.value"
            @confirm="handleSaveNickname"
            placeholder="输入新昵称"
            placeholder-class="profile-header__nickname-placeholder"
            maxlength="12"
          />
          <view class="profile-header__nickname-actions">
            <view class="profile-header__nickname-btn profile-header__nickname-btn--cancel" @click="showNicknameInput = false">取消</view>
            <view class="profile-header__nickname-btn profile-header__nickname-btn--save" @click="handleSaveNickname">保存</view>
          </view>
        </view>
      </view>
      <view class="profile-header__score-row">
        <text class="profile-header__score-label">积分</text>
        <text class="profile-header__score">{{ user.score }}</text>
      </view>
      <view class="profile-header__streak-row">
        <view class="profile-header__streak-item">
          <text class="profile-header__streak-num">{{ user.winStreak }}</text>
          <text class="profile-header__streak-label">当前连胜</text>
        </view>
        <view class="profile-header__streak-divider"></view>
        <view class="profile-header__streak-item">
          <text class="profile-header__streak-num">{{ user.maxStreak }}</text>
          <text class="profile-header__streak-label">最长连胜</text>
        </view>
      </view>
    </view>

    <!-- ===== 数据统计卡片 ===== -->
    <view class="stats-grid">
      <view class="stats-grid__card stats-grid__card--rounds">
        <text class="stats-grid__num">{{ user.totalRounds }}</text>
        <text class="stats-grid__label">总局数</text>
      </view>
      <view class="stats-grid__card stats-grid__card--accuracy">
        <text class="stats-grid__num">{{ accuracy }}%</text>
        <text class="stats-grid__label">正确率</text>
      </view>
      <view class="stats-grid__card stats-grid__card--best">
        <text class="stats-grid__num">{{ user.bestRound }}</text>
        <text class="stats-grid__label">最佳单轮</text>
      </view>
      <view class="stats-grid__card stats-grid__card--total">
        <text class="stats-grid__num">{{ user.totalCorrect }}</text>
        <text class="stats-grid__label">累计答对</text>
      </view>
    </view>

    <!-- ===== 成就徽章 ===== -->
    <view class="badges-section" v-if="earnedBadges.length > 0">
      <text class="section-title">🏅 成就徽章</text>
      <view class="badges-row">
        <view
          v-for="badge in earnedBadges"
          :key="badge.id"
          class="badges-row__item"
        >
          <view class="badges-row__icon">🏆</view>
          <text class="badges-row__name">{{ badge.name }}</text>
          <text class="badges-row__desc">{{ badge.desc }}</text>
        </view>
      </view>
    </view>

    <!-- ===== 快捷入口 ===== -->
    <view class="menu-section">
      <text class="section-title">📌 快捷入口</text>
      <view
        v-for="item in menuItems"
        :key="item.id"
        class="menu-item"
        @click="handleMenuClick(item)"
      >
        <view class="menu-item__left">
          <text class="menu-item__icon">{{ item.icon }}</text>
          <text class="menu-item__label">{{ item.label }}</text>
        </view>
        <view class="menu-item__right">
          <text v-if="item.badge != null" class="menu-item__badge">{{ item.badge }}</text>
          <text class="menu-item__arrow">›</text>
        </view>
      </view>
    </view>

    <!-- ===== 设置 ===== -->
    <view class="settings-section">
      <text class="section-title">⚙️ 设置</text>

      <view class="settings-item">
        <view class="settings-item__left">
          <text class="settings-item__icon">🔈</text>
          <text class="settings-item__label">音效</text>
        </view>
        <view class="settings-item__toggle" @click="toggleSound">
          <view
            class="settings-item__track"
            :class="{ 'settings-item__track--on': user.soundEnabled }"
          >
            <view class="settings-item__thumb"></view>
          </view>
        </view>
      </view>

      <view class="settings-item">
        <view class="settings-item__left">
          <text class="settings-item__icon">🤖</text>
          <text class="settings-item__label">AI 嘲讽</text>
        </view>
        <view class="settings-item__toggle" @click="toggleTaunt">
          <view
            class="settings-item__track"
            :class="{ 'settings-item__track--on': user.aiTauntEnabled }"
          >
            <view class="settings-item__thumb"></view>
          </view>
        </view>
      </view>

      <view class="settings-item">
        <view class="settings-item__left">
          <text class="settings-item__icon">🌓</text>
          <text class="settings-item__label">深浅模式</text>
        </view>
        <view class="settings-item__toggle" @click="toggleDarkMode">
          <view
            class="settings-item__track"
            :class="{ 'settings-item__track--on': user.darkMode }"
          >
            <view class="settings-item__thumb"></view>
          </view>
        </view>
      </view>

      <view class="settings-item settings-item--danger" @click="handleReset">
        <view class="settings-item__left">
          <text class="settings-item__icon">🔄</text>
          <text class="settings-item__label">重置积分</text>
        </view>
        <text class="settings-item__arrow">›</text>
      </view>

      <view class="settings-item settings-item--danger" @click="handleClearData">
        <view class="settings-item__left">
          <text class="settings-item__icon">🗑️</text>
          <text class="settings-item__label">清空数据</text>
        </view>
        <text class="settings-item__arrow">›</text>
      </view>
    </view>

    <!-- ===== 头像上传弹窗 ===== -->
    <view v-if="showAvatarPopup" class="avatar-popup-overlay" @click="showAvatarPopup = false">
      <view class="avatar-popup-panel" @click.stop>
        <view class="avatar-popup__handle"></view>
        <text class="avatar-popup__title">更换头像</text>
        <view class="avatar-popup__options">
          <view class="avatar-popup__option" @click="handleUploadAvatar">
            <text class="avatar-popup__option-icon">🖼️</text>
            <text class="avatar-popup__option-label">从本地上传照片</text>
          </view>
        </view>
        <view class="avatar-popup__cancel" @click="showAvatarPopup = false">
          <text>取消</text>
        </view>
      </view>
    </view>

    <TabBar current="profile" />
  </scroll-view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { user, accuracy, loadAll, updateProfile, resetScore, clearAllData, applyTheme, getBadgeInfo, BADGE_DEFS } from '@/data/userStore.js'
import TabBar from '@/components/TabBar.vue'

const showNicknameInput = ref(false)
const nicknameDraft = ref('')

const earnedBadges = computed(() => {
  return (user.badges || [])
    .map(id => getBadgeInfo(id))
    .filter(Boolean)
})

const menuItems = computed(() => [
  { id: 'statistics', icon: '📊', label: '学习统计', page: '/pages/statistics/statistics', badge: null },
  { id: 'history', icon: '🕐', label: '游戏记录', page: '/pages/history/history', badge: null },
  { id: 'error', icon: '❌', label: '错题本', page: '/pages/error/error', badge: null },
  { id: 'favorite', icon: '❤️', label: '收藏夹', page: '/pages/collection/collection', badge: null }
])

onMounted(() => {
  loadAll()
})

function handleMenuClick(item) {
  uni.navigateTo({ url: item.page })
}

function toggleSound() {
  updateProfile({ soundEnabled: !user.soundEnabled })
}

function toggleTaunt() {
  updateProfile({ aiTauntEnabled: !user.aiTauntEnabled })
}

function toggleDarkMode() {
  updateProfile({ darkMode: !user.darkMode })
  applyTheme()
  uni.showToast({
    title: user.darkMode ? '已切换深色模式' : '已切换浅色模式',
    icon: 'none'
  })
}

function handleSaveNickname() {
  const trimmed = nicknameDraft.value.trim()
  if (trimmed.length > 0) {
    updateProfile({ nickname: trimmed })
    uni.showToast({ title: '昵称已更新', icon: 'success' })
  }
  showNicknameInput.value = false
}

function handleReset() {
  uni.showModal({
    title: '重置积分',
    content: '确定要重置积分为 500 吗？连胜记录和徽章也会被清除。',
    success: (res) => {
      if (res.confirm) {
        resetScore()
        uni.showToast({ title: '已重置', icon: 'success' })
      }
    }
  })
}

function handleClearData() {
  uni.showModal({
    title: '清空所有数据',
    content: '此操作将清空积分、游戏记录、错题本和收藏夹，且不可恢复。确定继续？',
    confirmText: '确认清空',
    confirmColor: '#FF3B30',
    success: (res) => {
      if (res.confirm) {
        clearAllData()
        uni.showToast({ title: '已清空', icon: 'success' })
      }
    }
  })
}

const showAvatarPopup = ref(false)

function handlePickAvatar() {
  showAvatarPopup.value = true
}

function handleUploadAvatar() {
  showAvatarPopup.value = false
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album'],
    success: (res) => {
      const path = res.tempFilePaths[0]
      if (path) {
        updateProfile({ avatar: path })
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
  padding: 0 0 140rpx;
}

// ===== 顶部个人资料 =====
.profile-header {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 32rpx 32rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.profile-header__bg {
  position: absolute;
  top: -120rpx;
  right: -80rpx;
  width: 400rpx;
  height: 400rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.12), rgba(255, 107, 53, 0.04));
  pointer-events: none;
}

.profile-header__avatar-ring {
  position: relative;
  width: 130rpx;
  height: 130rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--theme-primary), var(--theme-accent));
  margin-bottom: 16rpx;
}

.profile-header__avatar {
  width: 120rpx;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--theme-card);
  border-radius: 50%;
  font-size: 64rpx;
}

.profile-header__avatar-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  display: block;
}

.profile-header__avatar-overlay {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.25s ease;
}

.profile-header__avatar-ring:active .profile-header__avatar-overlay {
  background-color: rgba(0, 0, 0, 0.35);
}

.profile-header__avatar-overlay-icon {
  font-size: 40rpx;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.profile-header__avatar-ring:active .profile-header__avatar-overlay-icon {
  opacity: 1;
}

.profile-header__nickname {
  font-size: 34rpx;
  font-weight: 700;
  color: var(--theme-text);
}

.profile-header__nickname-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 12rpx;
}

.profile-header__nickname-edit {
  font-size: 28rpx;
  cursor: pointer;
  padding: 4rpx;
  opacity: 0.5;
  transition: opacity 0.2s;

  &:active {
    opacity: 1;
  }
}

// 昵称编辑弹窗
.profile-header__nickname-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.35);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-header__nickname-panel {
  width: 560rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-xl);
  padding: 40rpx 36rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.12);
}

.profile-header__nickname-panel-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: var(--theme-text);
  text-align: center;
  margin-bottom: 28rpx;
}

.profile-header__nickname-input {
  height: 80rpx;
  background-color: var(--theme-bg);
  border-radius: var(--radius-md);
  padding: 0 24rpx;
  font-size: 30rpx;
  color: var(--theme-text);
  text-align: center;
  margin-bottom: 28rpx;
}

.profile-header__nickname-placeholder {
  color: var(--theme-text-placeholder);
  font-size: 28rpx;
}

.profile-header__nickname-actions {
  display: flex;
  gap: 16rpx;
}

.profile-header__nickname-btn {
  flex: 1;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-size: 28rpx;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  &:active {
    opacity: 0.8;
  }
}

.profile-header__nickname-btn--cancel {
  background-color: var(--theme-bg);
  color: var(--theme-text-secondary);
}

.profile-header__nickname-btn--save {
  background-color: var(--theme-primary);
  color: #ffffff;
}

.profile-header__score-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 20rpx;
}

.profile-header__score-label {
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
}

.profile-header__score {
  font-size: 44rpx;
  font-weight: 700;
  color: var(--theme-primary);
  line-height: 1;
}

.profile-header__streak-row {
  display: flex;
  align-items: center;
  gap: 32rpx;
  padding: 16rpx 40rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
}

.profile-header__streak-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.profile-header__streak-num {
  font-size: 36rpx;
  font-weight: 700;
  color: #E65100;
}

.profile-header__streak-label {
  font-size: 20rpx;
  color: var(--theme-text-tertiary);
}

.profile-header__streak-divider {
  width: 1rpx;
  height: 40rpx;
  background-color: var(--theme-border);
}

// ===== 数据统计卡片 =====
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
  padding: 0 32rpx;
  margin-bottom: 28rpx;
}

.stats-grid__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
  padding: 20rpx 8rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.stats-grid__num {
  font-size: 36rpx;
  font-weight: 700;
}

.stats-grid__label {
  font-size: 20rpx;
  color: var(--theme-text-tertiary);
  text-align: center;
}

.stats-grid__card--rounds .stats-grid__num { color: var(--theme-primary); }
.stats-grid__card--accuracy .stats-grid__num { color: var(--theme-accent); }
.stats-grid__card--best .stats-grid__num { color: var(--theme-warning); }
.stats-grid__card--total .stats-grid__num { color: var(--theme-success); }

// ===== 公共标题 =====
.section-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: var(--theme-text);
  margin-bottom: 16rpx;
}

// ===== 成就徽章 =====
.badges-section {
  padding: 0 32rpx;
  margin-bottom: 28rpx;
}

.badges-row {
  display: flex;
  gap: 16rpx;
  overflow-x: auto;
  padding-bottom: 4rpx;
}

.badges-row__item {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
  padding: 20rpx 24rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.badges-row__icon {
  font-size: 48rpx;
}

.badges-row__name {
  font-size: 24rpx;
  font-weight: 600;
  color: var(--theme-text);
}

.badges-row__desc {
  font-size: 20rpx;
  color: var(--theme-text-tertiary);
  text-align: center;
}

// ===== 快捷入口 =====
.menu-section {
  padding: 0 32rpx;
  margin-bottom: 28rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 24rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  margin-bottom: 12rpx;
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.menu-item__left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.menu-item__icon {
  font-size: 36rpx;
}

.menu-item__label {
  font-size: 28rpx;
  color: var(--theme-text);
}

.menu-item__right {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.menu-item__badge {
  padding: 2rpx 14rpx;
  font-size: 20rpx;
  color: #ffffff;
  background-color: var(--theme-error);
  border-radius: var(--radius-xl);
}

.menu-item__arrow {
  font-size: 36rpx;
  color: var(--theme-text-placeholder);
  font-weight: 300;
}

// ===== 设置 =====
.settings-section {
  padding: 0 32rpx;
  margin-bottom: 28rpx;
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 24rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  margin-bottom: 12rpx;
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.settings-item__left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.settings-item__icon {
  font-size: 32rpx;
}

.settings-item__label {
  font-size: 28rpx;
  color: var(--theme-text);
}

.settings-item__arrow {
  font-size: 36rpx;
  color: var(--theme-text-placeholder);
  font-weight: 300;
}

// Toggle Switch
.settings-item__track {
  width: 88rpx;
  height: 48rpx;
  border-radius: 24rpx;
  background-color: var(--theme-border);
  position: relative;
  transition: background-color 0.25s ease;
  cursor: pointer;
}

.settings-item__track--on {
  background-color: var(--theme-primary);
}

.settings-item__thumb {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #ffffff;
  position: absolute;
  top: 4rpx;
  left: 4rpx;
  box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.15);
  transition: transform 0.25s ease;
}

.settings-item__track--on .settings-item__thumb {
  transform: translateX(40rpx);
}

.settings-item--danger {
  .settings-item__label {
    color: var(--theme-error);
  }
}

// ===== 头像上传弹窗 =====
.avatar-popup-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  animation: avatarFadeIn 0.25s ease;
}

.avatar-popup-panel {
  width: 100%;
  background-color: var(--theme-card);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: 16rpx 32rpx 40rpx;
  animation: avatarSlideUp 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-popup__handle {
  width: 60rpx;
  height: 6rpx;
  border-radius: 3rpx;
  background-color: var(--theme-border);
  margin-bottom: 24rpx;
}

.avatar-popup__title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--theme-text);
  margin-bottom: 28rpx;
}

.avatar-popup__options {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 24rpx;
}

.avatar-popup__option {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  height: 88rpx;
  background-color: var(--theme-bg);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: opacity 0.2s;

  &:active {
    opacity: 0.75;
  }
}

.avatar-popup__option-icon {
  font-size: 32rpx;
}

.avatar-popup__option-label {
  font-size: 28rpx;
  color: var(--theme-text);
  font-weight: 500;
}

.avatar-popup__cancel {
  width: 100%;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background-color: var(--theme-bg);
  cursor: pointer;
  transition: opacity 0.2s;

  &:active {
    opacity: 0.75;
  }

  text {
    font-size: 28rpx;
    color: var(--theme-text-tertiary);
  }
}

@keyframes avatarFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes avatarSlideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>
