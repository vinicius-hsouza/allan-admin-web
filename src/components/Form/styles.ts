import styled from 'styled-components';
import { Form as Unform } from '@unform/web';

export const Form = styled(Unform)`
  section {
    display: flex;
    padding: 0 16px;

    & + section {
      margin-top: 8px;
    }

    > div {
      flex: 1;

      & + div {
        margin-left: 8px;
      }
    }

    > button + button {
      margin-left: 8px;
    }
  }
`;

interface FooterProps {
  modal?: boolean;
}

export const Footer = styled.footer<FooterProps>`
  display: flex;
  justify-content: flex-end;

  margin-top: 16px;
  padding: 16px;
  background: ${props =>
    props.modal ? 'rgba(212, 214, 224, 0.08)' : 'transparent'};

  div {
    flex: 1;
  }

  button + button {
    margin-left: 8px;
  }
`;
