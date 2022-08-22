import styled from 'styled-components';

export const ContainerModalInfoAppointment = styled.div`
  padding: 16px;

  > div {
    display: flex;

    > img {
      height: 48px;
      width: 48px;
      border-radius: 50%;
      border: 0.01px solid #ff8503;
    }

    > span {
      display: flex;
      flex-direction: column;
      margin-left: 8px;

      justify-content: center;

      > h1 {
        font-size: 16px;
        font-weight: bold;
        color: rgb(212, 214, 224);
      }

      > p {
        font-size: 14px;
        font-weight: normal;
        color: #aeb0b4;
      }
    }

    > span:nth-of-type(2) {
      flex: 1;
    }

    > span:nth-of-type(2) {
      display: flex;
      flex-direction: row;
      align-items: center;

      > div {
        height: 12px;
        width: 12px;
        border-radius: 50%;
        margin-right: 4px;
      }
    }
  }

  > div:nth-of-type(2) {
    margin-top: 16px;

    display: flex;
    flex-direction: column;

    > h2 {
      font-size: 14px;
      color: #aeb0b4;
      font-weight: bold;
      margin-bottom: 4px;
    }
  }

  > div:nth-of-type(3) {
    margin-top: 16px;

    > div {
      padding: 8px;
      background: rgb(52, 50, 51);
      border-radius: 4px;

      display: flex;
      align-items: center;

      cursor: pointer;

      > svg {
        height: 16px;
        width: 16px;
        color: #aeb0b4;
      }

      > p {
        margin-left: 8px;
        font-size: 14px;
        color: #aeb0b4;
      }

      & + div {
        margin-left: 8px;
      }
    }

    > div:nth-of-type(1) {
      > p {
        color: var(--color-green);
      }
      > svg {
        color: var(--color-green);
      }
    }

    > div:nth-of-type(2) {
      > p {
        color: var(--color-orange);
      }
      > svg {
        color: var(--color-orange);
      }
    }

    > div:nth-of-type(3) {
      > p {
        color: var(--color-red);
      }
      > svg {
        color: var(--color-red);
      }
    }
  }
`;

export const ContainerModalInfoBloqued = styled.div`
  padding: 16px;

  > div {
    display: flex;
  }

  > div:nth-of-type(1) {
    flex-direction: column;

    > p {
      font-size: 14px;
      font-weight: normal;
      color: #aeb0b4;

      & + p {
        margin-top: 4px;
      }
    }
  }

  > div:nth-of-type(2) {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    > div {
      padding: 8px;
      background: rgb(52, 50, 51);
      border-radius: 4px;

      display: flex;
      align-items: center;

      cursor: pointer;

      > svg {
        height: 16px;
        width: 16px;
        color: #aeb0b4;
      }

      > p {
        margin-left: 4px;
        font-size: 14px;
        color: #aeb0b4;
      }

      & + div {
        margin-left: 8px;
      }
    }

    > div:nth-of-type(1) {
      > p {
        color: var(--color-red);
      }
      > svg {
        color: var(--color-red);
      }
    }
  }
`;
