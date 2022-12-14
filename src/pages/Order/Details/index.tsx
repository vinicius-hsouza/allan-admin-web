/* eslint-disable no-console */
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { format } from 'date-fns'
import swal from 'sweetalert2'
import VMasker from 'vanilla-masker'
import * as Yup from 'yup'

// import Button from '../../../components/Button';

// import Select from '../../../components/Select';
// import InputMask from '../../../components/InputMask';
// import Switch from '../../../components/Switch';

import { Button } from '@siakit/button'
import { FooterLeft } from '@siakit/footer'
import {
  MaskInput,
  MoneyInput,
  Select,
  Switch,
  TextAreaInput,
  TextInput,
} from '@siakit/form-unform'
import { Heading } from '@siakit/heading'
import { Flex } from '@siakit/layout'
import { useLoading } from '@siakit/loading'
import { Modal, ModalContent } from '@siakit/modal'
import { Separator } from '@siakit/separator'
import { Table } from '@siakit/table'
import { Text } from '@siakit/text'
import { FormHandles } from '@unform/core'

import { Form, Footer } from '../../../components/Form'
import InputMask from '../../../components/InputMask'
import List from '../../../components/List'
import { Spin } from '../../../components/Spin'
import ProductDTO from '../../../dtos/ProductDTO'
import { useToast } from '../../../hooks/toast'
import api from '../../../services/api'
import convertToFloat from '../../../utils/convertTofloat'
import getValidationErrors from '../../../utils/getValidationErrors'
import {
  Container,
  Content,
  Title,
  Header,
  PaymentContainer,
  TotalContainer,
} from './styles'

interface ParamsProps {
  id: string
}

interface IService {
  name: string
  id: string
}

interface DataFormPayment {
  value: string
  type_payment_id: string
}

