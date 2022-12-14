import React, { useCallback, useEffect, useState, useRef } from 'react'
import DatePicker from 'react-date-picker'
import { FiArrowRight, FiUser } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import { format } from 'date-fns'

import { Avatar } from '@siakit/avatar'
import { Button } from '@siakit/button'
import { Select, Switch } from '@siakit/form-unform'
import { IconButton } from '@siakit/icon-button'
import { Flex } from '@siakit/layout'
import { useLoading } from '@siakit/loading'
import { Modal, ModalContent } from '@siakit/modal'
import { Table } from '@siakit/table'
import { Text } from '@siakit/text'
import { FormHandles } from '@unform/core'

// import Button from '../../components/Button'
import { Footer, Form } from '../../components/Form'
import List from '../../components/List'
// import Select from '../../components/Select'
import { Spin } from '../../components/Spin'
// import Switch from '../../components/Switch'
import { useToast } from '../../hooks/toast'
import api from '../../services/api'
import { Container, Status, Header, ButtonToday } from './styles'

export default function Order(): JSX.Element {
  const navigate = useNavigate()
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const { setLoading } = useLoading()
  const [orders, setOrders] = useState([])

  const [dateSelected, setDateSelected] = useState(new Date())
  const [finished, setFinished] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [users, setUsers] = useState([])
  const [counterService, setCounterService] = useState<boolean>(true)

  const loadOrder = useCallback(async () => {
    setLoading(true)
    try {
      const date = format(dateSelected, 'yyyy-MM-dd')
      const response = await api.get('/order', {
        params: {
          date,
          finished,
        },
      })

      setOrders(response.data)
    } catch (err: any) {
      addToast({
        type: 'error',
        title: '',
        description:
          err?.data?.message || 'Houve um erro ao buscar os atendimentos',
      })
    } finally {
      setLoading(false)
    }
  }, [dateSelected, finished])

  async function loadUsers(): Promise<void> {
    try {
      setLoading(true)
      const response = await api.get('/users')
      setUsers(
        response.data.map((item: any) => ({
          label: item.username,
          value: item.id,
        })),
      )
    } catch (err: any) {
      addToast({
        type: 'error',
        title: '',
        description:
          err?.data?.message || 'Houve um erro ao buscar os usuários',
      })
    } finally {
      setLoading(false)
    }
  }

  console.log(users)

  async function handleSubmit(data: any): Promise<void> {
    try {
      setLoading(true)
      const response = await api.post('/order', {
        userId: data.userId,
        isCounterService: data.counterService,
      })
      if (response.data) {
        navigate(`/order/${response.data.id}`)
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: '',
        description:
          err?.data?.message || 'Houve um erro ao criar o atendimento',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrder()
  }, [dateSelected, finished])

  useEffect(() => {
    loadUsers()
  }, [])

  return (
    <Flex direction="column" flex gap>
      <Modal
        onOpenChange={() => {
          setModalVisible(false)
        }}
        open={modalVisible}
      >
        <ModalContent title="Novo atendimento" size="sm">
          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            autoComplete="off"
            initialData={{ counterService: true }}
          >
            <Flex gap direction="column" padding>
              <Switch
                name="counterService"
                label="Atendimento Balcão"
                onChange={(checked) => setCounterService(checked)}
              />

              <Select
                name="userId"
                placeholder="Selecione o usuário"
                label="Selecione o usuário"
                options={users}
                disabled={counterService}
              />
            </Flex>
            <Footer modal>
              <Button type="submit">Criar</Button>
            </Footer>
          </Form>
        </ModalContent>
      </Modal>

      <Flex justify="between">
        <Button
          onClick={() => {
            setModalVisible(true)
          }}
        >
          Novo Atendimento
        </Button>
        <Flex align="center" gap={8}>
          <Form
            ref={formRef}
            onSubmit={() => console.log('form')}
            initialData={{ finished }}
          >
            <Flex align="center" gap={4}>
              <Text>Finalizados</Text>
              <Switch
                name="finished"
                // label="Finalizados"
                onChange={(checked) => {
                  setFinished(checked)
                }}
              />
            </Flex>
          </Form>
          {/* <ButtonToday onClick={() => setDateSelected(new Date())}>
              Hoje
            </ButtonToday> */}
          <Button
            colorScheme="gray"
            onClick={() => setDateSelected(new Date())}
          >
            Hoje
          </Button>

          <DatePicker
            className="teste"
            calendarClassName="calendarCustom"
            onChange={setDateSelected}
            value={dateSelected}
            format="dd/MM/yyyy"
            calendarIcon={null}
          />
        </Flex>
      </Flex>
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
      <Table
        data={orders}
        headers={[
          {
            label: 'Cliente',
            dataIndex: 'id',
            render: ({ item }: any) => {
              return (
                <Flex align="center" gap={8}>
                  <Avatar
                    src={item.appointment?.user?.avatar_url}
                    name={
                      item.appointment?.user?.username || 'Atendimento Balcão'
                    }
                  />
                  <Text>
                    {item.appointment?.user?.username || 'Atendimento Balcão'}
                  </Text>
                </Flex>
              )
            },
          },
          {
            label: 'Data',
            dataIndex: 'date',
            render: ({ item }) => {
              return format(new Date(item?.date as string), 'dd/MM/yyy HH:mm')
            },
          },
          {
            label: 'Profissional',
            dataIndex: 'id',
            render: (row) => {
              return row.appointment?.provider?.username || 'Atendimento Balcão'
            },
          },
          {
            label: 'Status',
            dataIndex: 'finished',
            render: ({ value }) => (
              <Status finished={!!value}>
                <div />
                <p>{value ? 'Fechado' : 'Aberto'}</p>
              </Status>
            ),
          },
          {
            label: 'Ação',
            dataIndex: 'id',
            render: ({ item }) => (
              <Button
                variant="ghost"
                type="button"
                onClick={() => navigate(`/order/${item.id}`)}
              >
                Editar
                <FiArrowRight />
              </Button>
            ),
          },
        ]}
      />
      {/* <List
          onClick={(row: any) => navigate(`/order/${row.id}`)}
          data={orders}
          options={[
            {
              title: 'Cliente',
              dataIndex: '',
              render: (row) => {
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
                        e.target.onerror = null // prevents looping
                        e.target.src =
                          'https://hvstistorage.sfo3.digitaloceanspaces.com/AllanHebert/avatar_default.jpeg'
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
                )
              },
            },
            {
              title: 'Data',
              dataIndex: '',
              render: (row) => {
                return format(new Date(row?.date), 'dd/MM/yyy HH:mm')
              },
            },
            {
              title: 'Profissional',
              dataIndex: '',
              render: (row) => {
                return (
                  row.appointment?.provider?.username || 'Atendimento Balcão'
                )
              },
            },
            {
              title: 'Status',
              dataIndex: 'action',
              render: (row) => (
                <Status finished={row.finished}>
                  <div />
                  <p>{row.finished ? 'Fechado' : 'Aberto'}</p>
                </Status>
              ),
            },
          ]}
        /> */}
    </Flex>
  )
}
