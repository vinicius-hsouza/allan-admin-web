import styled, { keyframes } from 'styled-components';

const animation = keyframes`
  to {
    transform: rotate(360deg)
  }
`;

export const Loading = styled.div`
  z-index: 10000000000;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background: rgba(0, 0, 0, 0.5);

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  animation: ${animation} 0.9s linear infinite;

  border: 2px solid rgba(255, 255, 255, 0.24);
  border-left-color: #fff;
`;
