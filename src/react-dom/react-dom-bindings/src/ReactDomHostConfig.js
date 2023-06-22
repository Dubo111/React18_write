import { setInitialProperties } from './ReactDomComponent'
// import React from './CSSProperty'
export function shouldSetTextContent (type, props) {
  return typeof props.children === 'string' || typeof props.children === 'number'
}
// 创建文本节点
export function createTextInstance (content) {
  return document.createTextNode(content)
}

export function createInstance (type) {
  const domElement = document.createElement(type)
  //updateFiberProps(domElement,props)
  return domElement
}
export function appendInitialChild (parent, child) {
  parent.appendChild(child)
}
// 设置初始属性
export function finalizeInitialChildren (domElement, type, props) {
  // 设置初始属性
  setInitialProperties(domElement, type, props)
}
export function appendChild (parentInstance, child) {
  parentInstance.appendChild(child)
}
/**
 * 
 * @param {*} parentInstance  父DOM节点
 * @param {*} child 子DOM节点
 * @param {*} before 插入在谁的前面
 */
export function insertBefore (parentInstance, child, beforeChild) {
  parentInstance.insertBefore(child, beforeChild)
}