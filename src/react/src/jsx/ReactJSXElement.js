import hasOwnProperty from 'shared/hasOwnProperty'
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'

const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
}
function hasValidKey (config) {
  return config.key !== undefined
}
function hasValidRef (config) {
  return config.ref !== undefined
}

function ReactElement (type, key, ref, props) {
  return {//这就是react元素虚拟dom
    $$typeof: REACT_ELEMENT_TYPE,
    type,//h1 div span 标签
    key,//唯一标识
    ref,//用来获取真实<DOM</DOM> 元素
    props,//属性 children ,style id 
  }
}

// /转换/
export function jsxDEV (type, config) {
  let propName//属性名字
  let props = {}
  let ref = null
  let key = null
  if (hasValidKey(config)) {
    key = config.key
  }
  if (hasValidRef(config)) {
    ref = config.ref
  }
  for (propName in config) {
    console.log(hasOwnProperty, 'hasOwnProperty')
    if (
      hasOwnProperty.call(config, propName)
      && !RESERVED_PROPS.hasOwnProperty(propName)
    ) {
      props[propName] = config[propName]
    }
  }

  return ReactElement(type, key, ref, props)

}


// if (config) {
//   delete config.__source
//   delete config.__self
//   ref = config.ref
//   delete config.ref
//   key = config.key
//   delete config.key
// }
// let props = { ...config }
// if (arguments.length > 3) {
//   // 如果子节点是个数组
//   props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom)
// } else {
//   props.children = wrapToVdom(children)
// }
// return {
//   // 这是一个虚拟dom表示是一个react元素
//   $$typeof: Symbol('react.element'),
//   ref,
//   key,
//   type: nodeType,//虚拟dom元素类型
//   props //属性对象，子节点 style className
// }

// let element = /*#__PURE__*/_jsxs("h1", {
//   children: ["hello", /*#__PURE__*/_jsx("span", {
//     style: {
//       color: 'red'
//     },
//     id: "spanID",
//     children: "\u6211\u7684\u53D1"
//   })]
// });