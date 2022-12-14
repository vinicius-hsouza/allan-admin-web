/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'
import { FiUserX } from 'react-icons/fi'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { IoLogoWhatsapp } from 'react-icons/io5'

import { format } from 'date-fns'
import Swal from 'sweetalert2'
import { toPattern } from 'vanilla-masker'

import { Avatar } from '@siakit/avatar'
import { Badge } from '@siakit/badge'
import { Heading } from '@siakit/heading'
import { Flex } from '@siakit/layout'
import { Modal, ModalContent } from '@siakit/modal'
import { Text } from '@siakit/text'

import {
  CardAppointment,
  CardAppointmentContent,
  CardBloquedContent,
  CardLunchContent,
} from '../styles'
import {
  ContainerModalInfoAppointment,
  ContainerModalInfoBloqued,
} from './styles'

type Props = {
  data: any
  onCancelBloqued?: (bloquedId: string) => void
  onCancelAppointment?: (appointmentId: string) => void
  onCostumerMissedAppointment?: (appointmentId: string) => void
}

export default function Item({
  data,
  onCancelAppointment,
  onCancelBloqued,
  onCostumerMissedAppointment,
}: Props) {
  const [modalInfoAppointmentVisible, setModalInfoAppointmentVisible] =
    useState(false)
  const [modalInfoBloquedVisible, setModalInfoBloquedVisible] = useState(false)

  if (data.type === 'appointment') {
    return (
      <>
        <Modal
          open={modalInfoAppointmentVisible}
          onOpenChange={() => setModalInfoAppointmentVisible(false)}
        >
          <ModalContent title="Informaçōes do agendamento" size="md">
            <ContainerModalInfoAppointment>
              <div>
                <img
                  src={data.appointment?.user.avatar_url}
                  alt="AvatarClient"
                />
                <span>
                  <h1>{data.appointment?.user.username}</h1>
                  <p>
                    {data.appointment?.user.phone &&
                      toPattern(
                        data.appointment?.user.phone,
                        '(99) 99999-9999',
                      )}
                  </p>
                </span>
                <span>
                  <div style={{ background: data.appointment?.status.color }} />
                  <p style={{ color: data.appointment?.status.color }}>
                    {data.appointment?.status.name}
                  </p>
                </span>
              </div>
              <div>
                <h2>Serviços</h2>
                {data.appointment?.services?.map((service: any) => (
                  <p key={service.id}>{service.name}</p>
                ))}
              </div>
              <div>
                <div
                  onClick={() => {
                    if (data.appointment?.user.phone) {
                      window.open(
                        `https://wa.me/55${data.appointment?.user.phone}`,
                      )
                    }
                  }}
                >
                  <IoLogoWhatsapp />
                  <p>Whatsapp</p>
                </div>
                <div
                  onClick={() => {
                    Swal.fire({
                      title: 'Confirme!',
                      text: `Confirma que ${data.appointment?.user.username} não compareceu ao atendimento?`,
                      icon: 'warning',
                      confirmButtonText: 'Confirmar',
                      confirmButtonColor: '#dc3545',
                      showCloseButton: true,
                      cancelButtonText: 'Fechar',
                      showCancelButton: true,
                      showLoaderOnConfirm: true,
                      focusConfirm: true,
                    }).then((result: any) => {
                      if (result.isConfirmed) {
                        setModalInfoAppointmentVisible(false)
                        if (onCostumerMissedAppointment) {
                          onCostumerMissedAppointment(data.appointment?.id)
                        }
                      }
                    })
                  }}
                >
                  <FiUserX />
                  <p>Cliente Faltou</p>
                </div>
                <div
                  onClick={() => {
                    Swal.fire({
                      title: 'Confirme!',
                      text: 'Deseja realmente cancelar esse agendamento?',
                      icon: 'warning',
                      confirmButtonText: 'Confirmar cancelamento',
                      confirmButtonColor: '#dc3545',
                      showCloseButton: true,
                      cancelButtonText: 'Fechar',
                      showCancelButton: true,
                      showLoaderOnConfirm: true,
                      focusConfirm: true,
                    }).then((result: any) => {
                      if (result.isConfirmed) {
                        setModalInfoAppointmentVisible(false)
                        if (onCancelAppointment) {
                          onCancelAppointment(data.appointment?.id)
                        }
                      }
                    })
                  }}
                >
                  <IoIosCloseCircleOutline />
                  <p>Cancelar Agendamento</p>
                </div>
              </div>
            </ContainerModalInfoAppointment>
          </ModalContent>
        </Modal>
        <CardAppointment
          duration={(data.duration / 30) * 100}
          // style={{
          //   marginTop:
          //     new Date(data.appointment?.date).getMinutes() < 30 ? 0 : 60,
          // }}
          onClick={() => setModalInfoAppointmentVisible(true)}
        >
          <CardAppointmentContent
            colorStatus={data.appointment?.status.color}
            duration={(data.duration / 30) * 100}
          >
            {/* <img src={data.appointment?.user.avatar_url} alt="userAvatar" /> */}
            <Flex>
              <Avatar
                name={data.appointment?.user.username?.trim()}
                src={data.appointment?.user.avatar_url}
                size="md"
              />
            </Flex>
            <Flex
              flex
              direction="column"
              // style={{ background: 'tomato' }}
              justify="start"
            >
              <Flex gap={8} flex direction="row">
                <Heading size="xs">{data.appointment?.user.username}</Heading>
                {data.appointment.fit && <Badge color="orange">Encaixe</Badge>}
              </Flex>
              <Flex flex direction="row" flexWrap="wrap">
                {data.appointment?.services?.map(
                  (service: any, index: number) => {
                    if (index === 0) {
                      return (
                        <Text key={service.id} size="xs">
                          {service.name}
                        </Text>
                      )
                    }

                    return (
                      <Text key={service.id} size="xs">
                        , {service.name}
                      </Text>
                    )
                  },
                )}
              </Flex>
            </Flex>
            <Flex>
              {/* <div style={{ background: data.appointment?.status.color }} /> */}
              <Text style={{ color: data.appointment?.status.color }}>
                {data.appointment?.status.name}
              </Text>
            </Flex>
          </CardAppointmentContent>
        </CardAppointment>
      </>
    )
  }

  if (data.type === 'bloquedTime') {
    return (
      <>
        <Modal
          open={modalInfoBloquedVisible}
          onOpenChange={() => setModalInfoBloquedVisible(false)}
        >
          <ModalContent title="Informações do bloqueio" size="md">
            <ContainerModalInfoBloqued>
              <div>
                <p>
                  <b>Inicio/Fim: </b>
                  {format(
                    new Date(data.bloqued.startDate),
                    'dd/MM/yyyy HH:mm',
                  )}{' '}
                  até{' '}
                  {format(new Date(data.bloqued.endDate), 'dd/MM/yyyy HH:mm')}
                </p>
                <p>
                  <b>Motivo: </b> {data.bloqued.reason || 'Sem Motivo'}
                </p>
              </div>
              <div>
                <div
                  onClick={() => {
                    Swal.fire({
                      title: 'Confirme!',
                      text: 'Deseja realmente cancelar esse bloqueio?',
                      icon: 'warning',
                      confirmButtonText: 'Confirmar cancelamento',
                      confirmButtonColor: '#dc3545',
                      showCloseButton: true,
                      cancelButtonText: 'Fechar',
                      showCancelButton: true,
                      showLoaderOnConfirm: true,
                      focusConfirm: true,
                    }).then((result: any) => {
                      if (result.isConfirmed) {
                        setModalInfoBloquedVisible(false)
                        if (onCancelBloqued) {
                          onCancelBloqued(data.bloqued.id)
                        }
                      }
                    })
                  }}
                >
                  <IoIosCloseCircleOutline />
                  <p>Remover Bloqueio</p>
                </div>
              </div>
            </ContainerModalInfoBloqued>
          </ModalContent>
        </Modal>
        <CardAppointment
          duration={(data.duration / 30) * 100}
          onClick={() => setModalInfoBloquedVisible(true)}
        >
          <CardBloquedContent duration={(data.duration / 30) * 100}>
            <h1>Bloqueado</h1>
            <p>{data.bloqued.reason || 'Sem Motivo'}</p>
          </CardBloquedContent>
        </CardAppointment>
      </>
    )
  }

  if (data.type === 'lunch') {
    return (
      <CardAppointment
        duration={(data.duration / 30) * 100}
        onClick={() => setModalInfoBloquedVisible(true)}
      >
        <CardLunchContent duration={(data.duration / 30) * 100}>
          <h1>Almoço</h1>
          {/* <p>Almoço</p> */}
        </CardLunchContent>
      </CardAppointment>
    )
  }

  return <></>
}
