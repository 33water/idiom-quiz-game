<script>
export default {
  onLaunch() {
    console.log('App Launch')
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  }
}
</script>

<script setup>
// Vue 3 composition imports go here
import { onMounted } from 'vue'
import { loadAll } from '@/data/userStore.js'

onMounted(() => {
  // 加载用户数据并同步主题（darkMode → data-theme）
  loadAll()
})
</script>

<style lang="scss">
@import 'uni.scss';

/* 全局基础样式 */
page {
  background-color: var(--theme-bg);
  color: var(--theme-text);
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

view,
scroll-view,
swiper {
  box-sizing: border-box;
}
</style>
