import { reactive, computed } from 'vue'

// ========================================
// localStorage 键名常量
// ========================================
const KEYS = {
  USER: 'user_data',
  ERRORS: 'idiom_errors',
  FAVORITES: 'idiom_favorites',
  RECORDS: 'idiom_records'
}

// ========================================
// 默认值
// ========================================
const defaultUser = {
  score: 500,
  nickname: '猜谜达人',
  winStreak: 0,
  maxStreak: 0,
  totalQuestions: 0,
  totalCorrect: 0,
  totalRounds: 0,
  consecutiveWrong: 0,
  aiTauntEnabled: true,
  soundEnabled: false,
  darkMode: false,
  lastSignInDate: null,
  badges: [],
  bestRound: 0,
  avatar: ''
}

// ========================================
// Reactive 状态
// ========================================
const user = reactive({ ...defaultUser })
const errors = reactive([])
const favorites = reactive([])
const records = reactive([])

// ========================================
// 计算属性
// ========================================
const accuracy = computed(() => {
  if (user.totalQuestions === 0) return 0
  return Math.round((user.totalCorrect / user.totalQuestions) * 100)
})

const todayScore = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  return records
    .filter(r => r.date && r.date.slice(0, 10) === today)
    .reduce((sum, r) => sum + (r.scoreEarned || 0), 0)
})

const hasSignedIn = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  return user.lastSignInDate === today
})

// ========================================
// 存储工具
// ========================================
function loadAll() {
  try {
    const saved = uni.getStorageSync(KEYS.USER)
    if (saved) Object.assign(user, saved)

    const savedErrors = uni.getStorageSync(KEYS.ERRORS)
    if (savedErrors) {
      errors.splice(0, errors.length, ...savedErrors)
    }

    const savedFavs = uni.getStorageSync(KEYS.FAVORITES)
    if (savedFavs) {
      favorites.splice(0, favorites.length, ...savedFavs)
    }

    const savedRecords = uni.getStorageSync(KEYS.RECORDS)
    if (savedRecords) {
      records.splice(0, records.length, ...savedRecords)
    }

    // 数据加载完成后同步主题
    applyTheme()
  } catch (e) {
    console.warn('[userStore] loadAll error:', e)
  }
}

/**
 * 将 user.darkMode 同步到 DOM 的 data-theme 属性
 */
function applyTheme() {
  try {
    const isDark = user.darkMode
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
  } catch (e) {
    console.warn('[userStore] applyTheme error:', e)
  }
}

function saveUser() {
  try {
    uni.setStorageSync(KEYS.USER, { ...user })
  } catch (e) {
    console.warn('[userStore] saveUser error:', e)
  }
}

function saveErrors() {
  try {
    uni.setStorageSync(KEYS.ERRORS, [...errors])
  } catch (e) {
    console.warn('[userStore] saveErrors error:', e)
  }
}

function saveFavorites() {
  try {
    uni.setStorageSync(KEYS.FAVORITES, [...favorites])
  } catch (e) {
    console.warn('[userStore] saveFavorites error:', e)
  }
}

function saveRecords() {
  try {
    uni.setStorageSync(KEYS.RECORDS, [...records])
  } catch (e) {
    console.warn('[userStore] saveRecords error:', e)
  }
}

// ========================================
// 用户数据操作
// ========================================
function updateProfile(data) {
  Object.assign(user, data)
  saveUser()
}

function addScore(points) {
  user.score += points
  saveUser()
}

function recordRound({ correctCount, wrongCount, scoreEarned, streakBonus, wrongIds, mode }) {
  const record = {
    id: Date.now(),
    mode: mode || 'text',
    totalQuestions: correctCount + wrongCount,
    correctCount,
    wrongCount,
    scoreEarned,
    streakBonus: streakBonus || 0,
    wrongIds: wrongIds || [],
    date: new Date().toISOString()
  }

  records.unshift(record)
  if (records.length > 50) records.splice(50)

  // 更新用户统计
  user.totalRounds += 1
  user.totalQuestions += record.totalQuestions
  user.totalCorrect += correctCount
  // 将本轮获得的积分累加到总积分
  user.score += scoreEarned

  // 连胜判定（正确率≥60%）
  const roundAccuracy = record.totalQuestions > 0
    ? correctCount / record.totalQuestions
    : 0
  if (roundAccuracy >= 0.6) {
    user.winStreak += 1
    if (user.winStreak > user.maxStreak) {
      user.maxStreak = user.winStreak
    }
  } else {
    user.winStreak = 0
  }

  // 历史最佳单轮
  if (correctCount > user.bestRound) {
    user.bestRound = correctCount
  }

  // 将本轮错题加入错题本
  if (wrongIds && wrongIds.length > 0) {
    for (const id of wrongIds) {
      addError(id)
    }
  }

  checkBadges()
  saveUser()
  saveRecords()
}

