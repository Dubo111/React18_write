import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
  IndeterminateComponent,
  // FunctionComponent,

} from "./ReactWorkTags"

import { processUpdateQueue } from './ReactFiberClassUpdateQueue'
import { mountChildFibers, reconcileChildFibers } from './ReactChildFiber'

import { shouldSetTextContent } from 'react-dom-bindings/src/ReactDomHostConfig'
import logger, { indent } from "shared/logger"
/**
 * 根据新的虚拟DOM生成新的Fiber链表
 * @param {*} current 老的父Fiber
 * @param {*} workInProgress 新的fiber
 * @param {*} nextChildren 新的子虚拟DOM
 */
function reconcilechildren (current, workInProgress, nextChildren) {
  // 如果此新的fiber没有老的fiber，说明此新fiber是新创建的
  if (current == null) {
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren)
  } else {
    // 如果说有老Fiber的话，做DOM-DIFF 拿老的子fiber链表和新的子虚拟DOM进行比较，进行最小化的更新
    workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren)
  }
}

// 创建根fiber tag3
function updateHostRoot (current, workInProgress) {
  //  需要知道它的子虚拟DOM ， 知道它的儿子虚拟DOM信息
  //  <因为是根fiber>所以我们需要processUpdateQueue处理他的虚拟DOM
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
 * @param {*} current   老fiber
 * @param {*} workInProgress 新的fiber h1
 */
function updateHostComponent (current, workInProgress) {
  const { type } = workInProgress
  const nextProps = workInProgress.pendingProps
  let nextChildren = nextProps.children //虚拟DOM 
  // 判断当前虚拟DOM它的儿子是不是一个文本独生子
  const isDirectTextChild = shouldSetTextContent(type, nextProps)
  if (isDirectTextChild) {
    // console.log('HostText')
    nextChildren = null
  }
  reconcilechildren(current, workInProgress, nextChildren) //构建子fiber

  return workInProgress.child //{tag5,type:h1}
}

/**
 * 挂载函数组件
 * @param {*} current  老fiber
 * @param {*} workInProgress 新fiber
 * @param {*} ComponentType  组件类型也就是函数组件
 */
export function mountIndeterminateComponent (current, workInProgress, Component) {
  debugger
  const props = workInProgress.pendingProps
  const value = renderWithHooks(current,workInProgress,Component,props)

 
  workInProgress.tag = FunctionComponent
  reconcilechildren(current, workInProgress, value)
  return workInProgress.child
}
/**
 * 目标是根据新的虚拟DOM树构建新的fiber子链表 child sibling
 * @param {*} current   老fiber  unitOfWork.alternate
 * @param {*} workInProgress 新的fiber h1
 */
export function beginWork (current, workInProgress) {
  logger(" ".repeat(indent.number) + 'beginwork', workInProgress)
  indent.number += 2
  switch (workInProgress.tag) {
    // 区分是函数组件还是class组件
    case IndeterminateComponent:
      return mountIndeterminateComponent(
        current, workInProgress, workInProgress.type
      )
    case HostRoot:
      // HostRoot唯一根fiber标识
      return updateHostRoot(current, workInProgress)
    case HostComponent:
      // HostComponent 原生组件 (span div h1 ) 根据原生组件构建fiber
      return updateHostComponent(current, workInProgress)
    case HostText:
      return null
    default:
      return null
  }
}