import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;

  overflow: auto;

  > div:last-child {
    flex: 1;
  }
`;

export const Options = styled.div`
  background: #202023;

  display: flex;
  flex-direction: column;
  border-right: 0.1rem solid rgb(52, 50, 51);

  width: 240px;

  padding: 16px;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  > a {
    text-decoration: none;
    color: #fff;

    color: rgb(212, 214, 224);
    font-size: 1rem;
    width: 100%;
    justify-content: flex-start;
    border-radius: 0px;
    padding: 1.6rem 0px;
    border-bottom: 0.1rem solid rgb(52, 50, 51);

    display: flex;
    align-items: center;

    > div {
      height: 2.5rem;
      width: 2.5rem;
      border-radius: 50%;

      display: flex;
      justify-content: center;
      align-items: center;

      background: #343233;

      margin-right: 0.5rem;

      > svg {
        height: 1rem;
        width: 1rem;

        color: #ff8503;
      }
    }

    &:hover {
      opacity: 0.8;
      color: #ff8503;
    }
  }

  > div {
    display: flex;

    justify-content: center;
    align-items: center;

    padding: 16px 0 32px;

    > img {
      height: 100px;
    }
  }
`;

export const PageHeader = styled.div`
  z-index: 100000;
  background: #202023;
  height: 48px;
  width: 100%;
  padding: 32px 16px;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  > div {
    display: flex;
    align-items: center;
    line-height: 24px;
    /* background: #272727;
    padding: 8px; */

    border-radius: 10px;

    > p {
      font-size: 14px;
      font-weight: bold;
      color: #737373;
      margin-right: 8px;
    }

    > img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }

    > span {
      color: #f4ede8;
    }

    > a {
      text-decoration: none;
      color: #ff9000;

      margin-right: 16px;

      &:hover {
        opacity: 0.8;
      }
    }

    > button {
      margin-left: 16px;
      background: transparent;
      border: 0;

      svg {
        color: red;
        width: 20px;
        height: 20px;
      }
    }
  }
`;

export const Content = styled.div`
  padding: 16px;
  flex: 1;
  overflow: auto;
  display: flex;
`;
