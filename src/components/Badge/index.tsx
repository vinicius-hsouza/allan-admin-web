import React, { CSSProperties } from 'react';

import { Color, Container } from './styles';

interface Props {
  color?: Color;
  style?: CSSProperties;
  children: React.ReactNode;
}

function Badge({ children, color = 'blue', style }: Props): JSX.Element {
  return (
    <Container color={color} style={style}>
      {children}
    </Container>
  );
};

export default Badge;
