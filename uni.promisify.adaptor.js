// uni.promisify.adaptor.js
// uni-app Promise 适配器 — 将回调式异步 API 转换为 Promise
export function promisify(api) {
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      api(
        Object.assign({}, options, { success: resolve, fail: reject }),
        ...params
      )
    })
  }
}
