import { createRoot } from 'react-dom/client'


let element = (
  <h1>
    hello
    <span style={{ color: 'red' }} id="spanID">我的发
    </span>

  </h1>)
debugger
const root = createRoot(document.getElementById('root'))
console.log(root)

root.render(element)