import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
`;

interface StatusProps {
  open: boolean;
}

export const OperationWork = styled.div<StatusProps>`
  display: flex;
  align-items: center;

  > div {
    height: 0.8rem;
    width: 0.8rem;

    margin-right: 8px;

    border-radius: 50%;
    background: ${props => (props.open ? 'red' : 'green')};
  }

  p {
    color: ${props => (props.open ? 'red' : 'green')};
    font-size: 0.9rem;
    font-weight: bold;
  }
`;
