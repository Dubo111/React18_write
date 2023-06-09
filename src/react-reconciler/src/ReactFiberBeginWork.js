import { HostComponent, HostRoot, HostText } from "./ReactWorkTags"

import { processUpdateQueue } from './ReactFiberClassUpdateQueue'
import { mountChildFibers, reconcileChildFibers } from './ReactChildFiber'
/**
 * 根据新的虚拟DOM生成新的Fiber链表
 * @param {*} current 老的父Fiber
 * @param {*} workInProgress 新的fiber
 * @param {*} nextChildren 新的子虚拟DOM
 */
function reconcilechildren (current, workInProgress, nextChildren) {
  debugger

  // 如果此新的fiber没有老的fiber，说明此新fiber是新创建的
  if (current == null) {
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren)
  } else {
    // 如果说有老Fiber的话，做DOM-DIFF 拿老的子fiber链表和新的子虚拟DOM进行比较，进行最小化的更新
    workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren)
  }
}

function updateHostRoot (current, workInProgress) {
  //  需要知道它的子虚拟DOM ， 知道它的儿子虚拟DOM信息
  processUpdateQueue(workInProgress) //workInProgress.memoizedState={ element }
  const nextState = workInProgress.memoizedState // workInProgress.memoizedState={ element }
  //nextChildren 就是新的子虚拟DOM
  const nextChildren = nextState.element
  // 协调子节点 DOM-DIFF算法
  // 根据新的虚拟DOM生成fiber链表
  reconcilechildren(current, workInProgress, nextChildren)
  return workInProgress.child //{tag5,type:h1}
}

/**
 * 构建原生组件的子fiber链表
 * @param {*} current  老fiber
 * @param {*} workInProgress 新的fiber h1
 */
function updateHostComponent (current, workInProgress) {

}
/**
 * 目标是根据新的虚拟DOM构建新的fiber子链表 child 。sibling
 * @param {*} current 
 * @param {*} workInProgress 
 */
export function beginWork (current, workInProgress) {
  debugger
  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(current, workInProgress)
    case HostComponent:
      return updateHostComponent(current, workInProgress)
    case HostText:
      return null
    default:
      return null
  }
}