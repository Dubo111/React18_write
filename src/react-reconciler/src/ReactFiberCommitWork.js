import { appendChild, insertBefore } from 'react-dom-bindings/src/ReactDomHostConfig'
import { MutationMask, Placement } from "./ReactFiberFlags"
import { FunctionComponent, HostComponent, HostRoot, HostText } from "./ReactWorkTags"

function recursivelyTraverseMutationEffects (root, parentFiber) {
  // debugger
  if (parentFiber.subtreeFlags & MutationMask) {
    let { child } = parentFiber //拿到第一个h1子fiber
    while (child !== null) {
      // 递归继续处理子孩子
      commitMutationEffectsOnFiber(child, root)
      child = child.sibling
    }
  }
}

function commitReconciliationEffects (finishedWork) {
  const { flags } = finishedWork
  // 如果此fiber要进行插入操作的话
  if (flags & Placement) {
    // 进行插入操作，也就是把此fiber对应的真实DOM节点加到父真实DOM节点上
    commitPlacement(finishedWork)
    // 把flags里的Placement删除 （重新赋值0）
    // debugger
    finishedWork.flags & ~Placement
  }
}
// 判断类型
function isHostParent (fiber) {
  return fiber.tag === HostRoot || fiber.tag === HostComponent

}
// 获取父fiber
function getHostParentFiber (fiber) {
  debugger
  let parent = fiber.return
  while (parent !== null) {
    if (isHostParent(parent)) {
      return parent
    }
    parent = parent.return
  }

  return parent

}


/**
 * 把子节点对应的真实DOM插入父节点种
 * @param {*} node 将要插入的fiber节点
 * @param {*} parent  父真实DOM节点
 */
function insertOrAppendPlacementNode (node, before, parent) {
  debugger
  const { tag } = node
  // 判断此fiber对应的节点是不是真实DOM节点
  const isHost = tag === HostComponent || tag === HostText
  // 如果是的话直接插入
  if (isHost) {
    const { stateNode } = node
    if (before) {
      insertBefore(parent, stateNode, before)
    } else {

      appendChild(parent, stateNode)
    }
  } else {
    // 如果node不是真实DOM节点，获取它的大儿子
    const { child } = node
    if (child !== null) {
      insertOrAppendPlacementNode(child, before, parent)//把大儿子添加到父亲里面
      let { sibling } = child
      // 处理兄弟
      while (sibling !== null) {
        insertOrAppendPlacementNode(sibling, before, parent)
        sibling = sibling.sibling
      }
    }
  }
}
/**
 * 把此fiber的真实DOM插入到父<DOM></DOM>
 * @param {*} finishedWork 
 */
function commitPlacement (finishedWork) {
  const parentFiber = getHostParentFiber(finishedWork)
  switch (parentFiber.tag) {
    case HostRoot: {
      const parent = parentFiber.stateNode.containerInfo
      const before = getHostSibling(finishedWork)//获取最近的弟弟真实DOM节点
      insertOrAppendPlacementNode(finishedWork, before, parent)
      break
    }

    case HostComponent: {
      const parent = parentFiber.stateNode
      const before = getHostSibling(finishedWork)//获取最近的弟弟真实DOM节点
      insertOrAppendPlacementNode(finishedWork, before, parent)
      break
    }
    default:
      break

  }
}
/**
 * 找到要插入的锚点，
 * 找到可以插入它前面的那个fiber对应的真实DOM
 * @param {*} fiber 
 */
function getHostSibling (fiber) {
  let node = fiber
  siblings: while (true) {
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        return null
      }
      node = node.return
    }
    node = node.sibling
    // 如果弟弟不是原生节点也不是文本节点
    while (node.tag !== HostComponent && node.tag !== HostText) {
      // 如果此节点是一个将要插入的新节点，找它的弟弟
      if (node.flags & Placement) {
        continue siblings
      } else {
        node = node.child
      }
    }
    if ((!node.flags & Placement)) {
      return node.stateNode
    }

  }
}
/**
 * 遍历fiber树 执行fiber上的副作用
 * @param {*} finishedWork  fiber节点
 * @param {*} root 根节点
 */
export function commitMutationEffectsOnFiber (finishedWork, root) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case HostRoot:
    case HostComponent:
    case HostText: {
      // 先遍历他们的子节点，处理他们的子节点上的副作用
      recursivelyTraverseMutationEffects(root, finishedWork)
      // 在处理自己身上的副作用
      commitReconciliationEffects(finishedWork)
      break
    }
    default:
      break
  }
}

