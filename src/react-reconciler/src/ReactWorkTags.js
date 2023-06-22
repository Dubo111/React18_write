// 根Fiber tag
// 每个虚拟DOM都会对应自己的fiber tag类型
export const FunctionComponent = 0  //函数组件
export const ClassComponent = 1 //class组件
export const IndeterminateComponent = 2  //组件区分 类组件还是函数组件
export const HostRoot = 3 //容器根节点
export const HostComponent = 5  //元素节点 span div
export const HostText = 6   //纯文本节点
