import styled, { css } from 'styled-components';
import { CSVLink } from 'react-csv';
import { shade } from 'polished';

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

interface ContainerProps {
  size: string;
}

export const Container = styled(CSVLink)`
  margin-right: 8px;
  /* border-radius: 4px;
  border: 0;
  padding: 0 16px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;

  font-weight: 500;

  transition: background-color 0.2s;
  text-decoration: none;

  background: #28a745;

  &:hover {
    background: ${shade(0.2, '#28A745')};
  } */

  /* ${(props: ContainerProps) => props.size && sizes[props.size]} */
`;
