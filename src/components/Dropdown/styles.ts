import styled from 'styled-components';
import { lighten } from 'polished';

export const Container = styled.div`
  background: #fff;
  box-shadow: var(--shadow-03);

  position: absolute;
  z-index: 99999999999 !important;
`;

export const ButtonMore = styled.button`
  border: none;
  background: #fff;
  box-shadow: var(--shadow-01);
  border-radius: 4px;
  padding: 0 4px;

  > svg {
    height: 18px;
    width: 18px;
    color: var(--color-gray-08);
  }
`;

export const Item = styled.div`
  /* background: red; */

  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  z-index: 999999999999 !important;

  &:hover {
    background: ${lighten(0.01, '#ff8503')};

    > svg {
      color: #fff;
    }

    > p {
      color: #fff;
    }
  }

  svg {
    height: 16px;
    width: 16px;
    margin-right: 8px;
    color: var(--color-gray-08);
  }

  p {
    font-size: 14px;
    font-weight: bold;
    color: var(--color-gray-08);
  }
`;
