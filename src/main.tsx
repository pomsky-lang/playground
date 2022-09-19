import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './components/App'
import './index.scss'
import { err } from './utils/err'

const elem = document.getElementById('root') ?? err('root element not found')
ReactDOM.createRoot(elem).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
