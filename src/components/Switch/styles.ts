import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface ContainerProps {
  isErrored: boolean;
  orientation: 'horizontal' | 'vertical';
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  align-items: center;
  flex: 0 !important;
  align-self: flex-end;
  padding: 6px 0;
  margin-right: 8px;

  > label {
    display: grid;
    grid-template-columns: 40px 1fr;
    grid-gap: 8px;
    align-items: center;
    white-space: nowrap;
    color: var(--color-gray-07);
    cursor: pointer;

    ${props =>
      props.isErrored &&
      css`
        color: #dc3545;
      `}
  }

  ${props =>
    props.orientation === 'vertical' &&
    css`
      padding: 0;
      align-self: flex-start;

      > label {
        grid-template-columns: none;
        grid-gap: 10px;

        label {
          grid-row-start: 2;
        }
      }
    `}
`;

interface ContentProps {
  disabled: boolean;
}

export const Content = styled.label<ContentProps>`
  position: relative;
  display: flex;
  width: 40px;
  height: 20px;
  margin-right: 8px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  input:checked + span {
    background: #ff6b09;
  }

  input:checked + span::before {
    -webkit-transform: translateX(20px);
    -ms-transform: translateX(20px);
    transform: translateX(20px);
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(212, 214, 224, 0.08);
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;

    &::before {
      position: absolute;
      content: '';
      height: 16px;
      width: 16px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      -webkit-transition: 0.4s;
      transition: 0.4s;
      border-radius: 50%;
    }
  }

  ${props =>
    props.disabled &&
    css`
      span {
        background: rgba(0, 0, 0, 0.1) !important;
        cursor: not-allowed;
      }
    `}
`;

export const Error = styled(Tooltip)`
  height: 16px;
  display: flex;
  margin-left: 4px;

  svg {
    color: #dc3545;
  }
`;
