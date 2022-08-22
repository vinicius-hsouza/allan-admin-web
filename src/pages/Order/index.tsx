import React, { useCallback, useEffect, useState, useRef } from 'react';
import { FiChevronRight, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { format, setDate } from 'date-fns';
import DatePicker from 'react-date-picker';
import { FormHandles } from '@unform/core';

import Badge from '../../components/Badge';
import { Footer, Form } from '../../components/Form';
import Switch from '../../components/Switch';
import { Spin } from '../../components/Spin';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import Select from '../../components/Select';

import {
  Container,
  CardList,
  Card,
  Status,
  Header,
  ButtonToday,
} from './styles';
import Button from '../../components/Button';
import { Modal } from '@atmoutsourcing/siakit';
import Input from '../../components/Input';
import List from '../../components/List';

export default function Order(): JSX.Element {
  const navigate = useNavigate();
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateSelected, setDateSelected] = useState(new Date());
  const [finished, setFinished] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [counterService, setCounterService] = useState<boolean>(true);

  const loadOrder = useCallback(async () => {
    setLoading(true);
    try {
      const date = format(dateSelected, 'yyyy-MM-dd');
      const response = await api.get('/order', {
        params: {
          date,
          finished,
        },
      });

      setOrders(response.data);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: '',
        description:
          err?.data?.message || 'Houve um erro ao buscar os atendimentos',
      });
    } finally {
      setLoading(false);
    }
  }, [dateSelected, finished]);

  async function loadUsers(): Promise<void> {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(
        response.data.map((item: any) => ({
          label: item.username,
          value: item.id,
        })),
      );
    } catch (err: any) {
      addToast({
        type: 'error',
        title: '',
        description:
          err?.data?.message || 'Houve um erro ao buscar os usuários',
      });
    } finally {
      setLoading(false);
    }
  }

  console.log(users);

  async function handleSubmit(data: any): Promise<void> {
    try {
      setLoading(true);
      const response = await api.post('/order', {
        userId: data.userId,
        isCounterService: data.counterService,
      });
      if (response.data) {
        navigate(`/order/${response.data.id}`);
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: '',
        description:
          err?.data?.message || 'Houve um erro ao criar o atendimento',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
  }, [dateSelected, finished]);

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Spin isVisible={loading}>
      <Modal
        title="Novo atendimento"
        onRequestClose={() => {
          setModalVisible(false);
        }}
        isOpen={modalVisible}
      >
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          autoComplete="off"
          initialData={{ counterService: true }}
        >
          <section>
            <Switch
              name="counterService"
              placeholder="Atendimento Balcão"
              label="Atendimento Balcão"
              checked={counterService}
              onChange={e => setCounterService(e.target.checked)}
            />
          </section>
          <section>
            <Select
              name="userId"
              placeholder="Selecione o usuário"
              label="Selecione o usuário"
              icon={FiUser}
              options={users}
              disabled={counterService}
            />
          </section>
          <Footer modal>
            <Button type="submit">Criar</Button>
          </Footer>
        </Form>
      </Modal>
      <Container>
        <Header>
          <Button
            onClick={() => {
              setModalVisible(true);
            }}
          >
            Novo Atendimento
          </Button>
          <div>
            <Form
              ref={formRef}
              onSubmit={() => console.log('form')}
              initialData={{ finished }}
            >
              <Switch
                name="finished"
                label="Finalizados"
                onChange={e => setFinished(e.target.checked)}
              />
            </Form>
            <ButtonToday onClick={() => setDateSelected(new Date())}>
              Hoje
            </ButtonToday>
            <DatePicker
              className="teste"
              calendarClassName="calendarCustom"
              onChange={setDateSelected}
              value={dateSelected}
              format="dd/MM/yyyy"
              calendarIcon={null}
            />
          </div>
        </Header>
        {/* <CardList>
          {orders.length ? (
            orders.map((order: any) => (
              <Card onClick={() => history.push(`/order/${order.id}`)}>
                <img
                  src={order.appointment?.user?.avatar_url}
                  alt="imagem cliente"
                />

                <div>
                  <h2>{order.appointment?.user?.username}</h2>
                  {order.appointment?.date && (
                    <p>
                      Data:{' '}
                      <strong>
                        {format(
                          new Date(order.appointment?.date),
                          'dd/MM/yyy HH:mm',
                        )}
                      </strong>
                    </p>
                  )}
                  {order.appointment?.provider?.id && (
                    <p>
                      Profissional:{' '}
                      <strong>{order.appointment?.provider?.username}</strong>
                    </p>
                  )}
                  <Status finished={order.finished}>
                    <div />
                    <p>{order.finished ? 'Fechado' : 'Aberto'}</p>
                  </Status>
                </div>
                <FiChevronRight />
              </Card>
            ))
          ) : (
            <Empty description="Nã há atendimentos" padding={128} />
          )}
        </CardList> */}
        <List
          onClick={(row: any) => navigate(`/order/${row.id}`)}
          data={orders}
          options={[
            {
              title: 'Cliente',
              dataIndex: '',
              render: row => {
                return (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      style={{
                        height: '3rem',
                        width: '3rem',
                        borderRadius: '50%',
                        borderColor: '#ff9000',
                        borderStyle: 'solid',
                        borderWidth: 2,
                      }}
                      src={
                        row.appointment?.user?.avatar_url ||
                        'https://hvstistorage.sfo3.digitaloceanspaces.com/AllanHebert/avatar_default.jpeg'
                      }
                      alt="imagem cliente"
                      onError={(e: any) => {
                        e.target.onerror = null; // prevents looping
                        e.target.src =
                          'https://hvstistorage.sfo3.digitaloceanspaces.com/AllanHebert/avatar_default.jpeg';
                      }}
                    />
                    <h2
                      style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: '#fff',
                        marginLeft: 8,
                      }}
                    >
                      {row.appointment?.user?.username || 'Cliente Balcão'}
                    </h2>
                  </div>
                );
              },
            },
            {
              title: 'Data',
              dataIndex: '',
              render: row => {
                return format(new Date(row?.date), 'dd/MM/yyy HH:mm');
              },
            },
            {
              title: 'Profissional',
              dataIndex: '',
              render: row => {
                return (
                  row.appointment?.provider?.username || 'Atendimento Balcão'
                );
              },
            },
            {
              title: 'Status',
              dataIndex: 'action',
              render: row => (
                <Status finished={row.finished}>
                  <div />
                  <p>{row.finished ? 'Fechado' : 'Aberto'}</p>
                </Status>
              ),
            },
          ]}
        />
      </Container>
    </Spin>
  );
}
