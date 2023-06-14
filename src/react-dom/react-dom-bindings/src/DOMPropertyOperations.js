//设置属性
export function setValueForProperty (node, name, value) {

  if (value === null) {
    node.removeAttribute(name)
  } else {
    node.setAttribute(name, value)
  }
}