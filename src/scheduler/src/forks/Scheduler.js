// forks 跨平台实现
// 此处后面我们会实现优先队列
export function scheduleCallback (callback) {
  requestIdleCallback(callback)
}