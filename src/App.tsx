import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTheme } from '@atmoutsourcing/siakit';

import { useEffect } from 'react';
import { GlobalStyle } from './styles/global';

import { AppProvider } from './hooks';

import { Routes } from './routes';
import { ErrorBoundary } from './error';

export default function App(): JSX.Element {
  const { toggleTheme, changeColorScheme } = useTheme();

  useEffect(() => {
    toggleTheme('dark');
    changeColorScheme('orange');
  }, []);

  return (
    <AppProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <GlobalStyle />
          <Routes />
        </BrowserRouter>
      </ErrorBoundary>
    </AppProvider>
  );
}


