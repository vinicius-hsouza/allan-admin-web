import React, { useRef } from 'react'

import { Button } from '@siakit/button'
// import { Input } from '@siakit/form-components';
import { Form, TextInput } from '@siakit/form-unform'
import { Flex } from '@siakit/layout'
import { FormHandles } from '@unform/core'

interface Props {
  onSearch: (search: string) => void
}

export default function Search({ onSearch }: Props): JSX.Element {
  const formRef = useRef<FormHandles>(null)

  return (
    <Form ref={formRef} onSubmit={(data) => onSearch(data.search)}>
      <Flex direction="row" gap={8}>
        <TextInput name="search" placeholder="Digite o texto da pesquisa" />
        <Button
          type="button"
          variant="secondary"
          onClick={() => formRef.current?.submitForm()}
        >
          Buscar
        </Button>
      </Flex>
    </Form>
  )
}
