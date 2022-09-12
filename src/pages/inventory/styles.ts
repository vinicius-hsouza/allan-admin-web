import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  flex: 1;

  display: inline-flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
`;

export const Card = styled.div`
  background: #202024;
  height: 150px;
  width: 250px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  > p {
    font-size: 20px;
    font-weight: bold;
    color: #fff;
  }

  &:hover {
    opacity: 0.8;
  }
`;
