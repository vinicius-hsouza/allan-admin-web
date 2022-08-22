import styled, { css } from 'styled-components';

const colors = {
  blue: css`
    background: var(--color-primary-blue-lightest);
    color: var(--color-primary-blue-dark);
  `,
  green: css`
    background: var(--color-green-lightest);
    color: var(--color-green-dark);
  `,
  yellow: css`
    background: var(--color-yellow-lightest);
    color: var(--color-yellow-dark);
  `,
  red: css`
    background: var(--color-red);
    color: var(--color-red-dark);
  `,
  pink: css`
    background: var(--color-pink-lightest);
    color: var(--color-pink-dark);
  `,
  purple: css`
    background: var(--color-purple-lightest);
    color: var(--color-purple-dark);
  `,
  orange: css`
    background: var(--color-orange-lightest);
    color: var(--color-orange-dark);
  `,
  cyan: css`
    background: var(--color-cyan-lightest);
    color: var(--color-cyan-dark);
  `,
  black: css`
    background: var(--color-gray-08);
    color: var(--color-black);
  `,
};

export type Color = keyof typeof colors;

interface ContainerProps {
  color: Color;
}

export const Container = styled.div<ContainerProps>`
  border-radius: 2px;
  font-size: 12px;
  font-weight: 500;
  line-height: 12px;
  padding: 3px 6px;
  display: inline-block;
  white-space: nowrap;

  ${props => colors[props.color]}
`;
