import React from 'react'
import ReactDOM from 'react-dom/client'

import { Provider as SiakitProvider } from '@siakit/core'
import { LoadingProvider } from '@siakit/loading'
import { ToastProvider } from '@siakit/toast'

import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SiakitProvider>
      <LoadingProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </LoadingProvider>
    </SiakitProvider>
  </React.StrictMode>,
)
