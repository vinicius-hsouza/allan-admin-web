import styled, { css } from 'styled-components';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: rgba(212, 214, 224, 0.08);
  border-radius: 4px;
  height: 38px;
  padding: 12px;
  width: 100%;
  /* border: 1px solid #747474; */
  color: #434344;
  display: flex;
  align-items: center;
  & + div {
    margin-top: 8px;
  }
  ${props =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}
  ${props =>
    props.isFocused &&
    css`
      color: #ff6b09;
      border-color: #ff6b09;
    `}
  ${props =>
    props.isFilled &&
    css`
      color: #ff6b09;
    `}
  input {
    flex: 1;
    background: transparent;
    border: 0;
    color: #f4ede8;
    &::placeholder {
      opacity: 0.4;
    }
  }
  svg {
    margin-right: 16px;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;
  svg {
    margin: 0;
  }
  span {
    background: #c53030;
    color: #fff;
    &::before {
      border-color: #c53030 transparent;
    }
  }
`;

export const Label = styled.p`
  margin-bottom: 4px;
  font-size: 14px;
  opacity: 0.4;
  margin-top: 8px;
`;

export const PopoverContent = styled(PopoverPrimitive.Content)`
  border: 1px solid rgb(52, 50, 51);
  background: #202023;
  padding: 16px;
  border-radius: 4px;
`;

export const IconButtonCalendar = styled.button`
  background: transparent;
  border: none;
  padding: 0;

  width: 18px;

  > svg {
    height: 18px;
    width: 18px;

    color: #737373;
  }
`;
