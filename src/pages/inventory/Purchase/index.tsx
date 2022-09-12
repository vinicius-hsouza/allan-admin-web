import { Flex, Table, Button, Modal, MaskInput, MoneyInput, Footer, Form, Input, DatePicker, useLoading, toast, Badge, Select } from '@atmoutsourcing/siakit';
import React, { useState, useRef, useEffect } from 'react';
import { FormHandles } from '@unform/core';
import api from '../../../services/api';
import { format } from 'date-fns';
import Search from '../../../components/Search';
import VMasker from 'vanilla-masker';
import convertToFloat from '../../../utils/convertTofloat';

type DataForm = {
  invoiceNumber: string;
  datePurchase: Date;
  localPurchase: string;
}

type DataAddProductForm = {
  product_id: string;
  buy_price: string;
  sale_price: string;
  amount: number;
}

export function Purchase(): JSX.Element {
  const formRef = useRef<FormHandles>(null);
  const formAddProductRef = useRef<FormHandles>(null);
  const formSearchRef = useRef<FormHandles>(null);
  const { setLoading } = useLoading();

  const [modalCreateVisible, setModalCreateVisible] = useState(false);
  const [modalProductsVisible, setModalProductsVisible] = useState(false);
  const [purchases, setPurchases] = useState<any>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [params, setParams] = useState({ page: 1, perPage: 20, search: '' })
  const [purchaseIdToProducts, setPurchaseIdToProducts] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState([]);
  const [productsToPurchase, setProductsToPurchase] = useState<any>([]);

  async function loadPurchases(): Promise<void> {
    try {
      const response = await api.get('/purchase', {
        params,
      });

      if (response.data?.purchases) {
        setPurchases(response.data?.purchases);
      }

      if (response.data?.count) {
        setTotalCount(response.data?.count);
      }

    } catch (error) {
      console.error(error);
    }
  }

  async function loadAllProducts(): Promise<void> {
    try {
      setLoading(true);
      const response = await api.get('/product', {
        params: { start: 0, limit: 1000, search: '' },
      });

      if (response.data) {
        setAllProducts(response.data);
      }
    } catch (err: any) {
      console.log(err.data.message);
    } finally {
      setLoading(false);
    }
  }



  async function handleSubmit(data: DataForm): Promise<void> {
    try {
      setLoading(true);
      const response = await api.post('/purchase', data)
      if (response.data.id) {
        setPurchases((prevState: any) => [...prevState, response.data])
        setTotalCount(prevState => prevState + 1);
        setModalCreateVisible(false);
        toast.success({ title: 'Sucesso', text: 'Nova entrada de produtos cadastrada' });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLaunchPurchase(purchase_id: string): Promise<void> {
    try {
      setLoading(true);
      const response = await api.post(`/purchase/launch/${purchase_id}`);
      if (response.data) {
        loadPurchases();
      }
      toast.success({ title: 'Sucesso', text: 'Produtos lançados e atualizados com sucesso' });
    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  }

  async function handleAddProduct(data: DataAddProductForm): Promise<void> {
    try {
      setLoading(true);

      const response = await api.post('/purchase/product', {
        ...data, purchase_id: purchaseIdToProducts,
        sale_price: convertToFloat(data.sale_price),
        buy_price: convertToFloat(data.buy_price),
      });

      setProductsToPurchase((prevState: any) => [...prevState, response.data])
      setModalProductsVisible(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProduct(purchaseProductId: string): Promise<void> {
    try {
      setLoading(true);

      const response = await api.delete(`/purchase/product/${purchaseProductId}`);

      if (response.data.success) {
        setProductsToPurchase((prevState: any) => prevState.filter((item: any) => item.id !== purchaseProductId))
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPurchases();
  }, [params])

  useEffect(() => {
    loadAllProducts();
  }, [])

  return (
    <>
      <Modal
        isOpen={modalCreateVisible}
        title='Nova entrada'
        onRequestClose={() => setModalCreateVisible(false)}
        size="xs"
      >
        <Form ref={formRef} onSubmit={handleSubmit} padding direction='column' gap={8}>
          <Input
            name="invoiceNumber"
            label="Nota Fiscal"
            placeholder="Nota Fiscal"
          />
          <DatePicker
            name="datePurchase"
            label="Data da compra"
            placeholder="Data da compra"
          />
          <Input
            name="localPurchase"
            label="Loca de compra"
            placeholder="Loca de compra"
          />
        </Form>
        <Footer>
          <Button type='button' onClick={() => formRef.current?.submitForm()}>Cadastrar</Button>
        </Footer>
      </Modal>

      <Modal
        isOpen={!!purchaseIdToProducts}
        title='Produtos'
        onRequestClose={() => setPurchaseIdToProducts(null)}
        size="md"
      >
        <Flex padding direction='column' gap>
          <Flex>
            <Button type='button' onClick={() => setModalProductsVisible(true)}>Adicionar produto</Button>
          </Flex>
          <Table
            data={productsToPurchase}
            actions={[{
              label: 'Excluir',
              onClick: (item) => handleDeleteProduct(String(item.id)),
              type: 'danger'
            }]}
            headers={[
              { label: 'Nome', dataIndex: 'product.name' },
              { label: 'Quantidade', dataIndex: 'amount' },

              {
                label: 'Preço de compra',
                dataIndex: 'buy_price',
                render: ({ value }) => {
                  return (
                    value &&
                    VMasker.toMoney(String(value), {
                      precision: 2,
                      separator: ',',
                      delimiter: '.',
                      unit: 'R$',
                    })
                  );
                },
              },
              {
                label: 'Preço de venda',
                dataIndex: 'sale_price',
                render: ({ value }) => {
                  return (
                    value &&
                    VMasker.toMoney(String(value), {
                      precision: 2,
                      separator: ',',
                      delimiter: '.',
                      unit: 'R$',
                    })
                  );
                },
              }
            ]}
          />
        </Flex>
        <Footer>
          <Button type='button' colorScheme='gray' onClick={() => setPurchaseIdToProducts(null)} >Cancelar</Button>
        </Footer>
      </Modal>

      <Modal title='Adicionar Produto' onRequestClose={() => setModalProductsVisible(false)} isOpen={modalProductsVisible} size="sm">
        <Form ref={formAddProductRef} onSubmit={handleAddProduct} gap={8} direction="column" padding>
          <Select
            options={allProducts.map((item: any) => ({ value: item.id, label: item.name }))}
            name="product_id"
            label='Produto'
            placeholder='Selecione o produto'
            onChange={value => {
              if (value) {
                const product: any = allProducts.find((item: any) => item.id === value);

                console.log(product);

                if (product) {
                  formAddProductRef.current?.setFieldValue('buy_price', product.buy_price);
                  formAddProductRef.current?.setFieldValue('sale_price', product.sale_price);
                }
              }
            }}
          />

          <Input
            name="amount"
            placeholder="Quantidade"
            label="Quantidade"
          />

          <MoneyInput
            name="buy_price"
            placeholder="Preço de compra"
            label="Preço de compra"
          />

          <MoneyInput
            name="sale_price"
            placeholder="Preço de venda"
            label="Preço de venda"
          />

        </Form>
        <Footer>
          <Button type='button' onClick={() => formAddProductRef.current?.submitForm()}>Adicionar</Button>
        </Footer>
      </Modal>
      <Flex flex padding gap={16} direction="column">
        <Flex justify='space-between'>
          <Button type="button" onClick={() => setModalCreateVisible(true)}>Nova entrada</Button>
          <Search onSearch={search => setParams(prevState => ({ ...prevState, search }))} />
        </Flex>
        <Table
          data={purchases}
          perPage={params.perPage}
          onPageChange={page => setParams(prevState => ({ ...prevState, page }))}
          perPageChange={amount => setParams(prevState => ({ ...prevState, perPage: amount }))}
          currentPage={params.page}
          totalCount={totalCount}
          actions={[{
            label: 'Lançar compra',
            onClick: (item) => handleLaunchPurchase(String(item.id)),
          }, {
            label: 'Produtos',
            onClick: (item: any) => {
              setProductsToPurchase(item.purchaseProducts);
              setPurchaseIdToProducts(String(item.id));
            },
          }]}
          headers={[
            { label: 'Nota Fiscal', dataIndex: 'invoiceNumber' },
            {
              label: 'Data de compra', dataIndex: 'datePurchase', render: ({ value }) => {
                if (value) {
                  return format(new Date(value as string), 'dd/MM/yyyy')
                }

                return ''
              }
            },
            { label: 'Local de compra', dataIndex: 'localPurchase' },
            {
              label: 'Status', dataIndex: 'finished', render: ({ value }) =>
                <Badge color={value ? 'green' : 'yellow'}>{value ? 'Lançada' : 'Pendente'}</Badge>
            },
          ]}
        />
      </Flex>
    </>
  )
}