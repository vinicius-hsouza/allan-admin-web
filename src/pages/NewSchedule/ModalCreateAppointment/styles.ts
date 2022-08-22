import styled, { css } from 'styled-components';
import { lighten, shade } from 'polished';

export const Container = styled.div`
  /* background: tomato; */
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 16px;

  button + button {
    margin-left: 8px;
  }

  > form {
    > section {
      align-items: center;

      button {
        margin-left: 8px;
      }
    }
  }
`;

export const ProviderContainer = styled.td`
  padding: 8px;

  > div {
    display: flex;
    justify-content: center;
    align-items: center;

    > img {
      height: 48px;
      width: 48px;
      border-radius: 50%;
    }

    > h2 {
      font-size: 20px;
      font-weight: 500;

      margin-left: 8px;
    }
  }
`;

interface AppointmentItemScheduleProps {
  color?: string;
}

export const AppointmentItemSchedule = styled.div<AppointmentItemScheduleProps>`
  display: flex;
  align-items: center;
  position: fixed;
  z-index: 1;

  background: #f4f5f7;
  width: 100%;
  height: 100%;

  padding: 4px 16px;
  cursor: pointer;
  border-radius: 4px;

  ${({ color }) =>
    color &&
    css`
      background: ${lighten(0.3, color)};
      border: 1px solid ${color};
    `}

  > img {
    height: 36px;
    width: 36px;
    border-radius: 50%;
  }

  > div:nth-child(2) {
    flex: 1;
  }

  > div {
    margin-left: 8px;

    > h2 {
      font-size: 16px;
      line-height: 16px;
      font-weight: bold;
      color: #000;
    }

    > p {
      font-size: 12px;
      line-height: 14px;
      color: #000;
    }
  }
`;

export const AppoitmentItemToolTip = styled.div`
  background: tomato;
  padding: 16px;
`;

export const Calendar = styled.div`
  width: 100%;
  background: #323234;
  border-radius: 10px;

  .DayPicker {
    background: #323234;
    border-radius: 10px;
  }

  .DayPicker-wrapper {
    padding-bottom: 0;
  }

  .DayPicker,
  .DayPicker-Month {
    width: 100%;
  }

  .DayPicker-Month {
    border-collapse: separate;
    border-spacing: 8px;
    margin: 16px;
  }

  .DayPicker-Day {
    width: 40px;
    height: 40px;
  }

  .DayPicker-Day--available:not(.DayPicker-Day--outside) {
    background: transparent;
    border-radius: 10px;
    color: #fff;
  }

  .DayPicker:not(.DayPicker--interactionDisabled)
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
    background: ${shade(0.2, '#3e3b47')};
  }

  .DayPicker-Day--today {
    font-weight: normal;
  }

  .DayPicker-Day--disabled {
    color: #666360 !important;
    background: transparent !important;
  }

  .DayPicker-Day--selected {
    background: #ff8503 !important;
    border-radius: 10px;
    color: #232129 !important;
  }
`;

export const ModalNewAppointmentContainer = styled.div`
  display: flex;
  overflow: auto;
  flex: 1;

  > div {
    flex: 1;

    & + div {
      border-left: 0.5px #323232 solid;
    }

    h6 {
      font-size: 12px;
      color: #747474;
      font-weight: bold;
      margin-left: 16px;
    }
  }
`;

export const ContainerItemSelect = styled.div`
  /* flex: 1; */
  padding: 16px;

  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

interface ProviderItemProps {
  url: string;
  selected?: boolean;
}

export const ProviderItem = styled.div<ProviderItemProps>`
  height: 64px;
  width: 64px;
  border-radius: 50%;

  background: white;
  opacity: 0.3;
  cursor: pointer;

  ${({ url }) =>
    url &&
    css`
      background: #fff url(${url}) no-repeat;
      background-size: contain;
    `}

  ${({ selected }) =>
    selected &&
    css`
      border: 3px #ff8503 solid;
      opacity: initial;
    `}

  &:hover {
    opacity: initial;
  }
`;

interface ServiceItemProps {
  selected?: boolean;
}

export const ServiceContainerItems = styled.div`
  padding: 16px;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
  overflow: auto;
  flex: 1;
`;

export const ServiceItem = styled.div<ServiceItemProps>`
  padding: 8px;
  width: 100%;
  border-radius: 4px;

  background: #323234;
  cursor: pointer;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;

  /* & + div {
    margin-top: 8px;
  } */

  > div {
    margin-right: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    > svg {
      height: 16px;
      width: 16px;
      color: #aeb4b0;
    }

    > p {
      font-size: 12px;
      color: #fff;
    }

    > span {
      display: flex;
      justify-content: flex-start;
      margin-top: 8px;

      > p {
        font-size: 12px;
        color: #aeb4b0;

        > b {
          color: #ff8503;
        }
      }
    }
  }

  > div:nth-of-type(2) {
    flex: 1;
  }

  ${({ selected }) =>
    selected &&
    css`
      border: 0.5px solid #ff8503;

      > p {
        color: #fff;
      }

      > div {
        margin-right: 8px;

        > svg {
          height: 16px;
          width: 16px;
          color: #ff8503;
        }
      }
    `}
`;

interface HourItemProps {
  selected: boolean;
}

export const HourItem = styled.div<HourItemProps>`
  padding: 0 16px;
  height: 32px;
  /* width: 128px; */
  border-radius: 4px;

  background: #323234;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  /* & + div {
    margin-top: 8px;
  } */

  > p {
    font-size: 14px;
  }

  ${({ selected }) =>
    selected &&
    css`
      background: #ff8503;
    `}
`;

export const ContainerUser = styled.div`
  padding: 16px;
`;

export const UserItem = styled.div`
  padding: 16px;
  display: flex;
  background: #323232;
  border-radius: 4px;
  align-items: center;
  cursor: pointer;

  > img {
    height: 48px;
    width: 48px;
    border-radius: 50%;
  }

  > p {
    font-size: 16px;
    font-weight: bold;
    margin-left: 8px;
  }

  > button {
    background: transparent;
    border: none;
    color: #ff8503;
    border-radius: 4px;

    &:hover {
      background: #323234;
    }
  }
`;

export const ContainerSelectUser = styled.div`
  padding: 16px;
  max-height: 500px;
  overflow-y: auto;
`;

interface UserSelectItemProps {
  selected: boolean;
}

export const UserSelectItem = styled.div<UserSelectItemProps>`
  background: #323234;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;

  & + div {
    margin-top: 8px;
  }

  display: flex;
  align-items: center;

  > div {
    margin-left: 8px;

    > h5 {
      font-size: 18px;
      font-weight: bold;
    }

    > p {
      font-size: 14px;
      color: #aeb0b4;
    }
  }

  > img {
    height: 64px;
    width: 64px;
    border-radius: 50%;
  }

  ${({ selected }) =>
    selected &&
    css`
      background: #ff8503;

      > div {
        > p {
          color: #fff;
        }
      }
    `}

  &:hover {
    background: #ff8503;

    > div {
      > p {
        color: #fff;
      }
    }
  }
`;

export const ModalBlockHourContainer = styled.div`
  input {
    flex: 1;
  }
  > h6 {
    font-size: 12px;
    color: #747474;
    font-weight: bold;
    margin-left: 16px;
  }
`;
