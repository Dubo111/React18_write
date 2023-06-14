// 创建样式
export function setValueForStyles (node, styles) {
  const { style } = node//"{target:h1}"
  // styles={color:red,background:'green'}
  for (const styleName in styles) {
    if (styles.hasOwnProperty(styleName)) {
      const styleValue = styles[styleName]
      style[styleName] = styleValue
    }
  }
}