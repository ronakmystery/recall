// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { GlobalProvider } from './GlobalContext'; // Import the GlobalProvider

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <GlobalProvider>
    <App />
  </GlobalProvider>
  // </StrictMode>,
)


