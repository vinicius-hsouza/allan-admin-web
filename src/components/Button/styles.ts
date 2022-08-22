import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface ButtonProps {
  size: string;
  color: string;
}

const sizes: any = {
  small: css`
    height: 28px;
    min-height: 28px;
    font-size: 12px !important;
    padding: 0 10px;
    font-weight: 500;
  `,
  middle: css`
    height: 36px;
    min-height: 36px;
    font-weight: 500;
  `,
  large: css`
    height: 44px;
    min-height: 44px;
    font-weight: 500;
  `,
};

const colors: any = {
  default: css`
    background: #ff6b09;

    &:hover {
      background: ${shade(0.2, '#FF6B09')};
    }
  `,
  danger: css`
    background: #dc3545;

    &:hover {
      background: ${shade(0.2, '#DC3545')};
    }
  `,
  success: css`
    background: #28a745;

    &:hover {
      background: ${shade(0.2, '#28A745')};
    }
  `,

  warning: css`
    background: #ffc107;

    &:hover {
      background: ${shade(0.2, '#FFC107')};
    }
  `,

  cancel: css`
    background: #737373;

    &:hover {
      background: ${shade(0.2, '#737373')};
    }
  `,
};

export const Container = styled.button<ButtonProps>`
  /* height: 56px; */
  border-radius: 4px;
  border: 0;
  padding: 0 16px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;

  font-weight: 500;
  /* margin-top: 16px; */
  transition: background-color 0.2s;

  ${props => props.size && sizes[props.size]}
  ${props => props.color && colors[props.color]}
`;
