
import { createContainer, updateContiner } from 'react-reconciler/src/ReactFiberReconciler'
function ReactDOMRoot (internalRoot) {
  this._internalRoot = internalRoot
  // internalRoot //返回的就是FiberRootNode的实例
}
export function createRoot (container) {//div#root

  const root = createContainer(container)
  return new ReactDOMRoot(root)
}

ReactDOMRoot.prototype.render = function (VDOM) {
  const root = this._internalRoot
  updateContiner(VDOM, root)
}
