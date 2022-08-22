import React from 'react';

import { Container, Content } from './styles';

type Props = {
  children: React.ReactNode;
}

function Wrapper({ children }: Props): JSX.Element {
  return (
    <Container>
      <Content>{children}</Content>
    </Container>
  );
};

export default Wrapper;
