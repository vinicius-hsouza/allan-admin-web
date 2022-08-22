import React, { Component, ReactNode } from 'react';

import {
  Button,
  Flex,
  Footer,
  Heading,
  Modal,
  Separator,
  Spacer,
} from '@atmoutsourcing/siakit';

import BrokenCar from './broken-car.jpg';
import { Container, SubTitle, Text, Title } from './styles';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: any;
  errorInfo: any;
  modalVisible: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    modalVisible: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error } as any;
  }

  public componentDidCatch(test: any): void {
    this.state = {
      ...this.state,
    };
  }

  public render(): ReactNode {
    const { hasError, error, modalVisible } = this.state;

    if (hasError) {
      return (
        <>
          <Modal
            title="Erro"
            isOpen={modalVisible}
            onRequestClose={() => {
              this.setState({
                modalVisible: false,
              });
            }}
          >
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
                  });
                }}
              >
                Fechar
              </Button>
            </Footer>
          </Modal>

          <Container>
            <div>
              <Title>Oops!</Title>
              <SubTitle>Alguma coisa deu errado.</SubTitle>
              <Text>
                Essa página não está disponível agora. Mas não se preocupe!
                Tente de novo em alguns instantes. :)
              </Text>
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={() => {
                  this.setState({
                    modalVisible: true,
                  });
                }}
              >
                Visualizar erro
              </Button>
            </div>

            <div>
              <img src={BrokenCar} alt="" />
            </div>
          </Container>
        </>
      );
    }

    return this.props.children;
  }
}
