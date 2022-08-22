import React from 'react';
import { FiX } from 'react-icons/fi';
import ReactModal, { Props } from 'react-modal';

import { Header, Content } from './styles';

interface ModalProps extends Props {
  title: string;
  size?: number | string;
  height?: number;
  contentStyle?: object;
  children: React.ReactNode;
}

function Modal({
  children,
  onRequestClose,
  title,
  size = 400,
  contentStyle = {},
  height,
  ...rest
}: ModalProps): JSX.Element {
  return (
    // <ReactModal
    //   onRequestClose={onRequestClose}
    //   style={{
    //     overlay: {
    //       background: 'rgba(0, 0, 0, 0.8)',
    //       zIndex: 1000000000,
    //     },

    //     content: {
    //       top: '50%',
    //       left: '50%',
    //       right: 'auto',
    //       bottom: 'auto',
    //       marginRight: '-50%',
    //       transform: 'translate(-50%, -50%)',
    //       width: size,
    //       maxHeight: 'calc(100vh - 32px)',
    //       border: 0,
    //       padding: 0,
    //       display: 'flex',
    //       flexDirection: 'column',
    //       height,
    //       background: '#272727',
    //       overflowX: 'inherit',
    //       overflow: 'auto',
    //     },
    //   }}
    //   {...rest}
    // >
    //   {title && (
    //     <Header>
    //       <p>{title}</p>
    //       <span>
    //         <FiX size={16} onClick={onRequestClose} />
    //       </span>
    //     </Header>
    //   )}

    //   <Content style={{ ...contentStyle }}>{children}</Content>
    // </ReactModal>
    <p>modal velha</p>
  );
};

export default Modal;
