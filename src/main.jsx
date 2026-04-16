import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './app/App.jsx'

// Force scroll to top on every page load / refresh — prevents browser
// scroll restoration from landing mid-page and breaking pin logic.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Scroll to 0 right before unload so the browser's cached position is 0
window.addEventListener('beforeunload', () => window.scrollTo(0, 0));

// Belt-and-suspenders: scroll again after the browser finishes any late restore
requestAnimationFrame(() => window.scrollTo(0, 0));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
