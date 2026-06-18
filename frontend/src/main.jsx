import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './context/storeContext.jsx'
import AuthContextProvider from './context/authContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthContextProvider>
      <StoreContextProvider>
        <App />
      </StoreContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
)