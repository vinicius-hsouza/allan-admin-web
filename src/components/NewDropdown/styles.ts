import styled, { css } from 'styled-components';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export const types: any = {
  default: css`
    > p,
    svg {
      color: var(--color-gray-08);
    }
  `,

  danger: css`
    > p,
    svg {
      color: var(--color-red);
    }
  `,
};

export const PopoverContent = styled(PopoverPrimitive.Content)`
  border: 1px solid rgb(52, 50, 51);
  background: #202023;
  padding: 16px;
  border-radius: 4px;
`;

export const DropdownContent = styled(DropdownMenu.Content)`
  border: 1px solid rgb(52, 50, 51);
  background: #202023;
  /* padding: 16px; */
  border-radius: 4px;
`;

export const ButtonMore = styled.button`
  border: none;
  border: 1px solid rgb(52, 50, 51);
  background: #202025;
  box-shadow: var(--shadow-01);
  border-radius: 4px;
  padding: 2px;

  display: flex;
  align-items: center;
  justify-content: center;

  > svg {
    height: 18px;
    width: 18px;
    color: var(--color-gray-08);
  }
`;

interface OptionProps {
  type: keyof typeof types;
}

export const Option = styled.div<OptionProps>`
  /* background: tomato; */
  padding: 8px 12px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;

  > svg {
    height: 16px;
    width: 16px;
    margin-right: 6px;
    color: var(--color-gray-08);
  }

  > p {
    font-size: 14px;
    font-weight: bold;
    color: var(--color-gray-08);
  }

  &:hover {
    background: rgb(52, 50, 51);
  }

  ${({ type }) => types[type]}
`;
