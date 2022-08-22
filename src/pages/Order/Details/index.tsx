/* eslint-disable no-console */
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { FormHandles } from '@unform/core';
import swal from 'sweetalert2';
import * as Yup from 'yup';
import VMasker from 'vanilla-masker';
import api from '../../../services/api';

import Button from '../../../components/Button';
import { Modal } from '@atmoutsourcing/siakit';
import { Form, Footer } from '../../../components/Form';
import Select from '../../../components/Select';
import Input from '../../../components/Input';
import Switch from '../../../components/Switch';
import { useToast } from '../../../hooks/toast';

import ProductDTO from '../../../dtos/ProductDTO';

import {
  Container,
  Content,
  Title,
  Header,
  PaymentContainer,
  TotalContainer,
} from './styles';
import { Spin } from '../../../components/Spin';
import List from '../../../components/List';
import InputMask from '../../../components/InputMask';
import convertToFloat from '../../../utils/convertTofloat';
import getValidationErrors from '../../../utils/getValidationErrors';

interface ParamsProps {
  id: string;
}

interface IService {
  name: string;
  id: string;
}

export default function OrderDetails(): JSX.Element {
  const formRef = useRef<FormHandles>(null);
  const formCloseOrderRef = useRef<FormHandles>(null);
  const formAddServiceRef = useRef<FormHandles>(null);
  const { id } = useParams();
  const { addToast } = useToast();

  const [order, setOrder] = useState<any>({});
  const [modalAddProducts, setModalAddProducts] = useState(false);
  const [modalAddServices, setModalAddServices] = useState(false);
  const [modalCloseOrder, setModalCloseOrder] = useState(false);

  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [productToEdit, setProductToEdit] = useState<ProductDTO>(
    {} as ProductDTO,
  );
  const [loading, setLoading] = useState(false);
  const [totalPayment, setTotalPayment] = useState(0);
  const [typePayment, setTypePayment] = useState('dinheiro');
  const [services, setServices] = useState<IService[]>([]);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [changeValue, setChangeValue] = useState(0);

  const listProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/product', {
        params: { start: 0, limit: 1000, search: '' },
      });
      setProducts(response.data);
    } catch (err: any) {
      console.log(err.data.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (modalAddProducts) {
      listProducts();
    }
  }, [modalAddProducts]);

  async function loadOrderData(): Promise<void> {
    setLoading(true);
    try {
      const response = await api.get(`/order/${id}`);
      setOrder(response.data);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadServices(): Promise<void> {
    try {
      setLoading(true);
      const response = await api.get('/services');
      if (response.data) {
        setServices(response.data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      loadOrderData();
    }
  }, [id]);

  useEffect(() => {
    loadServices();
  }, []);

  async function handleAddProduct(data: any): Promise<void> {
    setLoading(true);
    try {
      if (productToEdit.id) {
        console.log('atualizar');
        const response = await api.put('/order/products', {
          commission: data.commission,
          amount: Number(data.amount),
          vincOrderProductId: productToEdit.id,
        });

        setOrder({
          ...order,
          orderProducts: order.orderProducts.map((item: any) =>
            item.id === productToEdit.id ? response.data : item,
          ),
        });
        loadOrderData();
        setModalAddProducts(false);
        addToast({
          type: 'success',
          title: '',
          description: 'Produto atualizado com sucesso',
        });
      } else {
        const response = await api.post('/order/products', {
          ...data,
          amount: Number(data.amount),
          orderId: id,
        });

        setOrder({
          ...order,
          orderProducts: [...order.orderProducts, response.data],
        });
        loadOrderData();
        setModalAddProducts(false);
        addToast({
          type: 'success',
          title: '',
          description: 'Produto adicionado com sucesso',
        });
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Ahhh não!',
        description:
          err.data.message ||
          'Houve um erro ao adicionar o produto no atendimento',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleCloseOrder(data: any): Promise<void> {
    try {
      setLoading(true);
      await api.put(`/order/finish/${order.id}`, {
        type_payment: data.type_payment,
        totalPayment: convertToFloat(data.totalPayment),
        discount: convertToFloat(data.discount),
        remarks: data.remarks,
      });

      addToast({
        type: 'success',
        title: 'Sucesso!',
        description: 'Comanda fechada.',
      });
      setModalCloseOrder(false);
      // setOrder(response.data);
      loadOrderData();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Ahh não!',
        description: err.data.message || 'Houve um erro ao fechar a comanda!',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelOrder(): Promise<void> {
    try {
      setLoading(true);
      await api.put(`/order/cancel/${order.id}`);

      addToast({
        type: 'success',
        title: 'Sucesso!',
        description: 'Comanda cancelada.',
      });

      loadOrderData();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Ahh não!',
        description: err.data.message || 'Houve um erro ao fechar a comanda!',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProductOrder(
    orderProductId: string,
  ): Promise<void> {
    try {
      setLoading(true);
      const response = await api.delete('/order/products', {
        data: {
          orderProductId,
        },
      });

      if (response.data === true) {
        setOrder({
          ...order,
          orderProducts: order.orderProducts.filter(
            (item: any) => item.id !== orderProductId,
          ),
        });
        loadOrderData();
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteServiceOrder(serviceId: string): Promise<void> {
    try {
      setLoading(true);
      const response = await api.delete('/order/services', {
        data: {
          orderId: id,
          serviceId,
        },
      });

      if (response.data === true) {
        // setOrder({
        //   ...order,
        //   orderProducts: order.orderProducts.filter(
        //     (item: any) => item.id !== orderProductId,
        //   ),
        // });
        loadOrderData();
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddService(data: any): Promise<void> {
    try {
      setLoading(true);

      const schema = Yup.object().shape({
        serviceId: Yup.string().required('Campo obrigatório'),
      });

      await schema.validate(data, { abortEarly: false });

      await api.post('/order/services', {
        orderId: id,
        serviceId: data.serviceId,
      });

      setModalAddServices(false);
      loadOrderData();
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }
      // eslint-disable-next-line no-console
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const orderStatus = useMemo(() => {
    if (order.canceled) {
      return 'Cancelada';
    }

    if (order.finished) {
      return 'Finalizada';
    }

    return 'Em andamento';
  }, [order]);

  function handleSumTotal(value: string): void {
    const valueDiscount = value.replace('R$', '');
    const totalDiscountDecimal = convertToFloat(valueDiscount);

    setTotalValue(Number(order.total) - totalDiscountDecimal);
    setTotalDiscount(totalDiscountDecimal);
    if (typePayment === 'DINHEIRO') {
      setChangeValue(
        totalPayment - (Number(order.total) - totalDiscountDecimal),
      );
    } else {
      setChangeValue(0);
    }
  }

  function handleSumPayment(value: string): void {
    const valuePayment = value.replace('R$', '');
    const valuePaymentDecimal = convertToFloat(valuePayment);

    setTotalPayment(valuePaymentDecimal);
    setChangeValue(valuePaymentDecimal - (Number(order.total) - totalDiscount));
    setTotalValue(Number(order.total) - totalDiscount);
  }

  useEffect(() => {
    if (typePayment === 'DINHEIRO') {
      formCloseOrderRef.current?.clearField('totalPayment');
    } else {
      formCloseOrderRef.current?.setFieldValue('totalPayment', order.total);
      setChangeValue(0);
      setTotalValue(Number(order.total));
    }
  }, [typePayment, formCloseOrderRef]);

  return (
    <Container>
      <div>
        <Content>
          <Spin isVisible={loading}>
            <Modal
              title="Adicionar produtos"
              isOpen={modalAddProducts}
              onRequestClose={() => {
                setModalAddProducts(false);
              }}
            >
              <Form
                ref={formRef}
                onSubmit={handleAddProduct}
                initialData={
                  productToEdit.id
                    ? { ...productToEdit, productId: productToEdit.id }
                    : { commission: true }
                }
              >
                <section>
                  <Select
                    name="productId"
                    label="Produto"
                    placeholder="Selecione o produto"
                    options={products.map(product => ({
                      value: product.id,
                      label: product.name,
                    }))}
                  />
                </section>
                <section>
                  <Input
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
            </Modal>
            <Modal
              title="Fechar atendimento"
              isOpen={modalCloseOrder}
              onRequestClose={() => {
                setModalCloseOrder(false);
                setTotalDiscount(0);
                setTotalPayment(0);
              }}
            >
              <Form
                ref={formCloseOrderRef}
                onSubmit={handleCloseOrder}
                initialData={{
                  total: order.total,
                  change: '0.00',
                  discount: '0.00',
                  totalForPayment: order.total,
                  type_payment: 'DINHEIRO',
                }}
              >
                <section>
                  <Select
                    name="type_payment"
                    label="Tipo de pagamento"
                    placeholder="Selecione o tipo de pagamento"
                    onChange={e => setTypePayment(e.target.value)}
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
                    onChange={e => handleSumTotal(e.target.value)}
                  />
                </section>

                <section>
                  <InputMask
                    mask="money"
                    name="totalPayment"
                    label="Total Pago"
                    placeholder="Valor pago"
                    disabled={typePayment !== 'DINHEIRO'}
                    onChange={e => handleSumPayment(e.target.value)}
                  />
                </section>

                <section>
                  <Input name="remarks" label="Observações" placeholder="" />
                </section>

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
              </Form>
            </Modal>
            <Modal
              title="Adicionar serviço"
              isOpen={modalAddServices}
              onRequestClose={() => setModalAddServices(false)}
            >
              <Form ref={formAddServiceRef} onSubmit={handleAddService}>
                <section>
                  <Select
                    name="serviceId"
                    label="Serviço"
                    options={services.map(service => ({
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
              <Button size="small" onClick={() => setModalAddServices(true)}>
                Adicionar serviço
              </Button>
            </Header>
            <List
              data={order.appointment?.services || []}
              options={[
                { title: 'Nome', dataIndex: 'name' },
                {
                  title: 'Duração',
                  dataIndex: 'duration',
                  render: (row: any) => {
                    if (row.duration) {
                      return `${row.duration}min`;
                    }

                    return '';
                  },
                },
                {
                  title: 'Valor',
                  dataIndex: 'price',
                  render: (row: any) => {
                    if (row.price) {
                      return Number(row.price).toLocaleString('PT-BR', {
                        minimumFractionDigits: 2,
                        style: 'currency',
                        currency: 'BRL',
                      });
                    }

                    return '';
                  },
                },
                {
                  title: 'Ação',
                  dataIndex: 'action',
                  render: row => (
                    <Button
                      size="small"
                      color="danger"
                      disabled={order.finished}
                      onClick={e => {
                        // handleCloseOrder(row.id);
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
                          .then(result => {
                            if (result.isConfirmed) {
                              handleDeleteServiceOrder(row.id);
                            }
                          });
                        e.stopPropagation();
                      }}
                    >
                      Remover
                    </Button>
                  ),
                },
              ]}
            />

            <Header>
              <Title>Produtos</Title>
              <Button
                size="small"
                onClick={() => setModalAddProducts(true)}
                disabled={order.finished}
              >
                Adicionar Produto
              </Button>
            </Header>

            <List
              onClick={(row: any) => {
                setModalAddProducts(true);
                setProductToEdit(row);
              }}
              data={order.orderProducts || []}
              options={[
                {
                  title: 'Nome',
                  dataIndex: 'product.name',
                },
                {
                  title: 'Quantidade',
                  dataIndex: 'amount',
                },
                {
                  title: 'Valor',
                  dataIndex: 'total',
                  render: row => {
                    if (row.total) {
                      return Number(row.total).toLocaleString('PT-BR', {
                        minimumFractionDigits: 2,
                        style: 'currency',
                        currency: 'BRL',
                      });
                    }
                    return '';
                  },
                },
                {
                  title: 'Ação',
                  dataIndex: 'action',
                  render: row => (
                    <Button
                      size="small"
                      color="danger"
                      disabled={order.finished}
                      onClick={e => {
                        // handleCloseOrder(row.id);
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
                          .then(result => {
                            if (result.isConfirmed) {
                              handleDeleteProductOrder(row.id);
                            }
                          });
                        e.stopPropagation();
                      }}
                    >
                      Remover
                    </Button>
                  ),
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
          </Spin>
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
                color="danger"
                size="small"
                disabled={order.finished}
                onClick={e => {
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
                    .then(result => {
                      if (result.isConfirmed) {
                        handleCancelOrder();
                      }
                    });
                  e.stopPropagation();
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => setModalCloseOrder(true)}
                size="small"
                disabled={order.finished}
              >
                Fechar
              </Button>
            </span>
          </div>
        </PaymentContainer>
      </div>
    </Container>
  );
}
