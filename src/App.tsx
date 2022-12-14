import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'

import * as Yup from 'yup'

import 'react-datepicker/dist/react-datepicker.css'
import 'react-calendar/dist/Calendar.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useTheme } from '@siakit/core'

import { ErrorBoundary } from './error'
import { AppProvider } from './hooks'
import { Routes } from './routes'
import { GlobalStyle } from './styles/global'

export default function App(): JSX.Element {
  const { togggleTheme, changeColor } = useTheme()

  useEffect(() => {
    togggleTheme('dark')
    changeColor('orange')

    Yup.setLocale({
      mixed: {
        required: 'Campo obrigatório',
      },
    })
  }, [])

  return (
    <AppProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <GlobalStyle />
          <Routes />
        </BrowserRouter>
      </ErrorBoundary>
    </AppProvider>
  )
}
