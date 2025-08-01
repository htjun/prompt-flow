import React from 'react'
import ReactDOM from 'react-dom/client'
import { ReactFlowProvider } from '@xyflow/react'
import App from './App'
import '@xyflow/react/dist/style.css'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ReactFlowProvider>
    <App />
  </ReactFlowProvider>
)
