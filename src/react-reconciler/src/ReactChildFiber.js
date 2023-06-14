import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols"
import { createFiberFromElement, createFiberFromText } from './ReactFiber'
import { Placement } from "./ReactFiberFlags"
import isArray from "shared/isArray"
/**
 * 
 * @param {*} shouldTrackSildeEffects  是否跟中副作用
 */
function createChildReconciler (shouldTrackSildeEffects) {

  //基于一一一个新的虚拟dom 创建一个fiber节点
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



  function placeChild (newFiber, newIndex) {
    newFiber.index = newIndex
    if (shouldTrackSildeEffects) {
      newFiber.flags |= Placement
    }
  }

  // ARRRRAAARRYYYYYYY array虚拟DOM 被循环遍历处理
  function createChild (workInProgress, newChild) {
    // 如果是一个文本节点  那就根据文本生成一个子fiber
    if ((typeof newChild === "string" && newChild !== "") || typeof newChild === "number") {
      const create = createFiberFromText(`${newChild}`)
      create.return = workInProgress
      return create
    }
    // 如果是一个对象就根据对象生成一个fiber
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          const create = createFiberFromElement(newChild)
          create.return = workInProgress
          return create
        }
        default:
          break

      }

    }
    return null
  }


  /**
   * 处理数组类型的fiber 循环遍历处理 createChild
   * @param {*} workInProgress 
   * @param {*} currentChild 
   * @param {*} newChild  [你好文本节点,span]
   */
  function reconcileChildrenArray (workInProgress, currentChild, newChild) {
    let resultingFirstChild = null//返回第一个新儿子
    let previousNewFiber = null//上一个新fiber
    let newIdx = 0
    for (; newIdx < newChild.length; newIdx++) {
      const newFiber = createChild(workInProgress, newChild[newIdx])
      if (newFiber == null) continue
      placeChild(newFiber, newIdx)
      //  如果resultingFirstChild为null 说明这是第一个fiber
      if (resultingFirstChild === null) {//说明此时还没有第一个儿子
        resultingFirstChild = newFiber //那这个就是大儿子
      } else {
        // 否则说明不是大儿子，那就把newFiber添加到第一个节点的后面
        previousNewFiber.sibling = newFiber
      }
      // 让newFiber成为最后一个子fiber
      previousNewFiber = newFiber
    }

    return resultingFirstChild
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
    // newChild[hello文本,span虚拟DOM元素]
    if (isArray(newChild)) {
      return reconcileChildrenArray(workInProgress, currentChild, newChild)
    }
    return null

  }

  return reconcileChildFibers

}
// 有老fiber更新的时候用这个方法
export const reconcileChildFibers = createChildReconciler(true)
// 没有老fiber，初次挂在的时候用这个
export const mountChildFibers = createChildReconciler(false)


