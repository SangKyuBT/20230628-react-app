import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './app'

//DOM 노드
const root = ReactDOM.createRoot(
  document.getElementById( 'root' )
)

//DOM 노드에 React 요소 렌더링
root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
)