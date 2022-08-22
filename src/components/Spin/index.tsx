import React, { ReactNode } from 'react';

import { Loading, Content } from './styles';

interface SpinProps {
  isVisible: boolean;
  children: ReactNode;
}

export function Spin({ isVisible, children }: SpinProps): JSX.Element {
  return (
    <>
      {isVisible && (
        <Loading>
          <Content />
        </Loading>
      )}

      {children}
    </>
  );
}
