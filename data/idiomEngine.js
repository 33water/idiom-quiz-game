import { idioms } from './idioms.js'

/**
 * 随机洗牌（Fisher-Yates）
 */
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * 从数组中选一个未使用过的项
 */
function pickUnique(arr, usedIds) {
  for (const item of arr) {
    if (!usedIds.has(item.id)) {
      usedIds.add(item.id)
      return item
    }
  }
  return null
}

/**
 * 根据历史正确率确定难度基线
 * @param {Array} history 历史记录数组
 * @returns {number} 难度等级 1-3（1=偏简单，2=中等，3=偏困难）
 */
function getDifficulty(history) {
  if (!history || history.length === 0) return 1

  const recent = history.slice(-5)
  const totalCorrect = recent.reduce((s, r) => s + (r.correctCount || 0), 0)
  const totalQuestions = recent.reduce((s, r) => s + (r.totalQuestions || 10), 0)
  const accuracy = totalQuestions > 0 ? totalCorrect / totalQuestions : 0

  if (accuracy > 0.7) return 3
  if (accuracy > 0.4) return 2
  return 1
}

/**
 * 按难度分层出题
 * @param {Array} history 历史记录，用于分析用户水平
 * @param {number} total 本轮总题数，默认 10
 * @param {Array} forceIds 强制包含的成语 ID 列表（复习模式用）
 * @returns {Array} 按 easy→medium→hard 排序的成语对象数组
 */
function getQuestionPool(history, total = 10, forceIds = null) {
  // 复习模式：按指定 ID 加载，跳过难度筛选
  if (forceIds && forceIds.length > 0) {
    const numIds = forceIds.map(Number)
    const result = numIds.map(id => idioms.find(i => i.id === id)).filter(Boolean)
    return result.length > 0 ? result : getQuestionPool(history, total)
  }

  const baseDifficulty = getDifficulty(history)

  // 根据基础难度调整各层数量
  let easyCount = 3; let mediumCount = 4; let hardCount = 3
  if (baseDifficulty <= 1) {
    easyCount = 5; mediumCount = 3; hardCount = 2
  } else if (baseDifficulty === 2) {
    easyCount = 3; mediumCount = 4; hardCount = 3
  } else {
    easyCount = 1; mediumCount = 4; hardCount = 5
  }

  // 不重叠的难度范围，避免同一成语被分到多个池
  const easy = shuffle(idioms.filter(i => i.difficulty <= 1))
  const medium = shuffle(idioms.filter(i => i.difficulty >= 2 && i.difficulty <= 3))
  const hard = shuffle(idioms.filter(i => i.difficulty >= 4))

  const pool = []
  const usedIds = new Set()

  for (let i = 0; i < easyCount; i++) {
    const item = pickUnique(easy, usedIds)
    if (item) pool.push(item)
  }
  for (let i = 0; i < mediumCount; i++) {
    const item = pickUnique(medium, usedIds)
    if (item) pool.push(item)
  }
  for (let i = 0; i < hardCount; i++) {
    const item = pickUnique(hard, usedIds)
    if (item) pool.push(item)
  }

  // 数量不够时从所有未使用的成语补充
  const remaining = shuffle(idioms.filter(i => !usedIds.has(i.id)))
  while (pool.length < total && remaining.length > 0) {
    const item = remaining.pop()
    if (item) pool.push(item)
  }

  return pool.slice(0, total)
}

/**
 * 计算本轮积分
 * @param {number} correctCount 答对数
 * @param {number} streakCount 连胜数
 * @param {boolean} reviewMode 是否为复习模式（半价积分，无连胜加成）
 * @returns {{ score: number, streakBonus: number }}
 */
function calcScore(correctCount, streakCount, reviewMode = false) {
  const perQuestion = reviewMode ? 5 : 10
  const base = correctCount * perQuestion
  const streakBonus = reviewMode ? 0 : Math.min(streakCount * 5, 30)
  return { score: base + streakBonus, streakBonus }
}

/**
 * 根据 ID 数组获取成语对象（保持传入顺序）
 * @param {number[]|string[]} ids 成语 ID 数组
 * @returns {Array} 匹配的成语对象数组
 */
function getIdiomsByIds(ids) {
  if (!ids || ids.length === 0) return []
  const numIds = ids.map(Number)
  return numIds.map(id => idioms.find(i => i.id === id)).filter(Boolean)
}

/**
 * 获取符合当前难度的谜面文字
 * @param {Object} idiom 成语对象
 * @param {number} difficultyLevel 当前难度等级 1-3
 * @returns {string} 谜面文字
 */
function getRiddle(idiom, difficultyLevel) {
  if (!idiom.riddles || idiom.riddles.length === 0) return ''
  const level = Math.max(1, Math.min(3, difficultyLevel || 1))
  const riddle = idiom.riddles.find(r => r.level === level)
  return riddle ? riddle.text : idiom.riddles[0].text
}

/**
 * 生成选择题选项（1 个正确答案 + 3 个干扰项，随机打乱）
 * @param {Object} idiom 成语对象
 * @returns {Array} 打乱后的 4 个选项数组
 */
function getChoiceOptions(idiom) {
  if (!idiom.wrongOptions || idiom.wrongOptions.length < 3) {
    return [idiom.word]
  }
  const options = [idiom.word, ...idiom.wrongOptions]
  return shuffle(options)
}

/**
 * 从数组中随机取一条
 * @param {Array} arr 源数组
 * @returns {*} 随机项
 */
function randomPick(arr) {
  if (!arr || arr.length === 0) return null
  return arr[Math.floor(Math.random() * arr.length)]
}

export {
  getQuestionPool,
  calcScore,
  getDifficulty,
  getIdiomsByIds,
  getRiddle,
  getChoiceOptions,
  shuffle,
  randomPick
}