export default function OrderDetails(): JSX.Element {
  const formRef = useRef<FormHandles>(null)
  const formCloseOrderRef = useRef<FormHandles>(null)
  const formApplyTypePaymentRef = useRef<FormHandles>(null)
  const formAddServiceRef = useRef<FormHandles>(null)
  const { id } = useParams()
  const { addToast } = useToast()
  const { setLoading } = useLoading()

  const [order, setOrder] = useState<any>({})
  const [modalAddProducts, setModalAddProducts] = useState(false)
  const [modalAddServices, setModalAddServices] = useState(false)
  const [modalCloseOrder, setModalCloseOrder] = useState(false)

  const [products, setProducts] = useState<ProductDTO[]>([])
  const [productToEdit, setProductToEdit] = useState<any>({})
  // const [loading, setLoading] = useState(false)
  const [totalPayment, setTotalPayment] = useState(0)
  const [typePayment, setTypePayment] = useState('DINHEIRO')
  const [services, setServices] = useState<IService[]>([])
  const [totalDiscount, setTotalDiscount] = useState(0)
  const [totalValue, setTotalValue] = useState(0)
  const [changeValue, setChangeValue] = useState(0)
  const [typePayments, setTypePayments] = useState([])

  const listProducts = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get('/product', {
        params: { start: 0, limit: 1000, search: '' },
      })
      setProducts(response.data)
    } catch (err: any) {
      console.log(err.data.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (modalAddProducts) {
      listProducts()
    }
  }, [modalAddProducts])

  async function loadOrderData(): Promise<void> {
    setLoading(true)
    try {
      const response = await api.get(`/order/${id}`)
      setOrder(response.data)
    } catch (err: any) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  async function loadServices(): Promise<void> {
    try {
      setLoading(true)
      const response = await api.get('/services')
      if (response.data) {
        const serviceIds = order.appointment?.services.map(
          (item: any) => item.id,
        )
        console.log(serviceIds)

        setServices(
          response.data.filter((item: any) => !serviceIds?.includes(item.id)),
        )
      }
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function loadTypesPayment(): Promise<void> {
    try {
      setLoading(true)
      const response = await api.get('/type-payment')

      if (response.status === 200) {
        setTypePayments(
          response.data?.map((item: any) => ({
            label: item.name,
            value: item.id,
          })),
        )
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadOrderData()
    }
  }, [id])

  useEffect(() => {
    loadServices()
    loadTypesPayment()
  }, [])

  async function handleAddProduct(data: any): Promise<void> {
    setLoading(true)
    try {
      if (productToEdit.id) {
        console.log('atualizar')
        const response = await api.put('/order/products', {
          commission: data.commission,
          amount: Number(data.amount),
          vincOrderProductId: productToEdit.id,
        })

        setOrder({
          ...order,
          orderProducts: order.orderProducts.map((item: any) =>
            item.id === productToEdit.id ? response.data : item,
          ),
        })
        loadOrderData()
        setModalAddProducts(false)
        addToast({
          type: 'success',
          title: '',
          description: 'Produto atualizado com sucesso',
        })
      } else {
        const response = await api.post('/order/products', {
          ...data,
          amount: Number(data.amount),
          orderId: id,
        })

        setOrder({
          ...order,
          orderProducts: [...order.orderProducts, response.data],
        })
        loadOrderData()
        setModalAddProducts(false)
        addToast({
          type: 'success',
          title: '',
          description: 'Produto adicionado com sucesso',
        })
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Ahhh não!',
        description:
          err.data.message ||
          'Houve um erro ao adicionar o produto no atendimento',
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleCloseOrder(data: any): Promise<void> {
    try {
      setLoading(true)
      await api.put(`/order/finish/${order.id}`, {
        type_payment: data.type_payment,
        totalPayment: convertToFloat(data.totalPayment),
        discount: convertToFloat(data.discount),
        remarks: data.remarks,
      })

      addToast({
        type: 'success',
        title: 'Sucesso!',
        description: 'Comanda fechada.',
      })
      setModalCloseOrder(false)
      // setOrder(response.data);
      loadOrderData()
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Ahh não!',
        description: err.data.message || 'Houve um erro ao fechar a comanda!',
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleCancelOrder(): Promise<void> {
    try {
      setLoading(true)
      await api.put(`/order/cancel/${order.id}`)

      addToast({
        type: 'success',
        title: 'Sucesso!',
        description: 'Comanda cancelada.',
      })

      loadOrderData()
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Ahh não!',
        description: err.data.message || 'Houve um erro ao fechar a comanda!',
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteProductOrder(
    orderProductId: string,
  ): Promise<void> {
    try {
      setLoading(true)
      const response = await api.delete('/order/products', {
        data: {
          orderProductId,
        },
      })

      if (response.data === true) {
        setOrder({
          ...order,
          orderProducts: order.orderProducts.filter(
            (item: any) => item.id !== orderProductId,
          ),
        })
        loadOrderData()
      }
    } catch (err: any) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteServiceOrder(serviceId: string): Promise<void> {
    try {
      setLoading(true)
      const response = await api.delete('/order/services', {
        data: {
          orderId: id,
          serviceId,
        },
      })

      if (response.data === true) {
        // setOrder({
        //   ...order,
        //   orderProducts: order.orderProducts.filter(
        //     (item: any) => item.id !== orderProductId,
        //   ),
        // });
        loadOrderData()
      }
    } catch (err: any) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddService(data: any): Promise<void> {
    try {
      setLoading(true)

      const schema = Yup.object().shape({
        serviceId: Yup.string().required('Campo obrigatório'),
      })

      await schema.validate(data, { abortEarly: false })

      await api.post('/order/services', {
        orderId: id,
        serviceId: data.serviceId,
      })

      setModalAddServices(false)
      loadOrderData()
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)

        formRef.current?.setErrors(errors)

        return
      }
      // eslint-disable-next-line no-console
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmitPayment(data: DataFormPayment): Promise<void> {
    try {
      setLoading(true)
      console.log(data)
      formApplyTypePaymentRef.current?.setErrors({})

      const schema = Yup.object().shape({
        value: Yup.string().required(),
        type_payment_id: Yup.string().nullable().required(),
      })

      await schema.validate(data, { abortEarly: false })

      const response = await api.post('/order/payment', {
        ...data,
        order_id: order.id,
      })

      console.log(response.data)

      setOrder(response.data)
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)

        formApplyTypePaymentRef.current?.setErrors(errors)
      }
    } finally {
      setLoading(false)
    }
  }

  const orderStatus = useMemo(() => {
    if (order.canceled) {
      return 'Cancelada'
    }

    if (order.finished) {
      return 'Finalizada'
    }

    return 'Em andamento'
  }, [order])

  function handleSumTotal(value: string): void {
    const valueDiscount = value.replace('R$', '')
    const totalDiscountDecimal = convertToFloat(valueDiscount)

    setTotalValue(Number(order.total) - totalDiscountDecimal)
    setTotalDiscount(totalDiscountDecimal)
    if (typePayment === 'DINHEIRO') {
      setChangeValue(
        totalPayment - (Number(order.total) - totalDiscountDecimal),
      )
    } else {
      setChangeValue(0)
    }
  }

  function handleSumPayment(value: string): void {
    const valuePayment = value.replace('R$', '')
    const valuePaymentDecimal = convertToFloat(valuePayment)

    setTotalPayment(valuePaymentDecimal)
    setChangeValue(valuePaymentDecimal - (Number(order.total) - totalDiscount))
    setTotalValue(Number(order.total) - totalDiscount)
  }

  useEffect(() => {
    if (typePayment === 'DINHEIRO') {
      formCloseOrderRef.current?.clearField('totalPayment')
    } else {
      formCloseOrderRef.current?.setFieldValue('totalPayment', order.total)
      setChangeValue(0)
      setTotalValue(Number(order.total) - totalDiscount)
    }
  }, [typePayment, formCloseOrderRef])

  console.log(productToEdit)

  // useEffect(()=>{
  //   if(productToEdit.id){
  //     formRef.current?.setFieldValue('productId', )
  //   }
  // },[])

  return (
    <Container>
      <div>
        <Content>
          {/* <Spin isVisible={loading}> */}
          <Modal
            open={modalAddProducts}
            onOpenChange={() => {
              setModalAddProducts(false)
            }}
          >
            <ModalContent title="Adicionar produtos">
              <Form
                ref={formRef}
                onSubmit={handleAddProduct}
                initialData={
                  productToEdit.id
                    ? {
                      ...productToEdit,
                      productId: productToEdit.product_id,
                    }
                    : { commission: true }
                }
              >
                <section>
                  <Select
                    name="productId"
                    label="Produto"
                    placeholder="Selecione o produto"
                    options={products.map((product) => ({
                      value: product.id,
                      label: product.name,
                    }))}
                  />
                </section>
                <section>
                  <TextInput
                    name="amount"
                    label="Quantidade"
                    maxLength={4}
                    placeholder="Digite a quantidade de produtos"
                  />
                </section>
                <section>
                  <Switch name="commission" label="Comissionar" />
                </section>
                <Footer modal>
                  <Button type="submit">Salvar</Button>
                </Footer>
              </Form>
            </ModalContent>
          </Modal>
          <Modal
            open={modalCloseOrder}
            onOpenChange={() => {
              setModalCloseOrder(false)
              setTotalDiscount(0)
              setTotalPayment(0)
            }}
          >
            <ModalContent title="Fechar atendimento" size="md">
              <Form
                ref={formApplyTypePaymentRef}
                onSubmit={handleSubmitPayment}
                initialData={{
                  value: Number(order.total).toLocaleString('PT-BR', {
                    minimumFractionDigits: 2,
                  }),
                }}
                style={{
                  background: 'rgba(212, 214, 224, 0.08)',
                  borderRadius: 4,
                  margin: 16,
                }}
              >
                <Flex gap={8} margin align="end">
                  <MoneyInput name="value" label="Valor" />
                  <Select
                    options={typePayments}
                    name="type_payment_id"
                    label="Tipo de Pagamento"
                    placeholder="Selecione o tipo de pagamento"
                  />
                  <Button>Aplicar</Button>
                </Flex>
              </Form>
              <Flex padding overflow flex>
                <Table
                  actions={[
                    {
                      label: 'Remover',
                      onClick: () => alert('teste'),
                      type: 'danger',
                    },
                  ]}
                  data={order.payments}
                  headers={[
                    { label: 'Tipo', dataIndex: 'typePayment.name' },
                    {
                      label: 'Valor',
                      dataIndex: 'value',
                      render: ({ value, item }: any) => {
                        if (value) {
                          return VMasker.toMoney(String(value), {
                            precision: 2,
                            separator: ',',
                            delimiter: '.',
                            unit: item.typePayment.discount ? '- R$' : 'R$',
                          })
                        }

                        return ''
                      },
                    },
                  ]}
                />
              </Flex>
              <Flex
                justify="between"
                margin
                padding
                style={{
                  background: 'rgba(212, 214, 224, 0.08)',
                  borderRadius: 4,
                }}
              >
                <Flex direction="column">
                  <Text lowContrast>Total</Text>
                  <Heading size="sm">
                    {VMasker.toMoney(String(order.total), {
                      precision: 2,
                      separator: ',',
                      delimiter: '.',
                      unit: 'R$',
                    })}
                  </Heading>
                </Flex>
                <Flex direction="column">
                  <Text lowContrast>Descontos</Text>
                  <Heading size="sm">
                    {VMasker.toMoney(String(order.totalDiscount), {
                      precision: 2,
                      separator: ',',
                      delimiter: '.',
                      unit: 'R$',
                    })}
                  </Heading>
                </Flex>
                <Flex direction="column">
                  <Text lowContrast>Pago</Text>
                  <Heading size="sm">
                    {VMasker.toMoney(String(order.totalPayment), {
                      precision: 2,
                      separator: ',',
                      delimiter: '.',
                      unit: 'R$',
                    })}
                  </Heading>
                </Flex>
                <Flex direction="column">
                  <Text lowContrast>Troco</Text>
                  <Heading size="sm">
                    {VMasker.toMoney(String(order.change), {
                      precision: 2,
                      separator: ',',
                      delimiter: '.',
                      unit: 'R$',
                    })}
                  </Heading>
                </Flex>
              </Flex>
              <Footer>
                <FooterLeft>
                  <Button
                    variant="secondary"
                    colorScheme="gray"
                    type="button"
                  // onClick={() =>
                  //   formApplyTypePaymentRef.current?.submitForm()
                  // }
                  >
                    Cancelar
                  </Button>
                </FooterLeft>
                <Button
                  // variant="secondary"
                  type="button"
                // onClick={() =>
                //   formApplyTypePaymentRef.current?.submitForm()
                // }
                >
                  Finalizar
                </Button>
              </Footer>
              {/* <Form
                  ref={formCloseOrderRef}
                  onSubmit={handleCloseOrder}
                  initialData={{
                    total: order.total,
                    change: '0.00',
                    discount: '0,00',
                    totalForPayment: order.total,
                    type_payment: 'DINHEIRO',
                  }}
                >
                  <section>
                    <Select
                      name="type_payment"
                      label="Tipo de pagamento"
                      placeholder="Selecione o tipo de pagamento"
                      onChange={(value) => {
                        console.log(value)
                        setTypePayment(String(value))
                      }}
                      options={[
                        {
                          value: 'DINHEIRO',
                          label: 'Dinheiro',
                        },
                        {
                          value: 'DEBITO',
                          label: 'Cartão Débito',
                        },
                        {
                          value: 'CREDITO',
                          label: 'Cartão Crédito',
                        },
                        {
                          value: 'PIX',
                          label: 'PIX',
                        },
                      ]}
                    />
                  </section>
                  <section>
                    <InputMask
                      mask="money"
                      name="discount"
                      label="Desconto (R$)"
                      placeholder="Valor de desconto"
                      onChange={(e) => handleSumTotal(e.target.value)}
                    />
                  </section>
                  <section>
                    <InputMask
                      mask="money"
                      name="totalPayment"
                      label="Total Pago"
                      placeholder="Valor pago"
                      disabled={typePayment !== 'DINHEIRO'}
                      onChange={(e) => handleSumPayment(e.target.value)}
                    />
                  </section>
                  <section>
                    <TextAreaInput
                      name="remarks"
                      label="Observações"
                      placeholder="Observações"
                    />
                  </section>
                  s
                  <TotalContainer>
                    <span>
                      <h2>Valor Total:</h2>
                      <h2>
                        {VMasker.toMoney(String(order.total), {
                          precision: 2,
                          separator: ',',
                          delimiter: '.',
                          unit: 'R$',
                        })}
                      </h2>
                    </span>
                    <span>
                      <h2>Valor Desconto:</h2>
                      <h2>
                        {VMasker.toMoney(String(totalDiscount.toFixed(2)), {
                          precision: 2,
                          separator: ',',
                          delimiter: '.',
                          unit: 'R$',
                        })}
                      </h2>
                    </span>
                    <span>
                      <h2>Valor a Pagar:</h2>
                      <h2>
                        {VMasker.toMoney(String(totalValue.toFixed(2)), {
                          precision: 2,
                          separator: ',',
                          delimiter: '.',
                          unit: 'R$',
                        })}
                      </h2>
                    </span>
                    <span>
                      <h2>Troco:</h2>
                      <h2>
                        {VMasker.toMoney(String(changeValue.toFixed(2)), {
                          precision: 2,
                          separator: ',',
                          delimiter: '.',
                          unit: 'R$',
                        })}
                      </h2>
                    </span>
                  </TotalContainer>
                  <Footer modal>
                    <Button type="submit">Salvar</Button>
                  </Footer>
                </Form> */}
            </ModalContent>
          </Modal>
          <Modal
            open={modalAddServices}
            onOpenChange={() => setModalAddServices(false)}
          >
            <ModalContent title="Adicionar serviço" size="lg">
              <Form ref={formAddServiceRef} onSubmit={handleAddService}>
                <section>
                  <Select
                    name="serviceId"
                    label="Serviço"
                    options={services.map((service) => ({
                      value: service.id,
                      label: service.name,
                    }))}
                    placeholder="Selecione o serviço"
                  />
                </section>
                <Footer modal>
                  <Button type="submit">Salvar</Button>
                </Footer>
              </Form>
            </ModalContent>
          </Modal>
          <Header>
            <Title
              style={{
                color: !order.finished && !order.canceled ? 'green' : 'red',
              }}
            >
              # {orderStatus}
            </Title>
          </Header>
          <Header>
            <Title>Serviços</Title>
            <Button
              type="button"
              size="sm"
              onClick={() => setModalAddServices(true)}
            >
              Adicionar serviço
            </Button>
          </Header>
          <Table
            data={order.appointment?.services || []}
            actions={[
              {
                label: 'Excluir',
                type: 'danger',
                onClick: (item) => {
                  swal
                    .fire({
                      title: 'Confirme!',
                      text: 'Deseja realmente remover esse serviço?',
                      icon: 'warning',
                      confirmButtonText: 'Remover',
                      confirmButtonColor: '#dc3545',
                      cancelButtonText: 'Cancelar',
                      showCancelButton: true,
                    })
                    .then((result) => {
                      if (result.isConfirmed) {
                        handleDeleteServiceOrder(String(item.id))
                      }
                    })
                },
              },
            ]}
            headers={[
              { label: 'Nome', dataIndex: 'name' },
              {
                label: 'Duração',
                dataIndex: 'duration',
                render: ({ item }) => {
                  if (item.duration) {
                    return `${item.duration}min`
                  }

                  return ''
                },
              },
              {
                label: 'Valor',
                dataIndex: 'price',
                render: ({ item }) => {
                  if (item.price) {
                    return Number(item.price).toLocaleString('PT-BR', {
                      minimumFractionDigits: 2,
                      style: 'currency',
                      currency: 'BRL',
                    })
                  }

                  return ''
                },
              },
            ]}
          />

          <Header>
            <Title>Produtos</Title>
            <Button
              type="button"
              size="sm"
              onClick={() => setModalAddProducts(true)}
              disabled={order.finished}
            >
              Adicionar Produto
            </Button>
          </Header>

          <Table
            actions={[
              {
                label: 'Editar',
                onClick: (item) => {
                  setModalAddProducts(true)
                  setProductToEdit(item)
                },
              },
              {
                label: 'Excluir',
                type: 'danger',
                onClick: (item) => {
                  swal
                    .fire({
                      title: 'Confirme!',
                      text: 'Deseja realmente remover esse produto?',
                      icon: 'warning',
                      confirmButtonText: 'Remover',
                      confirmButtonColor: '#dc3545',
                      cancelButtonText: 'Cancelar',
                      showCancelButton: true,
                    })
                    .then((result) => {
                      if (result.isConfirmed) {
                        handleDeleteProductOrder(String(item.id))
                      }
                    })
                },
              },
            ]}
            data={order.orderProducts || []}
            headers={[
              {
                label: 'Nome',
                dataIndex: 'product.name',
              },
              {
                label: 'Quantidade',
                dataIndex: 'amount',
              },
              {
                label: 'Valor',
                dataIndex: 'total',
                render: ({ item }) => {
                  if (item.total) {
                    return Number(item.total).toLocaleString('PT-BR', {
                      minimumFractionDigits: 2,
                      style: 'currency',
                      currency: 'BRL',
                    })
                  }
                  return ''
                },
              },
            ]}
          />
          {/* {!order.orderProducts?.length && (
              <Empty padding={50} description="Não há produtos" />
            )} */}

          {/* <Header>
          <Title>Totais</Title>
        </Header>
        <Card>
          <TotalContainer>
            <h2>Forma de pagamento:</h2>
            <h2>Valor Total: 1000</h2>
            <h2>Valor Pago: 1000</h2>
            <h2>Troco: 1000</h2>
          </TotalContainer>
        </Card> */}
          {/* </Spin> */}
        </Content>{' '}
        <PaymentContainer>
          <div># {order.id?.substr(order.id?.length - 8)}</div>
          <div>
            <p>
              Cliente: <strong>{order?.appointment?.user?.username}</strong>
            </p>
            <p>
              Profissional:{' '}
              <strong>{order?.appointment?.provider?.username}</strong>
            </p>
            {order.appointment?.date && (
              <p>
                Data:{' '}
                <strong>
                  {format(new Date(order.appointment?.date), 'dd/MM/yyy HH:mm')}
                </strong>
              </p>
            )}
          </div>
          <Separator />
          <div>
            <span>
              <p>Valor Total:</p>
              {order.total && (
                <p>
                  {Number(order.total).toLocaleString('PT-BR', {
                    minimumFractionDigits: 2,
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
              )}
            </span>
            <span>
              <p>Valor Desconto:</p>
              {order.discount && (
                <p>
                  {Number(order.discount).toLocaleString('PT-BR', {
                    minimumFractionDigits: 2,
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
              )}
            </span>
            <span>
              <p>Valor Pago:</p>
              {order.totalPayment && (
                <p>
                  {Number(order.totalPayment).toLocaleString('PT-BR', {
                    minimumFractionDigits: 2,
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
              )}
            </span>
            <span>
              <p>Troco:</p>
              {order.change && (
                <p>
                  {Number(order.change).toLocaleString('PT-BR', {
                    minimumFractionDigits: 2,
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
              )}
            </span>
            <span>
              <p>Observações:</p>
            </span>
            <span>
              <p>{order.remarks}</p>
            </span>
            <span>
              <Button
                colorScheme="red"
                size="md"
                disabled={order.finished}
                type="button"
                variant="secondary"
                onClick={() => {
                  swal
                    .fire({
                      title: 'Confirme!',
                      text: 'Deseja realmente cancelar esse atendimento?',
                      icon: 'warning',
                      confirmButtonText: 'Confirmar cancelamento',
                      confirmButtonColor: '#dc3545',
                      cancelButtonText: 'Cancelar',
                      showCancelButton: true,
                    })
                    .then((result) => {
                      if (result.isConfirmed) {
                        handleCancelOrder()
                      }
                    })
                }}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={() => setModalCloseOrder(true)}
                size="md"
                variant="secondary"
                disabled={order.finished}
              >
                Fechar
              </Button>
            </span>
          </div>
        </PaymentContainer>
      </div>
    </Container>
  )
}
