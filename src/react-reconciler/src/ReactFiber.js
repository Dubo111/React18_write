import { NoFlags } from './ReactFiberFlags'
import { HostComponent, HostRoot, HostText, IndeterminateComponent } from './ReactWorkTags'

/**
 * @param {*} tag fiber的类型 函数组件0 类组件1 原生组件5 根元素3
 * @param {*} tpendingPropsag //新属性 ，等待处理或者说生效的属性
 * @param {*} key 唯一标识 
 */
export function FiberNode (tag, pendingProps, key) { //FiberNode
  this.tag = tag
  this.key = key
  this.type = null //fiber类型 来自于虚拟DOM type span div p h1 
  // 每个虚拟dom=>fiber=>真实DOM
  this.stateNode = null //此fiber对应的真实DOM节点 h1=>真实的h1dom

  this.return = null //指向父节点
  this.child = null//指向第一个子节点
  this.sibling = null//指向弟弟

  // fiber那来的？ 通过虚拟DOM 节点创建，虚拟DOM 会提供pendingProps用来创建fiber节点的属性
  this.pendingProps = pendingProps //等待生效的属性
  this.memoizedProps = null//已经生效的属性

  // 每个fiber还会有自己的状态, 每个fiber 状态的类型是不一样的
  // 类组件对应的fiber 存的就是类的实例状态,hostroot存的就是要渲染的元素
  this.memoizedState = null //（埋末ruai的）


  // 每个fiber身上可能还有更新列队
  this.updateQueue = null
  //副作用的标识，标识要针对此fiber节点进行何种操作
  this.flags = NoFlags
  // 子节点对应的副作用使用标识
  this.subtreeFlags = NoFlags
  // 当前fiber的替身，轮替 后面DOM-DIFF的时候会用到
  this.alternate = null //双缓存池 （奥特奶特）
  this.index = 0
}
export function createFiber (tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key)
}
export function createHostRootFiber () {
  return createFiber(HostRoot, null, null)
}

/**
 * 基于老的fiber和新的属性创建新的fiber
 * @param {*} current  老fiber
 * @param {*} pendingProps  新属性
 */
export function createWorkInProgress (current, pendingProps) {
  let workInProgress = current.alternate
  if (workInProgress === null) {
    workInProgress = createFiber(current.tag, pendingProps, current.key)
    workInProgress.type = current.type
    workInProgress.stateNode = current.stateNode
    workInProgress.alternate = current
    current.alternate = workInProgress
  } else {
    workInProgress.pendingProps = pendingProps
    workInProgress.type = current.type
    workInProgress.flags = NoFlags
    workInProgress.subtreeFlags = NoFlags
  }
  workInProgress.child = current.child
  workInProgress.memoizedProps = current.memoizedProps
  workInProgress.memoizedState = current.memoizedState
  workInProgress.updateQueue = current.updateQueue
  workInProgress.sibling = current.sibling
  workInProgress.index = current.index
  return workInProgress
}
/**
 * 基于虚拟DOM创建一个fiber
 * @param {*} VDOM 
 * @returns 新的fiber
 */
export function createFiberFromElement (VDOM) {
  const { type, key, props: pendingProps } = VDOM
  return createFiberFromTypeAndProps(type, key, pendingProps)
}

function createFiberFromTypeAndProps (type, key, pendingProps) {
  let tag = IndeterminateComponent
  // 如果类型type是一个字符串 span div ,说明此fiber是一个原生组件
  if (typeof type === 'string') {
    tag = HostComponent
  }
  const fiber = createFiber(tag, pendingProps, key)
  fiber.type = type
  return fiber //const fiber: FiberNode

}

/**
 * 基于文本创建新的fiber
 * @param {*} conText 文本节点
 */
export function createFiberFromText (conText) {

  return createFiber(HostText, conText, null)

}