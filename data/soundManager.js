// ========================================
// 脑洞大翻车 — 音效管理器
// 使用 Web Audio API 合成音效，无需外部音频文件
// ========================================

import { user } from './userStore.js'

// ===== AudioContext（惰性初始化） =====
let audioCtx = null
let bgmGain = null
let bgmOscillators = []
let bgmPlaying = false
let bgmTimerId = null

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  // 自动恢复被浏览器暂停的 AudioContext
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

// ===== 工具函数 =====
/** 创建单频振荡器 */
function playTone(freq, duration, type = 'sine', volume = 0.3) {
  if (!user.soundEnabled) return
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch (e) {
    console.warn('[soundManager] playTone error:', e)
  }
}

/** 创建多频和弦 */
function playChord(frequencies, duration, type = 'sine', volume = 0.2) {
  if (!user.soundEnabled) return
  try {
    const ctx = getCtx()
    const now = ctx.currentTime
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, now + i * 0.08)
      gain.gain.setValueAtTime(volume, now + i * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + i * 0.08)
      osc.stop(now + i * 0.08 + duration)
    })
  } catch (e) {
    console.warn('[soundManager] playChord error:', e)
  }
}

// ===== 对外接口 =====

/**
 * 答对音效 — 上行大调琶音（C5 → E5 → G5 → C6）
 */
export function playCorrect() {
  if (!user.soundEnabled) return
  playChord([523, 659, 784, 1047], 0.6, 'sine', 0.25)
}

/**
 * 答错音效 — 下行滑音（锯齿波，300→150Hz）
 */
export function playWrong() {
  if (!user.soundEnabled) return
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(300, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.4)
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
  } catch (e) {
    console.warn('[soundManager] playWrong error:', e)
  }
}

/**
 * 超时音效 — 短促低音警示
 */
export function playTimeout() {
  if (!user.soundEnabled) return
  playTone(200, 0.3, 'square', 0.1)
}

/**
 * 开始背景音乐 — 快板四分音符欢快旋律
 * 高音区琶音上行下行，三角波明亮，160 BPM 节奏感
 */
export function startBGM() {
  if (!user.soundEnabled || bgmPlaying) return
  try {
    const ctx = getCtx()
    bgmPlaying = true

    // 主音量控制
    bgmGain = ctx.createGain()
    bgmGain.gain.setValueAtTime(0.04, ctx.currentTime)
    bgmGain.connect(ctx.destination)

    // 两小节欢乐琶音（四分音符 = 370ms ≈ 162 BPM）
    // 第1小节：上行 C5-E5-G5-C6 递增
    // 第2小节：下行 A5-G5-E5-C5 回落
    const notes = [
      523.25, // C5
      659.25, // E5
      783.99, // G5
      1046.50, // C6
      880.00, // A5
      783.99, // G5
      659.25, // E5
      523.25  // C5
    ]
    let noteIndex = 0

    function playBGMLoop() {
      if (!bgmPlaying || !bgmGain) return

      const osc = ctx.createOscillator()
      const noteGain = ctx.createGain()
      osc.type = 'triangle' // 三角波比正弦波更明亮清脆
      osc.frequency.setValueAtTime(notes[noteIndex % notes.length], ctx.currentTime)

      // 顿音效果：快速起音 + 短促衰减（像四分音符顿音）
      noteGain.gain.setValueAtTime(0, ctx.currentTime)
      noteGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.03)
      noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)

      osc.connect(noteGain)
      noteGain.connect(bgmGain)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.35)

      noteIndex++

      // 缓存当前 ref 以便清理
      const currentOsc = osc
      bgmOscillators.push(currentOsc)
      // 播放完后从数组移除
      setTimeout(() => {
        const idx = bgmOscillators.indexOf(currentOsc)
        if (idx !== -1) bgmOscillators.splice(idx, 1)
      }, 450)

      if (bgmPlaying) {
        bgmTimerId = setTimeout(playBGMLoop, 370)
      }
    }

    bgmTimerId = setTimeout(playBGMLoop, 200)
  } catch (e) {
    console.warn('[soundManager] startBGM error:', e)
    bgmPlaying = false
  }
}

/**
 * 停止背景音乐
 */
export function stopBGM() {
  bgmPlaying = false
  if (bgmTimerId) {
    clearTimeout(bgmTimerId)
    bgmTimerId = null
  }
  // 停止所有振荡器
  bgmOscillators.forEach(osc => {
    try { osc.stop() } catch (e) { /* 可能已停止 */ }
  })
  bgmOscillators = []
  bgmGain = null
}

/**
 * 切换音效开关时清理 BGM
 */
export function toggleSound(enabled) {
  if (!enabled) {
    stopBGM()
  }
}
