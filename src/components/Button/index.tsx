import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  size?: string;
  color?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  loading,
  size = 'middle',
  color = 'default',
  ...rest
}) => (
  <Container type="button" color={color} size={size} {...rest}>
    {loading ? 'Carregando...' : children}
  </Container>
);

export default Button;
