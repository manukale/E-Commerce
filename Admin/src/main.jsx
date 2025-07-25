import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Configure axios defaults
axios.defaults.baseURL = 'https://api.starbasket.in/api';
// axios.defaults.baseURL = 'https://api.toyshop.sbs/api';
// axios.defaults.baseURL = 'http://localhost:3000/api';


createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
