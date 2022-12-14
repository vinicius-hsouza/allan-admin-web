import React, { Component, ReactNode } from 'react'
import { FiArrowLeft } from 'react-icons/fi'

import { Button } from '@siakit/button'
import { Footer } from '@siakit/footer'
import { Heading } from '@siakit/heading'
import { Flex } from '@siakit/layout'
import { Modal, ModalContent } from '@siakit/modal'
import { Separator } from '@siakit/separator'
import { Spacer } from '@siakit/spacer'

import BrokenCar from './broken-car.jpg'
import Bug from './bug.png'
import { Container, SubTitle, Text, Title } from './styles'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: any
  errorInfo: any
  modalVisible: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    modalVisible: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error } as any
  }

  public componentDidCatch(test: any): void {
    this.state = {
      ...this.state,
    }
  }

  public render(): ReactNode {
    const { hasError, error, modalVisible } = this.state

    if (hasError) {
      return (
        <>
          <Modal
            open={modalVisible}
            onOpenChange={() => {
              this.setState({
                modalVisible: false,
              })
            }}
          >
            <ModalContent title="Erro" size="lg">
              <Flex padding direction="column">
                <Heading size="md">Location</Heading>
                <Separator />
                <p>{window.location.href}</p>

                <Spacer height={32} />

                <Heading size="md">Stack</Heading>
                <Separator />
                <pre>{error.stack}</pre>
              </Flex>
              <Footer>
                <Button
                  type="button"
                  variant="secondary"
                  colorScheme="gray"
                  onClick={() => {
                    this.setState({
                      modalVisible: false,
                    })
                  }}
                >
                  Fechar
                </Button>
              </Footer>
            </ModalContent>
          </Modal>

          <Container>
            <div>
              <Title>Oops!</Title>
              <SubTitle>Alguma coisa deu errado.</SubTitle>
              <Text>
                Essa página não está disponível agora. Mas não se preocupe!
                Tente de novo em alguns instantes. :)
              </Text>
              <Flex gap>
                {' '}
                {/* <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={() => {
                  this.props
                  }}
                >
                  <FiArrowLeft />
                  Voltar ao painel
                </Button> */}
                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={() => {
                    this.setState({
                      modalVisible: true,
                    })
                  }}
                >
                  Visualizar erro
                </Button>
              </Flex>
            </div>

            {/* <div>
              <img src={Bug} alt="" />
            </div> */}
          </Container>
        </>
      )
    }

    return this.props.children
  }
}
