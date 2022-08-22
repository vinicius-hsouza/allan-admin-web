import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
`;

export const ListUser = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  flex-wrap: wrap;
  width: 100%;
  overflow-y: auto;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 667px) {
    grid-template-columns: 1fr;
  }

  margin-top: 16px;
`;

export const Header = styled.header`
  display: flex;

  align-items: center;
  justify-content: space-between;

  > form {
    > section {
      padding: 0;

      button {
        margin-left: 8px;
      }
    }
  }
`;

export const Card = styled.div`
  background: #272727;
  padding: 16px 8px;
  border-radius: 4px;

  display: flex;
  justify-content: flex-start;
  align-items: center;

  cursor: pointer;
  width: 100%;
  /* margin-top: 16px;
  margin-right: 16px; */

  &:hover {
    opacity: 0.9;
  }

  > div {
    display: flex;
    flex-direction: column;
    margin-left: 8px;
    justify-content: center;
  }

  img {
    height: 64px;
    width: 64px;
    border-radius: 50%;
  }

  h3 {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }

  h2 {
    margin-top: 4px;
    font-size: 12px;
    font-weight: normal;
    color: #aeaeae;
  }
`;

export const ContainerStars = styled.div`
  display: flex;
  margin-top: 16px;

  svg {
    height: 16px;
    width: 16px;
    color: #efca08;
    margin-right: 4px;
  }
`;
export const Stars = styled.p`
  font-size: 18px;
  color: #fff;
  font-weight: bold;
`;

export const ContainerHourWork = styled.div`
  background: rgba(212, 214, 224, 0.08);
  margin: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
`;
