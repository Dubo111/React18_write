import { HostRoot } from "./ReactWorkTags"

/**
 * 本来此文件要处理更新优先级问题
 * 目前现在只能实现向上找到根节点
 * @param {*} sourceFiber 
 */
export function markUpdateLaneFromFiberToRoot (sourceFiber) {
  let node = sourceFiber//当前fiber
  let parent = sourceFiber.return  //父fiber
  while (parent !== null) {
    node = parent
    parent = parent.return
  }
  // 一直找到parent为null
  if (node.tag === HostRoot) {
    return node.stateNode
  }
  return null

}