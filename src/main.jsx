import { createRoot } from 'react-dom/client'


let element = (
  // <div>

  //   <h2>
  //     文本hello--22

  //     <span style={{ color: 'green' }} id="spanID">我的发--2   </span>
  //   </h2>
  // </div>

  <h1 id='h1ss'>
    我是h1内容
    <span style={{ color: 'red' }} id="spanID">我是span的内容呀  </span>
  </h1>
)

const root = createRoot(document.getElementById('root'))
console.log(root)
root.render(element)