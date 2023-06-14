import * as ReactWorkTags from 'react-reconciler/src/ReactWorkTags'

const ReactWorkTagsMap = new Map()
// Map(4) {5 => 'HostComponent', 3 => 'HostRoot', 6 => 'HostText', 2 => 'IndeterminateComponent'} 'ReactWorkTagsMap?'
for (let tag in ReactWorkTags) {
  ReactWorkTagsMap.set(ReactWorkTags[tag], tag)

}

export default function (prefix, workInProgress) {
  let tagValue = workInProgress.tag
  let tagName = ReactWorkTagsMap.get(tagValue)
  let str = `${tagName}`
  if (tagName === 'HostComponent') {
    str += `  ${workInProgress.type}`

  } else if (tagName === 'HostText') {
    str += `  ${workInProgress.pendingProps}`

  }
  console.log(`${prefix}   ${str}`)

}

let indent = { number: 0 }
export { indent }