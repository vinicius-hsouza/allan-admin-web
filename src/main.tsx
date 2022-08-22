import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { SiakitProvider } from '@atmoutsourcing/siakit';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SiakitProvider>
      <App />
    </SiakitProvider>
  </React.StrictMode>
)
