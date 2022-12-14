import styled from 'styled-components'

export const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  background-color: transparent;

  align-items: center;
  justify-content: center;

  gap: 32px;

  /* div {
    flex: 1;
  } */

  > div:nth-of-type(1) {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 32px;

    text-align: center;
  }

  img {
    max-width: 752px;
    width: 100%;
  }
`

export const Title = styled.h1`
  font-size: 96px;
  font-weight: 700;
  color: #ff8503;
`

export const SubTitle = styled.h1`
  font-size: 32px;
  font-weight: 500;
  color: #ff8503;
`

export const Text = styled.h1`
  font-size: 24px;
  font-weight: 400;
  color: #aeb4b0;

  max-width: 440px;
  width: 100%;

  margin: 64px 0 32px;
`
