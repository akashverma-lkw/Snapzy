import { StrictMode } from 'react'
import React from 'react';
import ReactDom from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
       <App />    
    </BrowserRouter>
  </React.StrictMode >,
)