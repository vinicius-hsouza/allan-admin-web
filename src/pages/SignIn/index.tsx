import React, { useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import * as Yup from 'yup'

import { Button } from '@siakit/button'
import { MaskInput, PasswordInput } from '@siakit/form-unform'
import { Heading } from '@siakit/heading'
import { Flex } from '@siakit/layout'
import { FormHandles } from '@unform/core'

import logoImg from '../../assets/logo.png'
import { Form } from '../../components/Form'
import { useAuth } from '../../hooks/auth'
import { useToast } from '../../hooks/toast'
import getValidationErrors from '../../utils/getValidationErrors'
import { Container, Content, AnimationContainer } from './styles'

interface SignInFormData {
  phone: string
  password: string
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const { signIn } = useAuth()
  const { addToast } = useToast()

  const navigate = useNavigate()

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          phone: Yup.string().required('Celular é obrigatório'),
          password: Yup.string().required('Senha obrigatória'),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        const phoneFormatted = data.phone
          .replace('(', '')
          .replace(')', '')
          .replace(' ', '')
          .replace('-', '')

        await signIn({
          phone: phoneFormatted,
          password: data.password,
        })

        navigate('/')
      } catch (err: any) {
        console.log(err)
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)

          return
        }

        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description:
            err?.data?.message ||
            'Ocorreu um erro ao fazer login, cheque as credenciais.',
        })
      }
    },
    [signIn, addToast, history],
  )

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="AllanHebert" />

          <Heading size="sm">Acesse</Heading>
          <Form ref={formRef} onSubmit={handleSubmit} aria-autocomplete="none">
            <Flex direction="column" gap>
              <MaskInput mask="phone" name="phone" placeholder="celular" />

              <PasswordInput name="password" placeholder="Senha" />

              <Button type="submit">Entrar</Button>
            </Flex>

            {/* <Link to="/forgot-password">Esqueci minha senha</Link> */}
          </Form>

          {/* <Link to="/signup">
            <FiLogIn />
            Criar conta
          </Link> */}
        </AnimationContainer>
      </Content>

      {/* <Background /> */}
    </Container>
  )
}

export default SignIn
