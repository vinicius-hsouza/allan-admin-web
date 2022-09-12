import React, { useRef } from 'react';

import { Input, Button, Form } from '@atmoutsourcing/siakit';
import { FormHandles } from '@unform/core';

interface Props {
  onSearch: (search: string) => void;
}

export default function Search({ onSearch }: Props): JSX.Element {
  const formRef = useRef<FormHandles>(null);

  return (
    <Form ref={formRef} onSubmit={(data) => onSearch(data.search)} direction="row" gap={8}>
      <Input name="search" placeholder="Digite o texto da pesquisa" />
      <Button type="button" variant='secondary' onClick={() => formRef.current?.submitForm()}>
        Buscar
      </Button>
    </Form>
  );
}
