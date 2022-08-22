import React from 'react';

import { AuthProvider } from './auth';
import { LoadingProvider } from './loading';
import { ToastProvider } from './toast';

type Props = {
  children: React.ReactNode;
}

export function AppProvider({ children }: Props): JSX.Element {
  return (
    <LoadingProvider>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </LoadingProvider>
  )
}




