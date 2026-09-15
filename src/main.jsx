import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// global layers first, so component styles can override them
import './styles/base.css'
import './styles/glass.css'

import { I18nProvider } from './i18n/index.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
)
