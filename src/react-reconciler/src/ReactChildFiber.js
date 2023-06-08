import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols"
import { createFiberFromElement } from './ReactFiber'
import { Placement } from "./ReactFiberFlags"
/**
 * 
 * @param {*} shouldTrackSildeEffects  是否跟中副作用
 */
function createChildReconciler (shouldTrackSildeEffects) {

  //基于新的虚拟dom 创建一个fiber节点
  function reconcileSingleElement (workInProgress, currentChild, element) {
    // 因为我们实现的是初次挂在，老的节点currentChild肯定是没有的，所以可以直接根据虚拟DOM创建新的Fiber节点
    const created = createFiberFromElement(element)
    created.return = workInProgress //指向父亲
    return created
  }
  // 追加副作用
  function placeSingleChild (NewFiber) {
    // 说明要添加副作用
    if (shouldTrackSildeEffects) {
      // 要在最后提交阶段插入此节点  React渲染分成渲染(创建Fiber树)和提交(更新真实DOM)二个阶段
      NewFiber.flags |= Placement
    }
    return NewFiber
  }
  /**
   * 比较子Fibers DOM-DIFF 就是用老的子fiber链表和新的虚拟DOM进行比较的过程
   * @param {*} workInProgress  新的父Fiber
   * @param {*} currentChild  老Fiber的第一个Child   =null
   * @param {*} nextChildren  新的子虚拟DOM
   */
  function reconcileChildFibers (workInProgress, currentChild, newChild) {
    // 现在暂时只考虑新的节点只有一个的情况
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          // 协调一个单元素 
          return placeSingleChild(reconcileSingleElement(workInProgress, currentChild, newChild))
        default: break
      }
    }

  }

  return reconcileChildFibers

}
// 有老fiber更新的时候用这个方法
export const reconcileChildFibers = createChildReconciler(true)
// 没有老fiber，初次挂在的时候用这个
export const mountChildFibers = createChildReconciler(false)


