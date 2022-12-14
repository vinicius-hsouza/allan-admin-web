import React, { useEffect, useRef, useState } from 'react'
import { IoChevronBack, IoChevronForward, IoReload } from 'react-icons/io5'

import {
  addDays,
  differenceInMinutes,
  format,
  isEqual,
  subDays,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Avatar } from '@siakit/avatar'
import { FormHandles } from '@unform/core'

import Button from '../../components/Button'
import DatePicker from '../../components/DatePicker'
import { Form } from '../../components/Form'
import { useLoading } from '../../hooks/loading'
import { useToast } from '../../hooks/toast'
import api from '../../services/api'
import Item from './Item'
import ModalCreateAppointment from './ModalCreateAppointment'
import ModalCreateBloqued from './ModalCreateBloqued'
import { Container, Header, Content, SpanLine, SpanLineHeader } from './styles'

type ItemSchedule = {
  type: string
  appointment: any
  bloqued: any
  duration: number
  provider_id: string
  date: string
}

export default function NewSchedule(): JSX.Element {
  const { setLoading } = useLoading()
  const { addToast } = useToast()
  const formRef = useRef<FormHandles>(null)

  const [providers, setProviders] = useState([])
  const [itemsSchedule, setItemsSchedule] = useState<ItemSchedule[]>([])
  const [dateSelected, setDateSelected] = useState(new Date())
  const [modalNewAppointmentVisible, setModalNewAppointmentVisible] =
    useState(false)

  const [modalNewBloquedVisible, setModalNewBloquedVisible] = useState(false)

  async function loadItems(): Promise<void> {
    try {
      setLoading(true)

      const startDate = new Date(dateSelected)
      startDate.setHours(0)
      startDate.setMinutes(0)
      startDate.setSeconds(0)
      const endDate = new Date(dateSelected)
      endDate.setHours(23)
      endDate.setMinutes(59)
      endDate.setSeconds(59)

      const [responseSchedule, responseProviders] = await Promise.all([
        api.get('/provider/schedule', {
          params: {
            startDate,
            endDate,
          },
        }),
        api.get('/provider'),
      ])

      setItemsSchedule(responseSchedule.data)
      setProviders(responseProviders.data)
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCancelAppointment(appointment_id: any): Promise<void> {
    try {
      setLoading(true)
      await api.post(`/appointments/cancel/${appointment_id}`)

      addToast({
        type: 'success',
        title: '',
        description: ' Agendamento cancelado com sucesso!',
      })

      setItemsSchedule((prevState) =>
        prevState.filter(
          (item: any) => item.appointment?.id !== appointment_id,
        ),
      )
    } catch (err: any) {
      // Alert.alert('Opss...', 'Não foi possivel cancelar esse agendamento!');
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCostumerMissedAppointment(
    appointment_id: any,
  ): Promise<void> {
    try {
      setLoading(true)
      const response = await api.post(`/appointments/costumerMissed`, {
        appointment_id,
      })

      addToast({
        type: 'success',
        title: '',
        description: ' Agendamento modificado com sucesso!',
      })

      setItemsSchedule((prevState) =>
        prevState.map((item: any) => {
          if (item.type === 'appointment') {
            if (item.appointment.id === appointment_id) {
              return {
                ...item,
                appointment: {
                  ...item.appointment,
                  status: response.data?.status,
                },
              }
            }

            return item
          }

          return item
        }),
      )
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Opss...',
        description:
          err.data.message || 'Não foi possivel modificar esse agendamento!',
      })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCancelBloquedTime(bloquedId: any): Promise<void> {
    try {
      setLoading(true)
      const response = await api.delete(`provider/bloqued/${bloquedId}`)

      if (response.data) {
        addToast({
          type: 'success',
          title: '',
          description: 'Bloqueio removido com sucesso!',
        })
        setItemsSchedule((prevState) =>
          prevState.filter((item: any) => item.bloqued?.id !== bloquedId),
        )
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: '',
        description:
          err?.data?.message || 'Não foi possivel remover esse bloqueio!',
      })
    } finally {
      setLoading(false)
    }
  }

  /* const data = Array.from({ length: 32 }, (_, index) => index + 1); */

  const data = Array.from({ length: 32 }, (_, index) => {
    return {
      hour:
        index % 2 !== 0
          ? Math.floor(index + 8 - index / 2)
          : Math.floor(index + 8 - (index - 1) / 2),
      minute: index % 2 === 0 ? 0 : 30,
    }
  })

  // const providers: any = [
  //   {
  //     id: 1,
  //     username: 'Prestador 1',
  //     avatar_url: 'https://avatars.githubusercontent.com/u/12279662?v=4',
  //     phone: '+5519983262172',
  //   },
  // ];

  useEffect(() => {
    loadItems()
  }, [dateSelected])

  return (
    <>
      <ModalCreateAppointment
        visible={modalNewAppointmentVisible}
        onClose={() => {
          setModalNewAppointmentVisible(false)
        }}
      />

      <ModalCreateBloqued
        visible={modalNewBloquedVisible}
        onClose={() => {
          setModalNewBloquedVisible(false)
        }}
        onCreated={(value: any) => {
          const dateBloqued = new Date(value.startDate)
          dateBloqued.setHours(0, 0, 0, 0)
          if (isEqual(dateBloqued, new Date(dateSelected))) {
            setItemsSchedule((prevState) => [
              ...prevState,
              {
                type: 'bloquedTime',
                appointment: null,
                bloqued: value,
                duration: differenceInMinutes(
                  new Date(value.endDate),
                  new Date(value.startDate),
                ),
                provider_id: value.provider_id,
                date: value.startDate,
              },
            ])
          }
        }}
      />

      <Container>
        <Header>
          <div>
            <Button
              onClick={() => {
                setModalNewAppointmentVisible(true)
              }}
            >
              Novo Agendamento
            </Button>
            <Button
              color="danger"
              onClick={() => {
                setModalNewBloquedVisible(true)
              }}
            >
              Novo Bloqueio
            </Button>
          </div>

          <div>
            <Button
              onClick={() => {
                setDateSelected(new Date())
                formRef.current?.setFieldValue('date', new Date())
              }}
            >
              Hoje
            </Button>
            <Button
              onClick={() => {
                const date = subDays(dateSelected, 1)
                setDateSelected(date)
                formRef.current?.setFieldValue('date', date)
              }}
              style={{
                alignItems: 'center',
                display: 'flex',
                background: '#323234',
              }}
            >
              <IoChevronBack size={18} />
            </Button>
            <Form
              ref={formRef}
              onSubmit={() => undefined}
              initialData={
                dateSelected && { date: format(dateSelected, 'dd/MM/yyyy') }
              }
            >
              <DatePicker
                name="date"
                placeholder="Selecione a data"
                onDateSelected={(value) => setDateSelected(value)}
              />
            </Form>
            <Button
              onClick={() => {
                const date = addDays(dateSelected, 1)
                setDateSelected(date)
                formRef.current?.setFieldValue('date', date)
              }}
              style={{
                alignItems: 'center',
                display: 'flex',
                marginLeft: 4,
                background: '#323234',
              }}
            >
              <IoChevronForward size={18} />
            </Button>
            <Button
              onClick={() => {
                loadItems()
              }}
              style={{
                alignItems: 'center',
                display: 'flex',
                marginLeft: 4,
                background: '#323234',
              }}
            >
              <IoReload size={18} />
            </Button>
          </div>
        </Header>
        <div style={{ overflow: 'auto' }}>
          <Content columns={providers.length}>
            <span
              style={{
                width: '100%',
                borderWidth: 0.05,
                // borderColor: 'rgb(52, 50, 51)',
                // borderStyle: 'solid',
                height: 64,
                position: 'sticky',
                top: 0,

                // background: '#202025',
              }}
            />
            {providers.map((item: any) => (
              <SpanLineHeader key={item.id}>
                <div>
                  <Avatar src={item?.avatar_url} name={item?.username} />
                  <p>{item?.username}</p>
                </div>
                <div>
                  <h3>{format(dateSelected, 'EEE dd', { locale: ptBR })}</h3>
                </div>
              </SpanLineHeader>
            ))}

            {data.map(({ hour, minute }, index) => (
              <>
                <span
                  style={{
                    width: '100%',
                    borderWidth: 0.05,
                    borderColor: 'rgb(52, 50, 51)',
                    position: 'relative',
                    height: 64,
                  }}
                >
                  <p
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: 4,
                      fontSize: 14,
                      color: minute === 0 ? '#ff8503' : '#aeb4b0',
                    }}
                  >
                    {String(hour).padStart(2, '0')}:
                    {String(minute).padStart(2, '0')}
                    {/* {String(index + 8).padStart(2, '0')}:{(index + 8) % 2 === 0 ? '00' : '30'} */}
                  </p>
                  {/* <p
                    style={{
                      position: 'absolute',
                      top: 56,
                      right: 4,
                      fontSize: 14,
                      // color: '#737373',
                      color: '#aeb4b0',
                    }}
                  >
                    {String(index + 8).padStart(2, '0')}:30
                  </p> */}
                </span>
                {providers.map((provider: any) => (
                  <SpanLine key={provider.id}>
                    {itemsSchedule?.map((item: any) => {
                      if (
                        new Date(item.date).getHours() === hour &&
                        new Date(item.date).getMinutes() === minute &&
                        item.provider_id === provider.id
                      ) {
                        return (
                          <Item
                            key={item.id}
                            data={item}
                            onCostumerMissedAppointment={
                              handleCostumerMissedAppointment
                            }
                            onCancelAppointment={handleCancelAppointment}
                            onCancelBloqued={handleCancelBloquedTime}
                          />
                        )
                      }

                      return <></>
                    })}
                  </SpanLine>
                ))}
              </>
            ))}
          </Content>
        </div>
      </Container>
    </>
  )
}
