import React, { createContext, useContext, useEffect, useState } from 'react';

// import { useNavigate } from 'react-router-dom';

import { Spin } from '../components/Spin';

interface LoadingContextData {
  setLoading(value: boolean): void;
}

type Props = {
  children: React.ReactNode;
}

const LoadingContext = createContext({} as LoadingContextData);

let test = (value: boolean): void => {
  const valor = value;
};

const setLoadingOutsideHook = (value: boolean): void => {
  test(value);
};

function LoadingProvider({ children }: Props): JSX.Element {
  // const navigate = useNavigate();

  const [refs, setRefs] = useState(0);

  // useEffect(() => {
  //   navigate.listen((_, action) => {
  //     if (action === 'POP') {
  //       setRefs(0);
  //     }
  //   });
  // }, []);

  function setLoading(value: boolean): void {
    if (value) {
      setRefs(prevState => prevState + 1);
    } else {
      setRefs(prevState => (prevState <= 0 ? 0 : prevState - 1));
    }
  }

  test = (value: boolean) => {
    setLoading(value);
  };

  return (
    <LoadingContext.Provider value={{ setLoading }}>
      <Spin isVisible={!!refs}>{children}</Spin>
    </LoadingContext.Provider>
  );
};

const useLoading = (): LoadingContextData => {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }

  return context;
};

export { LoadingProvider, useLoading, setLoadingOutsideHook };
