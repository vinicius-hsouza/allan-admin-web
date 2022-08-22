import React, { useCallback, useEffect, useState, useRef } from 'react';
import VMasker from 'vanilla-masker';
import { FaStar } from 'react-icons/fa';
import { FormHandles } from '@unform/core';
// import { Form } from '@unform/web';
import { FiUser, FiPhone } from 'react-icons/fi';
import { IoPhonePortraitOutline } from 'react-icons/io5';
import { FaBirthdayCake } from 'react-icons/fa';
import * as Yup from 'yup';

import { MdEdit } from 'react-icons/md';
import Wrapper from '../../components/Wrapper';
import Input from '../../components/Input';
import InputMask from '../../components/InputMask';
import Switch from '../../components/Switch';
import { Modal } from '@atmoutsourcing/siakit';
import { Form, Footer } from '../../components/Form';
import { useToast } from '../../hooks/toast';

import api from '../../services/api';

import { ListUser, Header, Card, Container, ContainerHourWork } from './styles';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useLoading } from '../../hooks/loading';
import List from '../../components/List';
import NewDropdown from '../../components/NewDropdown';
import { OperationWork } from '../ConfigBarberHour/styles';

interface User {
  id: string;
  username: string;
  phone: string;
  avatar_url: string;
  dateBirthFormatted?: string;
  providerWorkHour: any;
  isProvider: boolean;
}

