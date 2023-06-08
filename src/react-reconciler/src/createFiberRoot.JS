
import { createHostRootFiber } from './ReactFiber'
import { initialUpdateQueue } from './ReactFiberClassUpdateQueue'
function FiberRootNode (containerInfo) {
  // FiberRootNode 简单来说就是一个真实dom容器节点 div#root
  this.containerInfo = containerInfo
}

// 双向指向
export function createFiberRoot (containerInfo) {
  const root = new FiberRootNode(containerInfo)
  // hostroot 指向根节点div#root
  const uninitializedFiber = createHostRootFiber() //FiberNode
  // 根容器的current  指向根fiber
  root.current = uninitializedFiber
  // 根fiber的stateNnode，也就是真实DOM节点指向FiberRootNode
  uninitializedFiber.stateNode = root
  initialUpdateQueue(uninitializedFiber)
  return root
}
