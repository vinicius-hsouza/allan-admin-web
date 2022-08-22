import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail, FiLock, FiPhone } from 'react-icons/fi';
import { FormHandles } from '@unform/core';

import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.png';

import Input from '../../components/Input';
import InputMask from '../../components/InputMask';
import Button from '../../components/Button';
import { Form } from '../../components/Form';

import { Container, Content, AnimationContainer, Background } from './styles';

interface SignInFormData {
  phone: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();

  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          phone: Yup.string().required('Celular é obrigatório'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const phoneFormatted = data.phone
          .replace('(', '')
          .replace(')', '')
          .replace(' ', '')
          .replace('-', '');

        await signIn({
          phone: phoneFormatted,
          password: data.password,
        });

        navigate('/dashboard');
      } catch (err: any) {
        console.log(err);
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description:
            err?.data?.message ||
            'Ocorreu um erro ao fazer login, cheque as credenciais.',
        });
      }
    },
    [signIn, addToast, history],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="AllanHebert" />

          <Form ref={formRef} onSubmit={handleSubmit} aria-autocomplete="none">
            <h1>Faça seu logon</h1>
            <section>
              <InputMask
                mask="phone"
                name="phone"
                icon={FiPhone}
                placeholder="celular"
              />
            </section>
            <section>
              <Input
                name="password"
                icon={FiLock}
                type="password"
                placeholder="Senha"
                autoComplete="new-password"
              />
            </section>

            <section>
              <Button type="submit" style={{ width: '100%' }}>
                Entrar
              </Button>
            </section>

            <Link to="/forgot-password">Esqueci minha senha</Link>
          </Form>

          {/* <Link to="/signup">
            <FiLogIn />
            Criar conta
          </Link> */}
        </AnimationContainer>
      </Content>

      {/* <Background /> */}
    </Container>
  );
};

export default SignIn;
