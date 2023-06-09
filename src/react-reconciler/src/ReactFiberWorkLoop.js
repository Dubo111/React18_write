import { scheduleCallback } from 'scheduler'
import { createWorkInProgress } from './ReactFiber'
import { beginWork } from './ReactFiberBeginWork'
import logger from 'shared/logger'
import { completeWork } from './ReactFiberCompleteWork'
import { MutationMask, NoFlags, Placement, Update } from './ReactFiberFlags'
import { commitMutationEffectsOnFiber } from './ReactFiberCommitWork'
import {
  HostComponent,
  HostRoot,
  HostText,
} from './ReactWorkTags'
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
  //第一次渲染已同步的方式渲染根节点，初次渲染的时候，都是同步
  renderRootSync(root)
  // 开始进入提交阶段 ,就是执行副作用，修改真实DOM
  const finishedWork = root.current.alternate
  root.finishedWork = finishedWork
  commitRoot(root)
}

function commitRoot (root) {
  const { finishedWork } = root
  printFinIshedWork(finishedWork)
  const subtreeHasEffects = (finishedWork.subtreeFlags & MutationMask) !== NoFlags
  const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags
  // 如果自己有副作用或者子节点有副作用那就进行提交DOM操作
  if (subtreeHasEffects || rootHasEffect) {
    // commitPlacement(finishedWork)
    commitMutationEffectsOnFiber(finishedWork, root)
  }
  // 等DOM变更后就可以让我们的root的current指向新的fiber树
  root.current = finishedWork

}
// root.current  current 就是根fiber
function prepareFreshStack (root) {
  // 第一次创建新的fiber
  workInProgress = createWorkInProgress(root.current, null)
}
function renderRootSync (root) {
  //开始构建fiber树
  prepareFreshStack(root)
  workLoopSync()
}


//开始工作循环
function workLoopSync () {
  while (workInProgress !== null) {
    performUnitOfwORK(workInProgress)
  }
}

// 每个工作单元
function performUnitOfwORK (unitOfWork) {

  //获取新fiber对应的老fiber
  const current = unitOfWork.alternate
  // 完成当前的fiber的子fiber链表构建后
  const next = beginWork(current, unitOfWork)
  // 把即将生效的属性等于生效的
  unitOfWork.memoizedProps = unitOfWork.pendingProps
  if (next === null) {
    //如果没有子节点表示当前的fiber已经完成了
    completeUnitOfWork(unitOfWork)
    // workInProgress = null
  } else {//如果有子节点,就让他成为下一个单元
    workInProgress = next
  }

}


// unitOfWork span>"hello"
function completeUnitOfWork (unitOfWork) {
  let completedWork = unitOfWork
  do {
    const current = completedWork.alternate
    const returFiber = completedWork.return
    // 执行此fiber 的完成工作，如果是原生组件的话就创建真实DOM节点
    completeWork(current, completedWork)
    const siblingFiber = completedWork.sibling
    // 如果当前的fiber有兄弟， 那就构建兄弟的fiber链表 （继续工作循环）
    if (siblingFiber !== null) {
      workInProgress = siblingFiber

      return
    }
    // 如果没有兄弟，说明当前完成的就是父fiber的最后一个节点
    // 也就是说一个父fibr，所有的fiber都完成了

    completedWork = returFiber
    workInProgress = completedWork //下次就问父亲有没有兄弟去构建

  } while (completedWork !== null)

}


// 打印
function printFinIshedWork (fiber) {
  let child = fiber.child
  while (child) {
    printFinIshedWork(child)
    child = child.sibling
  }
  if (fiber.flags !== 0) {
    console.log(getFlags(fiber.flags), getTag(fiber.tag), fiber.type, fiber.memoizedProps)
  }
}

function getFlags (flags) {
  if (flags === Placement) {
    return '插入'
  }
  if (flags === Update) {
    return '更新'
  }
  return flags
}
function getTag (tag) {
  switch (tag) {
    case HostRoot:
      return 'HostRoot'
    case HostComponent:
      return 'HostComponent'
    case HostText:
      return 'HostText'
    default:
      return tag

  }
}