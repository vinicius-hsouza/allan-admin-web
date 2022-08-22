import styled from 'styled-components';

export const Header = styled.div`
  min-height: 48px;
  height: 48px;
  padding: 0 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  color: #fff;

  p {
    font-size: 16px;
    font-weight: 500;
  }

  span {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
    transition: background-color 0.2s;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }
  }
`;

export const Content = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  flex: 1;
`;
