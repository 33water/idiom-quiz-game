<template>
  <view
    class="idiom-card"
    :class="{
      'idiom-card--compact': compact,
      'idiom-card--clickable': !!$attrs.onClick
    }"
    @click="handleClick"
  >
    <!-- emoji 图标区 -->
    <view class="idiom-card__emoji">
      <text>{{ idiom.emoji || '📝' }}</text>
    </view>

    <!-- 文字信息区 -->
    <view class="idiom-card__content">
      <text class="idiom-card__word">{{ idiom.word }}</text>
      <text class="idiom-card__pinyin">{{ idiom.pinyin }}</text>
      <text v-if="showMeaning && idiom.meaning" class="idiom-card__meaning">
        {{ idiom.meaning }}
      </text>
    </view>

    <!-- 难度标记 -->
    <view class="idiom-card__difficulty">
      <text
        v-for="n in 5"
        :key="n"
        class="idiom-card__dot"
        :class="{ 'idiom-card__dot--active': n <= idiom.difficulty }"
      ></text>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  idiom: {
    type: Object,
    required: true
  },
  showMeaning: {
    type: Boolean,
    default: false
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click', props.idiom)
}
</script>

<style lang="scss" scoped>
.idiom-card {
  display: flex;
  align-items: center;
  padding: 24rpx 20rpx;
  background-color: var(--theme-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  gap: 16rpx;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.idiom-card--clickable:active {
  transform: scale(0.98);
  box-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.04);
}

.idiom-card--compact {
  padding: 16rpx 20rpx;

  .idiom-card__emoji text {
    font-size: 40rpx;
  }

  .idiom-card__word {
    font-size: 30rpx;
  }

  .idiom-card__pinyin {
    font-size: 22rpx;
  }
}

.idiom-card__emoji {
  flex-shrink: 0;
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--theme-bg);
  border-radius: var(--radius-sm);

  text {
    font-size: 48rpx;
    line-height: 1;
  }
}

.idiom-card__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.idiom-card__word {
  font-size: 34rpx;
  font-weight: 600;
  color: var(--theme-text);
  line-height: 1.3;
}

.idiom-card__pinyin {
  font-size: 24rpx;
  color: var(--theme-text-tertiary);
  line-height: 1.3;
}

.idiom-card__meaning {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: var(--theme-text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.idiom-card__difficulty {
  flex-shrink: 0;
  display: flex;
  gap: 4rpx;
  align-items: center;
  padding-left: 8rpx;
}

.idiom-card__dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background-color: var(--theme-border);
  transition: background-color 0.25s ease;
}

.idiom-card__dot--active {
  background-color: var(--theme-primary);
}
</style>
