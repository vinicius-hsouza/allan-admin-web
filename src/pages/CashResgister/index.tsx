import React, { useCallback, useEffect, useState, useRef } from 'react'
import { FiBox, FiDollarSign, FiPackage, FiPercent } from 'react-icons/fi'
import {
  IoClose,
  IoCloseCircle,
  IoCloseCircleOutline,
  IoFolderOpen,
} from 'react-icons/io5'

import { format } from 'date-fns'
import Swal from 'sweetalert2'
import VMasker from 'vanilla-masker'
import * as Yup from 'yup'

import { Button } from '@siakit/button'
import { MoneyInput } from '@siakit/form-unform'
import { Flex } from '@siakit/layout'
import { Modal, ModalContent } from '@siakit/modal'
import { Table } from '@siakit/table'
import { FormHandles } from '@unform/core'

// import Button from '../../components/Button'
import ButtonCSV from '../../components/ButtonCSV'
import Dropdown from '../../components/Dropdown'
import { Form, Footer } from '../../components/Form'
import Input from '../../components/Input'
import InputMask from '../../components/InputMask'
import List from '../../components/List'
import NewDropdown from '../../components/NewDropdown'
import { Spin } from '../../components/Spin'
import Wrapper from '../../components/Wrapper'
import { useLoading } from '../../hooks/loading'
import { useToast } from '../../hooks/toast'
import api from '../../services/api'
import convertToFloat from '../../utils/convertTofloat'
import { datetime, real } from '../../utils/especialFormats'
import getValidationErrors from '../../utils/getValidationErrors'
import { Status } from '../Order/styles'
import { Container } from './styles'

interface ICashRegister {
  id: string
  user_id: string
  closed: boolean
  closeDate: Date
  initialValue: number
  value: number
  created_at: Date
  updated_at: Date
}

