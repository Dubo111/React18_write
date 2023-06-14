import logger, { indent } from "shared/logger"
import { HostComponent, HostRoot, HostText } from "./ReactWorkTags"
import {
  createTextInstance,
  createInstance,
  appendInitialChild,
  finalizeInitialChildren
} from "react-dom/react-dom-bindings/src/ReactDomHostConfig"
import { NoFlags } from "./ReactFiberFlags"

/**
 * 把当前完成的fiber所有的子节点对应的真实DOM都挂载到自己父parent真实DOM节点上
 * 
 * @param {*} parent 当前完成的fiber真实的DOM节点
 * @param {*} workInProgress  完成的fiber
 */
function appendAllChildren (parent, workInProgress) {
  let node = workInProgress.child
  while (node) {
    // 如果子节点的类型是个原生节点   或者是一个文本节点
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode)
      // 如果第一个儿子不是一个原生节点，说明他可能是一个函数组件
    } else if (node.child !== null) {
      node = node.child
      continue
    }
    if (node === workInProgress) {
      return
    }
    // 如果当前的节点没有弟弟
    while (node.sibling == null) {
      if (node.return === null || node.return === workInProgress) {
        return
      }
      // 回到父节点
      node = node.return
    }
    node = node.sibling

  }
}
export function completeWork (current, workInProgress) {
  indent.number -= 2
  logger(" ".repeat(indent.number) + 'completeWork', workInProgress)
  const newProps = workInProgress.pendingProps //进行中的工作
  switch (workInProgress.tag) {

    case HostRoot:
      bubbleProperties(workInProgress)
      break
    // -------------------------------------
    // 如果完成的是原生组件节点的话
    case HostComponent:
      // 现在只是在处理创建或者说挂载新节点的逻辑,后面此处分进行区分是初次挂载还是更新
      const { type } = workInProgress
      const instance = createInstance(type, newProps, workInProgress)
      // 把自己的所有儿子都添加到自己身上
      appendAllChildren(instance, workInProgress)
      workInProgress.stateNode = instance
      // 给属性赋值
      finalizeInitialChildren(instance, type, newProps)
      // 向上冒泡属性
      bubbleProperties(workInProgress)
      break
    // --------------------------------------
    case HostText:
      // 如果完成的fiber是文本节点 ,那就创建真实的文本节点
      const newText = newProps
      // 创建真实的DOM节点并传入StateNode
      workInProgress.stateNode = createTextInstance(newProps)
      // 向上冒泡属性
      bubbleProperties(workInProgress)
  }
}

function bubbleProperties (completedWork) {

  let subtreeFlags = NoFlags
  // 遍历当前的fiber的所有子节点，把所有的子节点的副作用
  // 以及子节点的子节点的副作用 全部合并
  let child = completedWork.child
  while (child !== null) {
    subtreeFlags |= child.subtreeFlags
    subtreeFlags |= child.flags
    child = child.sibling
  }
  completedWork.subtreeFlags = subtreeFlags

}