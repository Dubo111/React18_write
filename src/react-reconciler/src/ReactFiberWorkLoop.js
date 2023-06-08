import { scheduleCallback } from 'scheduler'
import { createWorkInProgress } from './ReactFiber'
import { beginWork } from './ReactFiberBeginWork'
let workInProgress = null
/**
 * 计划更新root
 * 源码中此处有一个任务功能
 * @param {*} root 
 */
export function scheduleUpdateOnFiber (root) {
  // 确保调度执行root上的更新
  ensureRootIsScheduled(root)
}

function ensureRootIsScheduled (root) {
  // 告示浏览器要执行performConcurrentWorkOnRoot
  scheduleCallback(performConcurrentWorkOnRoot.bind(null, root))
}

/**
 * 根据fiber构建fiber树， 要创建真实的DOM节点，还需要把真实的DOM节点插入容器
 * @param {*} root 
 */
function performConcurrentWorkOnRoot (root) {
  console.log(root, 'root')
  //第一次渲染已同步的方式渲染根节点，初次渲染的时候，都是同步
  renderRootSync(root)
}

function prepareFreshStack (root) {
  workInProgress = createWorkInProgress(root.current, null)
}
function renderRootSync (root) {
  //开始构建fiber树
  prepareFreshStack(root)
  workLoopSync()
}


function workLoopSync () {
  while (workInProgress !== null) {
    performUnitOfwORK(workInProgress)
  }
}

function performUnitOfwORK (unitOfWork) {
  // 获取新的fiber对应的老fiber
  const current = unitOfWork.alternate
  // 完成当前的fiber的子fiber链表构建后
  const next = beginWork(current, unitOfWork)
  // 把即将生效的属性等于生效的
  unitOfWork.memoizedProps = unitOfWork.pendingProps
  if (next === null) {//如果没有子节点表示当前的fiber已经完成了
    // completeUnitOfWork(unitOfWork)
    unitOfWork = null
  } else {//如果有子节点,就让他成为下一个单元
    workInProgress = next
  }

}