export default function CashRegister(): JSX.Element {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const { setLoading } = useLoading()

  const [cashRegisters, setCashRegisters] = useState<ICashRegister[]>([])
  const [modal, setModal] = useState(false)
  const [modalItemsVisible, setModalItemsVisible] = useState(false)
  const [items, setItems] = useState([])

  async function listCashRegisters(): Promise<void> {
    setLoading(true)

    try {
      const response = await api.get('/cashregister', {
        params: { start: 0, limit: 100, search: '' },
      })

      if (response?.data) {
        setCashRegisters(response.data)
      }
    } catch (err: any) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  async function ListItemsToCash(cashRegisterId: string): Promise<void> {
    try {
      setLoading(true)
      const response = await api.get(`/cashRegister/items/${cashRegisterId}`)

      if (response?.data) {
        setItems(response.data)
        setModalItemsVisible(true)
      }
    } catch (err: any) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    listCashRegisters()
  }, [])

  async function handleSubmit(data: any): Promise<void> {
    setLoading(true)

    try {
      formRef.current?.setErrors({})

      const schema = Yup.object().shape({
        initialValue: Yup.string().required('Campo obrigatório'),
      })

      await schema.validate(data, { abortEarly: false })

      const response = await api.post('cashregister', {
        initialValue: convertToFloat(data.initialValue),
      })

      addToast({
        type: 'success',
        title: '',
        description: 'Caixa aberto com sucesso!',
      })

      setCashRegisters([response.data, ...cashRegisters])

      setModal(false)
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)

        formRef.current?.setErrors(errors)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleCloseCashRegister(id: string): Promise<void> {
    setLoading(true)

    try {
      await api.put(`/cashregister/close/${id}`)
      addToast({
        type: 'success',
        title: '',
        description: 'Caixa fechado com sucesso!',
      })

      listCashRegisters()
    } catch (err: any) {
      addToast({
        type: 'error',
        title: '',
        description: err.data.message,
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleOpenCashRegister(id: string): Promise<void> {
    setLoading(true)

    try {
      await api.put(`/cashregister/open/${id}`)
      addToast({
        type: 'success',
        title: '',
        description: 'Caixa aberto com sucesso!',
      })

      listCashRegisters()
    } catch (err: any) {
      addToast({
        type: 'error',
        title: '',
        description: err.data.message,
      })
    } finally {
      setLoading(false)
    }
  }

  function generateDataFormatted(): any {
    // setLoading(true);
    const dataFormatted = items.map((reportItem: any) => ({
      Dia: datetime(reportItem.date),
      Cliente: reportItem.appointment?.user?.username,
      Profissional: reportItem.appointment?.provider?.username,
      'Valor Total': real(reportItem.total),
      'Valor Pago': real(reportItem.totalPayment),
      'Valor Troco': real(reportItem.change),
      'Tipo Pagamento': reportItem.type_payment,
      'Fechado em': datetime(reportItem.finishedDate),
    }))
    // setLoading(false);

    return dataFormatted
  }

  console.log(cashRegisters)

  return (
    <Flex direction="column" flex padding gap>
      <Modal
        onOpenChange={() => {
          setModal(false)
        }}
        open={modal}
      >
        <ModalContent title="Novo caixa" size="xs">
          <Form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
            <Flex padding>
              <MoneyInput
                name="initialValue"
                placeholder="Valor inicial"
                label="Valor inicial"
              />
              {/* <section>
              <InputMask
                mask="money"
                name="initialValue"
                placeholder="Valor inicial"
                label="Valor inicial"
                icon={FiDollarSign}
                />
            </section> */}
            </Flex>

            <Footer modal>
              <Button type="submit">Abrir Caixa</Button>
            </Footer>
          </Form>
        </ModalContent>
      </Modal>

      <Modal
        onOpenChange={() => {
          setModalItemsVisible(false)
        }}
        open={modalItemsVisible}
      >
        <ModalContent title="Listagem" size="lg">
          <div style={{ display: 'flex', overflow: 'auto', padding: 16 }}>
            <List
              data={items}
              options={[
                {
                  title: 'Dia',
                  dataIndex: 'date',
                  render: (row: any) => datetime(row.date),
                },
                { title: 'Cliente', dataIndex: 'appointment.user.username' },
                { title: 'Profissional', dataIndex: 'user.username' },
                {
                  title: 'Valor Total',
                  dataIndex: 'total',
                  render: (row: any) => real(row.total),
                },
                {
                  title: 'Valor Pago',
                  dataIndex: 'totalPayment',
                  render: (row: any) => real(row.totalPayment),
                },
                {
                  title: 'Valor Troco',
                  dataIndex: 'change',
                  render: (row: any) => real(row.change),
                },
                { title: 'Tipo de Pagamento', dataIndex: 'type_payment' },
                {
                  title: 'Operador Caixa',
                  dataIndex: 'cashRegister.user.username',
                },
                { title: 'Fechado em:', dataIndex: 'finishedDate' },
              ]}
            />
          </div>{' '}
          <Footer modal>
            <div>
              <ButtonCSV
                data={generateDataFormatted()}
                reportName="relatorio_caixa.csv"
              />
            </div>
            <Button onClick={() => setModalItemsVisible(false)} color="cancel">
              Fechar
            </Button>
          </Footer>
        </ModalContent>
      </Modal>
      <Flex>
        <Button onClick={() => setModal(true)}>Novo Caixa</Button>
      </Flex>
      <Table
        data={cashRegisters}
        actions={[
          {
            label: 'Fechar caixa',
            type: 'danger',
            onClick: (item) => {
              Swal.fire({
                title: 'Confirme!',
                text: 'Deseja realmente fechar esse caixa?',
                icon: 'warning',
                confirmButtonText: 'Fechar caixa',
                confirmButtonColor: '#dc3545',
                cancelButtonText: 'Cancelar',
                showCancelButton: true,
              }).then((result) => {
                if (result.isConfirmed) {
                  handleCloseCashRegister(item.id as string)
                }
              })
            },
          },
          {
            label: 'Listagem',
            type: 'success',
            onClick: (item) => {
              ListItemsToCash(item.id as string)
            },
          },
        ]}
        headers={[
          { label: 'Operador', dataIndex: 'user.username' },
          {
            label: 'Aberto em',
            dataIndex: 'created_at',
            render: ({ item }) => {
              console.log(item)
              if (!item.created_at) {
                return ''
              }
              return format(new Date(item.created_at as string), 'dd/MM/yyyy')
            },
          },
          {
            label: 'Valor Inicial',
            dataIndex: 'initialValue',
            render: ({ value }) => {
              return (
                value &&
                VMasker.toMoney(String(value), {
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$',
                })
              )
            },
          },

          {
            label: 'Valor atual',
            dataIndex: 'value',
            render: ({ value }) => {
              return (
                value &&
                VMasker.toMoney(String(value), {
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$',
                })
              )
            },
          },
          {
            label: 'Status',
            dataIndex: 'closed',
            render: ({ value }) => (
              <Status finished={!!value}>
                <div />
                <p>{value ? 'Fechado' : 'Aberto'}</p>
              </Status>
            ),
          },
          // {
          //   label: 'Ação',
          //   dataIndex: 'closed',
          //   render: (row) => (
          //     <>
          //       <NewDropdown
          //         options={[
          //           {
          //             title: 'Fechar Caixa',
          //             onClick: () => {
          //               // handleCloseOrder(row.id);
          //               Swal.fire({
          //                 title: 'Confirme!',
          //                 text: 'Deseja realmente fechar esse caixa?',
          //                 icon: 'warning',
          //                 confirmButtonText: 'Fechar caixa',
          //                 confirmButtonColor: '#dc3545',
          //                 cancelButtonText: 'Cancelar',
          //                 showCancelButton: true,
          //               }).then((result) => {
          //                 if (result.isConfirmed) {
          //                   handleCloseCashRegister(row.id)
          //                 }
          //               })
          //             },
          //             isVisible: !row.closed,
          //             Icon: <IoCloseCircle />,
          //             type: 'danger',
          //           },

          //           {
          //             title: 'Listagem',
          //             onClick: () => {
          //               ListItemsToCash(row.id)
          //             },
          //             isVisible: true,
          //             Icon: <IoCloseCircle />,
          //           },
          //           {
          //             title: 'Abrir Caixa',
          //             onClick: () => {
          //               Swal.fire({
          //                 title: 'Confirme!',
          //                 text: 'Deseja realmente abrir esse caixa?',
          //                 icon: 'warning',
          //                 confirmButtonText: 'Abrir caixa',
          //                 confirmButtonColor: '#dc3545',
          //                 cancelButtonText: 'Cancelar',
          //                 showCancelButton: true,
          //               }).then((result) => {
          //                 if (result.isConfirmed) {
          //                   handleOpenCashRegister(row.id)
          //                 }
          //               })
          //             },
          //             isVisible: row.closed,
          //             Icon: <IoFolderOpen />,
          //           },
          //         ]}
          //       />

          //       {/* <Button
          //         size="small"
          //         color="danger"
          //         disabled={row.closed}
          //         onClick={e => {
          //           // handleCloseOrder(row.id);
          //           Swal.fire({
          //             title: 'Confirme!',
          //             text: 'Deseja realmente fechar esse caixa?',
          //             icon: 'warning',
          //             confirmButtonText: 'Fechar caixa',
          //             confirmButtonColor: '#dc3545',
          //             cancelButtonText: 'Cancelar',
          //             showCancelButton: true,
          //           }).then(result => {
          //             if (result.isConfirmed) {
          //               handleCloseCashRegister(row.id);
          //             }
          //           });
          //           e.stopPropagation();
          //         }}
          //       >
          //         Fechar caixa
          //       </Button> */}
          //     </>
          //   ),
          // },
        ]}
      />
    </Flex>
  )
}
