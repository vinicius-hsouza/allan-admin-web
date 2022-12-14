import styled from 'styled-components'

export const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;

  > div {
    flex: 1;
    display: flex;
  }
`

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`

export const PaymentContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: rgba(212, 214, 224, 0.08);
  width: 256px;
  margin-left: 16px;
  border-radius: 4px;
  padding: 16px;

  > div {
    /* padding: 8px 0; */

    p {
      font-size: 14px;
      font-weight: normal;
      color: #aeb0b4;
      margin-top: 4px;
    }

    /* & + div {
      margin-top: 16px;
      border-top: 1px dashed;
      border-color: #747474;
    } */
  }

  > div:first-child {
    border-radius: 4px;
    background: #666;
    text-align: center;
  }

  > div:nth-child(2) {
    flex: 1;
  }

  > div:last-child {
    span {
      display: flex;
      justify-content: space-between;
      align-items: center;

      p:last-child {
        font-size: 16px;
        font-weight: bold;
      }
    }

    span:last-child {
      margin-top: 16px;

      button {
        flex: 1;

        & + button {
          margin-left: 8px;
        }
      }
    }
  }
`

export const Card = styled.div`
  background: rgba(212, 214, 224, 0.08);

  padding: 16px 8px;
  border-radius: 4px;

  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const ServiceItem = styled.div`
  display: flex;
  justify-content: space-between;
`

export const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;

  p {
    margin-top: 8px;
  }
`

export const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  margin-bottom: 8px;
  align-items: center;
`

export const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding: 16px;

  > span {
    display: flex;
    width: 100%;
    justify-content: space-between;
    > div {
      flex: 1;
    }

    h2 {
      font-size: 16px;
      font-weight: normal;
    }
  }
`
