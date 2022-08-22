import styled from 'styled-components';
import Button from '../../components/Button';

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  flex: 1;
  overflow-y: auto;
  height: 100%;

  .teste {
    background: rgba(212, 214, 224, 0.08);
    border-radius: 4px;
    border: none !important;
    color: #434344 !important;
    /* height: 36px; */
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

  .react-date-picker__wrapper {
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
export const CardList = styled.div`
  display: flex;
  flex-direction: column;

  flex: 1;
`;

export const Card = styled.div`
  display: flex;
  align-items: center;

  background: #272727;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;

  img {
    height: 3rem;
    width: 3rem;
    border-radius: 50%;
    border: 2px solid #ff9000;
  }

  h2 {
    font-size: 1rem;
    font-weight: bold;
    color: #fff;
  }

  p {
    font-size: 14px;
    font-weight: normal;
    color: #aeaeae;
  }

  > div {
    margin-left: 8px;
    display: flex;
    justify-content: space-between;
    flex: 1;
    align-items: center;
  }

  svg {
    height: 1.2rem;
    width: 1.2rem;
    margin-left: 16px;
  }

  & + div {
    margin-top: 16px;
  }
`;

interface StatusProps {
  finished: boolean;
}

export const Status = styled.div<StatusProps>`
  display: flex;
  align-items: center;

  > div {
    height: 0.8rem;
    width: 0.8rem;

    margin-right: 8px;

    border-radius: 50%;
    background: ${props => (props.finished ? 'red' : 'green')};
  }

  p {
    color: ${props => (props.finished ? 'red' : 'green')};
    font-size: 0.9rem;
    font-weight: bold;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 16px 0;

  > div {
    display: flex;
  }
`;

export const ButtonToday = styled(Button)`
  background: rgba(212, 214, 224, 0.08);
  margin-right: 8px;
  height: 42px;
`;
