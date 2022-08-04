import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './components/App'
import './index.css'

declare global {
  interface Window {
    currentEditorContent: string
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
