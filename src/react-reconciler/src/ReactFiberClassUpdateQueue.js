import { markUpdateLaneFromFiberToRoot } from "./ReactFiberConcurrentUpdates"
export const UpdateState = 0
import { assign } from 'shared/assign'
export function initialUpdateQueue (fiber) {

  const queue = {
    shared: {
      pending: null
    }
  }
  fiber.updateQueue = queue
}

export function createUpdate () {
  const update = {
    tag: UpdateState
  }
  return update
}

export function enqueueUpdate (fiber, update) {
  // const queue = {
  //   shared: {
  //     pending: update3
  //   }
  // }
  // update1= update.payload = { VDOM ,next: update2}
  // update2= update.payload = { VDOM ,next: update3}
  // update3= update.payload = { VDOM ,next: update1}
  const updateQueue = fiber.updateQueue
  const pending = updateQueue.pending
  if (pending == null) {//初次 更新指向自己
    update.next = update
  } else {
    //最后一个更新的next 永远指向第一个更新
    update.next = pending.next
    // 上一个的next指向下一个更新
    pending.next = update
  }
  // fiber的pending永远指向左后一个更新
  // 
  updateQueue.shared.pending = update

  return markUpdateLaneFromFiberToRoot(fiber)
}

/**
 * 根据老状态和更新列队中的更新计算最新的状态
 * @param {*} workInProgress  //要计算的fiber
 */
export function processUpdateQueue (workInProgress) {
  const queue = workInProgress.updateQueue
  const pendingQueue = queue.shared.pending
  // 如果有更新或者说更新队列里面有内容
  if (pendingQueue !== null) {
    // 清除等待生效的更新
    queue.shared.pending = null
    //获取更新最后一个更新 update={payload:{element:h1}}
    const lastpendingUpdate = pendingQueue
    // 指向最后一个更新
    const firstPendingUpdate = lastpendingUpdate.next
    lastpendingUpdate.next = null

    // 获取老状态 null
    let newState = workInProgress.memoizedState
    let update = firstPendingUpdate
    while (update) {
      // 根据老状态和更新计算新状态
      newState = getStateFromUpdate(update, newState)
      update = update.next


    }
    // 把最终计算到的状态赋值给memoizedState
    workInProgress.memoizedState = newState
  }

}

/**
 * 根据老状态和更新计算新状态
 * @param {*} update 更新的对象其实有很多种类型
 * @param {*} preState 
 */
function getStateFromUpdate (update, preState) {

  switch (update.tag) {
    case UpdateState:
      const { payload } = update
      return assign({}, preState, payload)
  }
}