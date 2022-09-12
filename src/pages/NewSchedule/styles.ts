import styled, { css } from 'styled-components';
import { lighten, shade } from 'polished';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
  width: 100%;

  .rdp-day_today:not(.rdp-day_outside) {
    color: red;
  }
`;
export const Header = styled.div`
  padding: 8px 16px 8px 64px;

  display: flex;
  justify-content: space-between;

  button + button {
    margin-left: 8px;
  }

  > div:nth-of-type(2) {
    display: flex;

    > form {
      margin-left: 4px;
    }
  }
`;

interface ContentProps {
  columns: number;
}

export const Content = styled.div<ContentProps>`
  display: grid;
  grid-template-columns: 64px repeat(${props => props.columns}, 2fr);
`;

export const HoursColumn = styled.div`
  background: red;
`;

interface CardAppointmentProps {
  duration?: number;
}

export const CardAppointment = styled.div<CardAppointmentProps>`
  /* margin-top: 50%; */
  height: 50%;

  ${props =>
    props.duration &&
    css`
      height: ${props.duration}%;
    `}

  width: 100%;
  /* background: tomato; */
  border-radius: 8px;

  display: flex;
  /* align-items: center; */
  padding: 4px;
`;

export const CardBloquedContent = styled.div<CardAppointmentProps>`
  background: rgb(52, 50, 51);
  flex: 1;
  border-radius: 8px;
  z-index: 10;
  padding: 8px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  > h1 {
    color: #fc1100;
    font-size: 20px;
  }
  > p {
    color: #aeb0b4;
    font-size: 18px;
    font-weight: bold;
  }
`;

export const CardLunchContent = styled.div<CardAppointmentProps>`
  background: rgba(35, 123, 195, 0.4);
  flex: 1;
  border-radius: 8px;
  z-index: 10;
  padding: 8px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* cursor: pointer; */

  /* &:hover {
    opacity: 0.9;
  } */

  > h1 {
    color: #fff;
    font-size: 20px;
    font-weight: bold;
  }
  > p {
    color: #aeb0b4;
    font-size: 18px;
  }
`;

interface CardAppointmentContentProps {
  colorStatus?: string;
  duration?: number;
}

export const CardAppointmentContent = styled.div<CardAppointmentContentProps>`
  background: rgb(52, 50, 51);
  flex: 1;
  border-radius: 8px;
  z-index: 10;
  padding: 8px;

  display: flex;
  align-items: center;

  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  > div {
    margin-left: 16px;

    >div{
      > h1 {
        font-size: 16px;
        font-weight: bold;
        color: rgb(212, 214, 224);
      }
    }

    > p {
      font-size: 14px;
      font-weight: normal;
      color: #aeb0b4;
    }

    &:first-of-type {
      flex: 1;
    }

    &:nth-of-type(2) {
      display: flex;
      align-items: center;
      height: 100%;

      > div {
        height: 12px;
        width: 12px;
        border-radius: 50%;
        margin-right: 4px;
      }
    }
  }

  > img {
    height: 48px;
    width: 48px;
    border-radius: 50%;
    border: 0.01px solid #ff8503;
  }

  ${props =>
    props.duration === 50 &&
    css`
      > img {
        height: 42px;
        width: 42px;
      }
    `}
`;

export const SpanLine = styled.div`
  border: 0.01px solid rgb(52, 50, 51);
  width: 100%;
  min-width: 200px;

  display: flex;
  flex-direction: column;
`;

export const SpanLineHeader = styled.div`
  border: 0.01px solid rgb(52, 50, 51);
  width: 100%;
  background: #202025;
  position: sticky;
  top: 0;
  padding: 8px;
  z-index: 11;

  border-radius: 8px 8px 0 0;

  display: flex;
  justify-content: space-between;
  align-items: center;

  > div {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    > img {
      height: 42px;
      width: 42px;
      border-radius: 50%;
      border: 2px solid #ff8503;
    }

    > p {
      margin-left: 8px;
      font-size: 16px;
      font-weight: bold;
    }

    > h3 {
      color: #aeb0b4;
      text-transform: capitalize;
      font-size: 16px;
      font-weight: bold;
    }
  }
`;
