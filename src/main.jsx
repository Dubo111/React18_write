import { createRoot } from 'react-dom/client'

// let element = (
//   <h1 id='h1ss'>
//     我是h1内容
//     <span style={{ color: 'red' }} id="spanID">我是span的内容呀  </span>
//   </h1>
// )

function FunctionComponent () {
  return (
    <h1 id='h1ss'>
      我是h1内容
      <span style={{ color: 'red' }} >我是span的内容呀  </span>
    </h1>
  )
}
let element = <FunctionComponent />
// let element = React.createElement(FunctionComponent)
// let element = JSX(FunctionComponent)

const root = createRoot(document.getElementById('root'))
root.render(element)