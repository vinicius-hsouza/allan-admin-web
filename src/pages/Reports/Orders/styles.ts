import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;

  .teste {
    background: rgba(212, 214, 224, 0.08);
    border-radius: 4px;
    border: none !important;
    color: #434344 !important;
    height: 36px;
    padding: 8px;

    input,
    span {
      color: #fff;
    }

    button {
      svg {
        color: #fff !important;
        stroke: #fff;
      }
    }
  }

  .react-daterange-picker__wrapper {
    border: none;
  }

  .calendarCustom {
    background: #323234;
    border: none;
  }

  .react-calendar__month-view__days {
    button {
      color: #ff8503;
    }
  }

  .react-calendar__month-view__days__day--weekend {
    color: #d10000 !important;
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    color: #757575 !important;
  }
`;

export const InputRangeDate = styled.input`
  padding: 8px;
  background: rgba(212, 214, 224, 0.08);
  border: none;
  color: #434344;

  &::placeholder {
    opacity: 0.4;
  }

  height: 36px;
  border-radius: 4px;
  margin-right: 16px;
`;

export const Header = styled.div`
  padding: 8px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  > div {
    > button {
      margin-left: 16px;
    }
  }
`;
