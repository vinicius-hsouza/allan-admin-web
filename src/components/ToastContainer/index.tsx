import React from 'react';
import { useTransition } from 'react-spring';

import Toast from './Toast';

import { ToastMessage } from '../../hooks/toast';
import { Container } from './styles';

interface ToastContainerProps {
  messages: ToastMessage[];
}

export default function ToastContainer({ messages }: ToastContainerProps): JSX.Element {
  // const messagesWithTransitions: any = useTransition<any, any>(
  //   messages,
  //   (message: any) => message?.id || 0,
  //   {
  //     from: { right: '-120%', opacity: 0 },
  //     enter: { right: '0%', opacity: 1 },
  //     leave: { right: '-120%', opacity: 0 },
  //   } as any,
  // );

  return (
    // <Container id="toast-container">
    //   {messagesWithTransitions.map(({ item, key, props }: any) => (
    //     <Toast key={key} style={props} message={item} />
    //   ))}
    // </Container>
    <></>
  );
}

