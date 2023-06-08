import { createFiberRoot } from "./createFiberRoot"
import { createUpdate, enqueueUpdate } from './ReactFiberClassUpdateQueue'
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop"
// 创建容器
export function createContainer (containerInfo) {
  return createFiberRoot(containerInfo)
}

/**
 * 更新容器
 * @param {*} element  ..虚拟dom
 * @param {*} container  //Dom容器 fiberrootNode fiberNode
 */
export function updateContiner (element, container) {
  const current = container.current  //根fiber 当前fiber
  // 创建更新
  const update = createUpdate()
  // 要更新的虚拟DOM
  update.payload = { element }
  // 把此更新对象添加到current这个根fiber 的更新列队上
  const root = enqueueUpdate(current, update)  // root返回根节点从当前的fiber下一个根节点

  scheduleUpdateOnFiber(root)



}