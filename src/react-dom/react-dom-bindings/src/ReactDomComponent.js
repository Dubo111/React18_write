
import { setValueForStyles } from './CSSProperty'
import setTextContent from './setTextContent'
import { setValueForProperty } from './DOMPropertyOperations'
const STYLE = 'style'
const CHILDREN = 'children'
/**
 * 设置初始属性
 * @param {*} tag span div 
 * @param {*} domElement 真实dom
 * @param {*} nextProps 属性{id：1，children:'文本',style:{color:red}]}
 */
function setInitialDOMProperties (tag, domElement, nextProps) {
  for (const propKey in nextProps) {
    if (nextProps.hasOwnProperty(propKey)) {
      // 当前Key 的value属性 {} '我是span文本'
      const nextProp = nextProps[propKey]
      // 当前nextProps 的key是Style样式
      if (propKey === STYLE) {
        setValueForStyles(domElement, nextProp)
        // 当前nextProps 的Key是Children
      } else if (propKey === CHILDREN) {
        // 当前是一个文本节点 特殊处理
        if (typeof nextProp === 'string') {
          // 把文本直接插入容器种
          setTextContent(domElement, nextProp)

        } else if (typeof nextProp === 'number') {
          setTextContent(domElement, nextProp + '')
        }
        // 说明是标签属性
      } else if (nextProp !== null) {
        setValueForProperty(domElement, propKey, nextProp)
      }
    }

  }
}

// 设置属性
export function setInitialProperties (domElement, tag, props) {

  setInitialDOMProperties(tag, domElement, props)
}