function getRecentRecords(count = 10) {
  return records.slice(0, count)
}

// ========================================
// 错题本操作
// ========================================
function addError(idiomId) {
  const id = Number(idiomId)
  if (!errors.includes(id)) {
    errors.push(id)
    saveErrors()
  }
}

function removeError(idiomId) {
  const id = Number(idiomId)
  const idx = errors.indexOf(id)
  if (idx !== -1) {
    errors.splice(idx, 1)
    saveErrors()
  }
}

function clearErrors() {
  errors.splice(0, errors.length)
  saveErrors()
}

function hasError(idiomId) {
  return errors.includes(Number(idiomId))
}

// ========================================
// 收藏操作
// ========================================
function toggleFavorite(idiomId) {
  const id = Number(idiomId)
  const idx = favorites.indexOf(id)
  if (idx === -1) {
    favorites.push(id)
  } else {
    favorites.splice(idx, 1)
  }
  saveFavorites()
}

function isFavorite(idiomId) {
  return favorites.includes(Number(idiomId))
}

function clearFavorites() {
  favorites.splice(0, favorites.length)
  saveFavorites()
}

// ========================================
// 签到
// ========================================
function signIn() {
  if (hasSignedIn.value) return false

  const bonus = 50
  user.score += bonus
  user.lastSignInDate = new Date().toISOString().slice(0, 10)
  saveUser()
  return bonus
}

// ========================================
// 成就徽章
// ========================================
const BADGE_DEFS = [
  { id: 'init', name: '初出茅庐', desc: '完成首轮游戏', check: s => s.totalRounds >= 1 },
  { id: 'fifty', name: '小有成就', desc: '累计答 50 题', check: s => s.totalQuestions >= 50 },
  { id: 'master', name: '成语达人', desc: '累计答 200 题', check: s => s.totalQuestions >= 200 },
  { id: 'full', name: '脑洞大开', desc: '单轮全对', check: s => s.bestRound >= 10 },
  { id: 'king', name: '翻车王', desc: '单轮错 ≥8 题', check: s => s.bestRound <= 2 }
]

function checkBadges() {
  let changed = false
  for (const badge of BADGE_DEFS) {
    if (!user.badges.includes(badge.id) && badge.check(user)) {
      user.badges.push(badge.id)
      changed = true
    }
  }
  if (changed) saveUser()
}

function getBadgeInfo(id) {
  return BADGE_DEFS.find(b => b.id === id)
}

// ========================================
// 重置
// ========================================
function resetScore() {
  user.score = 500
  user.winStreak = 0
  user.badges = []
  saveUser()
}

function clearAllData() {
  Object.assign(user, { ...defaultUser })
  errors.splice(0, errors.length)
  favorites.splice(0, favorites.length)
  records.splice(0, records.length)

  try {
    uni.removeStorageSync(KEYS.USER)
    uni.removeStorageSync(KEYS.ERRORS)
    uni.removeStorageSync(KEYS.FAVORITES)
    uni.removeStorageSync(KEYS.RECORDS)
  } catch (e) {
    console.warn('[userStore] clearAllData error:', e)
  }
}

// ========================================
// 导出
// ========================================
export {
  user,
  errors,
  favorites,
  records,
  accuracy,
  todayScore,
  hasSignedIn,
  loadAll,
  applyTheme,
  updateProfile,
  addScore,
  recordRound,
  getRecentRecords,
  addError,
  removeError,
  clearErrors,
  hasError,
  toggleFavorite,
  isFavorite,
  clearFavorites,
  signIn,
  checkBadges,
  getBadgeInfo,
  resetScore,
  clearAllData,
  BADGE_DEFS
}