const User: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const formSearchRef = useRef<FormHandles>(null);
  const formProviderHourRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const { setLoading } = useLoading();

  const [users, setUsers] = useState<User[]>([]);
  const [userToEdit, setUserToEdit] = useState<User>({} as User);
  const [providerHourEdit, setProviderHourEdit] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    pageCount: 30,
    search: '',
  });

  async function loadUsers(): Promise<void> {
    try {
      setLoading(true);
      const response = await api.get('users', {
        params,
      });
      if (params.page === 1) {
        setUsers(response.data);
      } else {
        setUsers(state => [...state, ...response.data]);
      }
    } catch (err: any) {
      console.error(err?.data?.message);
      addToast({
        title:
          err?.data?.message || 'Houve um erro ao tentar listar os usuários',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data: any): Promise<void> {
    try {
      setLoading(true);
      formRef.current?.setErrors({});

      const [day, month, year] = data?.dateBirth?.split('/');

      const dateBirth = new Date(year, month - 1, day);

      const schema = Yup.object().shape({
        username: Yup.string().required('Campo obrigatório'),
        phone: Yup.string().required('Campo obrigatório'),
      });

      await schema.validate(data, { abortEarly: false });

      if (userToEdit.id) {
        const response = await api.put(`/users/${userToEdit.id}`, {
          ...data,
          dateBirth,
        });

        addToast({
          title: 'Usuário atualizado com sucesso',
          type: 'success',
        });

        setUsers(
          users.map(user => (user.id === userToEdit.id ? response.data : user)),
        );

        if (!response.data.isProvider) {
          setModalVisible(false);
        } else {
          setUserToEdit(response.data);
        }
      } else {
        const response = await api.post('/users', { ...data, dateBirth });

        addToast({
          title: 'Novo usuário criado com sucesso',
          type: 'success',
        });

        setUsers([...users, response.data]);

        if (!response.data.isProvider) {
          setModalVisible(false);
        } else {
          setUserToEdit(response.data);
        }
      }
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
      }

      addToast({
        title:
          err?.data?.message || 'Houve um erro ao tentar criar um usuários',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleModifyProviderHour(data: any): Promise<void> {
    try {
      setLoading(true);
      formProviderHourRef.current?.setErrors({});

      const schema = Yup.object().shape({
        startTimeWork: Yup.string().required('Campo obrigatório'),
        startLunch: Yup.string().required('Campo obrigatório'),
        endLunch: Yup.string().required('Campo obrigatório'),
        endTimeWork: Yup.string().required('Campo obrigatório'),
        isOpenWork: Yup.string().required('Campo obrigatório'),
      });

      await schema.validate(data, { abortEarly: false });

      const response = await api.put(
        `/users/providerHourWork/${providerHourEdit.id}`,
        data,
      );

      if (response.data?.id) {
        setUserToEdit(prevState => ({
          ...prevState,
          providerWorkHour: prevState.providerWorkHour.map((item: any) =>
            item.id === providerHourEdit.id ? response.data : item,
          ),
        }));

        setProviderHourEdit({});
        addToast({
          title: 'Horário de trabalho atualizado com sucesso',
          type: 'success',
        });
      }
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formProviderHourRef.current?.setErrors(errors);
      }

      addToast({
        title:
          err?.data?.message || 'Houve um erro ao tentar criar um usuários',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [params]);

  return (
    <Container>
      <Modal
        title={userToEdit.id ? 'Editar usuário' : 'Novo usuário'}
        onRequestClose={() => {
          setUserToEdit({} as User);
          setModalVisible(false);
        }}
        isOpen={modalVisible}
        size={userToEdit.id ? 'xl' : 'md'}
      >
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          autoComplete="off"
          initialData={{
            ...userToEdit,
            dateBirth: userToEdit?.dateBirthFormatted,
          }}
        >
          <section>
            <Input
              name="username"
              placeholder="Nome do usuário"
              label="Nome (Obrigatório)"
              icon={FiUser}
            />

            <InputMask
              mask="phone"
              label="Celular (Obrigatório)"
              name="phone"
              placeholder="Digite o numero do celular"
              icon={IoPhonePortraitOutline}
            />

            <InputMask
              name="dateBirth"
              mask="date"
              label="Data de nascimento (Obrigatório)"
              placeholder="Digite a data de nascimento"
              icon={FaBirthdayCake}
            />
          </section>

          <section>
            <Switch
              orientation="vertical"
              name="isAdmin"
              label="Administrador?"
            />

            <Switch
              orientation="vertical"
              name="isProvider"
              label="Prestador?"
            />
          </section>
          {userToEdit?.isProvider && (
            <ContainerHourWork>
              <List
                data={userToEdit?.providerWorkHour}
                options={[
                  { title: 'Dia da Semana', dataIndex: 'dayLabel' },
                  {
                    title: 'Inicio de trabalho',
                    dataIndex: 'startTimeWork',
                  },
                  { title: 'Inicio de almoço', dataIndex: 'startLunch' },
                  { title: 'Fim do almoço', dataIndex: 'endLunch' },
                  { title: 'Fim de trabalho', dataIndex: 'endTimeWork' },
                  {
                    title: 'Faz atendimento?',
                    dataIndex: 'isOpenWork',
                    render: row => (
                      <OperationWork open={!row.isOpenWork}>
                        <div />
                        <p>{row.isOpenWork ? 'Atende' : 'Não atende'}</p>
                      </OperationWork>
                    ),
                  },
                  {
                    title: 'Ação',
                    dataIndex: '',
                    render: row => (
                      <>
                        <Button
                          size="small"
                          onClick={() => {
                            setProviderHourEdit(row);
                          }}
                        >
                          Editar
                        </Button>
                        {/* <NewDropdown
                        options={[
                          {
                            title: 'Editar',
                            onClick: () => {
                              setProviderHourEdit(row);
                            },
                            Icon: <MdEdit />,
                            type: 'default',
                          },
                        ]}
                      /> */}
                      </>
                    ),
                  },
                ]}
              />
            </ContainerHourWork>
          )}

          <Footer modal>
            <Button type="submit">
              {userToEdit.id ? 'Salvar' : 'Cadastrar'}
            </Button>
          </Footer>
        </Form>
      </Modal>
      <Modal
        title="Editar hora de trabalho"
        isOpen={providerHourEdit.id}
        onRequestClose={() => {
          setProviderHourEdit({});
        }}
      >
        <Form
          ref={formProviderHourRef}
          onSubmit={handleModifyProviderHour}
          initialData={providerHourEdit}
        >
          <section>
            <InputMask
              mask="hour"
              name="startTimeWork"
              label="Inicio de trabalho"
              placeholder="Inicio de trabalho"
            />
          </section>
          <section>
            <InputMask
              mask="hour"
              name="startLunch"
              label="Inicio de almoço"
              placeholder="Inicio de almoço"
            />
          </section>
          <section>
            <InputMask
              mask="hour"
              name="endLunch"
              label="Fim de almoço"
              placeholder="Fim de almoço"
            />
          </section>
          <section>
            <InputMask
              mask="hour"
              name="endTimeWork"
              label="Fim de trabalho"
              placeholder="Fim de trabalho"
            />
          </section>
          <section>
            <Switch name="isOpenWork" label="Faz atendimento?" />
          </section>
          <Footer modal>
            <Button type="submit">Salvar</Button>
          </Footer>
        </Form>
      </Modal>
      <Header>
        <Button onClick={() => setModalVisible(true)}>Novo usuário</Button>
        <Form
          ref={formSearchRef}
          onSubmit={data => {
            setParams({ ...params, search: data.search, page: 1 });
          }}
        >
          <section>
            <Input name="search" placeholder="Digite aqui a pesquisa" />
            <Button type="submit">Buscar</Button>
          </section>
        </Form>
      </Header>
      <ListUser>
        {users?.map((user: User) => (
          <Card
            onClick={() => {
              setModalVisible(true);
              setUserToEdit(user);
            }}
          >
            <img src={user?.avatar_url} alt="avatar_user" />
            <div>
              <h3>{user?.username}</h3>
              <h2>
                {user?.phone &&
                  VMasker.toPattern(user?.phone, '(99) 99999-9999')}
              </h2>
            </div>
            {/* <ContainerStars>
              <FaStar />
              <Stars>5</Stars>
            </ContainerStars> */}
          </Card>
        ))}
      </ListUser>
      <Footer style={{ justifyContent: 'center' }}>
        <Button
          onClick={() => setParams({ ...params, page: params.page + 1 })}
          type="submit"
        >
          Carregar mais usuários ⬇
        </Button>
      </Footer>
    </Container>
  );
};

export default User;
