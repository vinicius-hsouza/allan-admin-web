import { useCallback, useEffect, useState, useRef } from 'react'
import { FiBox, FiDollarSign, FiPackage, FiPercent } from 'react-icons/fi'

import VMasker from 'vanilla-masker'
import * as Yup from 'yup'

import { Modal, ModalContent } from '@siakit/modal'
import { FormHandles } from '@unform/core'

import Button from '../../components/Button'
import { Form, Footer } from '../../components/Form'
import Input from '../../components/Input'
import InputMask from '../../components/InputMask'
import List from '../../components/List'
import { Spin } from '../../components/Spin'
import ProductDTO from '../../dtos/ProductDTO'
import { useLoading } from '../../hooks/loading'
import api from '../../services/api'
// import Modal from '../../components/Modal';
// import { useToast } from '../../hooks/toast';

import convertToFloat from '../../utils/convertTofloat'
import getValidationErrors from '../../utils/getValidationErrors'
import { Container } from './styles'

export default function Products(): JSX.Element {
  const formRef = useRef<FormHandles>(null)
  // const { addToast } = useToast();
  const { setLoading } = useLoading()

  const [products, setProducts] = useState<ProductDTO[]>([])
  const [modal, setModal] = useState(false)
  const [productToEdit, setProductToEdit] = useState<ProductDTO>(
    {} as ProductDTO,
  )

  const listProducts = useCallback(async () => {
    setLoading(true)

    try {
      const response = await api.get('/product', {
        params: { start: 0, limit: 100, search: '' },
      })
      setProducts(response.data)
    } catch (err: any) {
      console.log(err.data.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    listProducts()
  }, [])

  const handleSubmit = useCallback(
    async (data: any) => {
      setLoading(true)

      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required('Campo obrigatório'),
          amount: Yup.string().required('Campo obrigatório'),
          sale_price: Yup.string().required('Campo obrigatório'),
          buy_price: Yup.string().required('Campo obrigatório'),
          commission: Yup.string().required('Campo obrigatório'),
        })

        await schema.validate(data, { abortEarly: false })

        if (productToEdit.id) {
          const response = await api.put(`product/${productToEdit.id}`, {
            ...data,
            sale_price: convertToFloat(data.sale_price),
            buy_price: convertToFloat(data.buy_price),
            commission: Number(data.commission),
          })
          // addToast({
          //   type: 'success',
          //   title: '',
          //   description: 'Produto atualizado com sucesso!',
          // });
          setProducts(
            products.map((product) =>
              product.id === productToEdit.id ? response.data : product,
            ),
          )

          setModal(false)
          setProductToEdit({} as ProductDTO)
        } else {
          const response = await api.post('product', {
            ...data,
            sale_price: convertToFloat(data.sale_price),
            buy_price: convertToFloat(data.buy_price),
            commission: Number(data.commission),
          })
          // addToast({
          //   type: 'success',
          //   title: '',
          //   description: 'Produto criado com sucesso!',
          // });
          setProducts([
            ...products,
            {
              ...response.data,
              buy_price: response.data.buy_price.toLocaleString('PT-BR', {
                minimumFractionDigits: 2,
              }),
            },
          ])
          setModal(false)
        }
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)
        }
      } finally {
        setLoading(false)
      }
    },
    [productToEdit],
  )

  async function handleInactivateService(id: string): Promise<void> {
    setLoading(true)

    try {
      await api.delete(`/product/inactivate/${id}`)
      // addToast({
      //   type: 'success',
      //   title: '',
      //   description: 'Produto removido com sucesso!',
      // });
      setProducts((state) => state.filter((item) => item.id !== id))
    } catch (err: any) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Modal
        onOpenChange={() => {
          setModal(false)
          setProductToEdit({} as ProductDTO)
        }}
        open={modal}
      >
        <ModalContent
          title={productToEdit?.id ? 'Editar produto' : 'Novo produto'}
        >
          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            initialData={productToEdit || {}}
            autoComplete="off"
          >
            <section>
              <Input
                name="name"
                placeholder="Nome do produto"
                label="Nome do produto"
                icon={FiBox}
              />
            </section>
            <section>
              <Input
                name="amount"
                placeholder="Quantidade"
                label="Quantidade"
                icon={FiPackage}
              />
            </section>
            <section>
              <InputMask
                mask="money"
                name="sale_price"
                placeholder="Preço de venda"
                label="Preço de venda"
                icon={FiDollarSign}
              />
            </section>
            <section>
              <InputMask
                mask="money"
                name="buy_price"
                placeholder="Preço de compra"
                label="Preço de compra"
                icon={FiDollarSign}
              />
            </section>
            <section>
              <Input
                name="commission"
                maxLength={3}
                placeholder="porcentagem de comissão do serviço ao profissional"
                label="Comissão"
                icon={FiPercent}
              />
            </section>

            <Footer modal>
              <Button type="submit">
                {productToEdit?.id ? 'Salvar' : 'Cadastrar'}
              </Button>
            </Footer>
          </Form>
        </ModalContent>
      </Modal>
      <header>
        <Button onClick={() => setModal(true)}>Novo Produto</Button>
      </header>
      {/* <Table data={[]} headers={[]} /> */}
      <List
        onClick={(row: any) => {
          setModal(true)
          setProductToEdit({
            ...row,
            sale_price: row?.sale_price.toLocaleString('PT-BR', {
              minimumFractionDigits: 2,
            }),
            buy_price: row?.buy_price.toLocaleString('PT-BR', {
              minimumFractionDigits: 2,
            }),
          })
        }}
        data={products}
        options={[
          { title: 'Nome', dataIndex: 'name' },
          { title: 'Quantidade', dataIndex: 'amount' },

          {
            title: 'Preço de compra',
            dataIndex: 'buy_price',
            render: (row) => {
              return (
                row?.buy_price &&
                VMasker.toMoney(String(row?.buy_price), {
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$',
                })
              )
            },
          },
          {
            title: 'Preço de venda',
            dataIndex: 'sale_price',
            render: (row) => {
              return (
                row?.sale_price &&
                VMasker.toMoney(String(row?.sale_price), {
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$',
                })
              )
            },
          },
          {
            title: 'Comissão',
            dataIndex: 'commission',
            render: (row) => {
              return `${row?.commission}%`
            },
          },
          {
            title: 'Ação',
            dataIndex: 'action',
            render: (row) => (
              <Button
                size="small"
                color="danger"
                onClick={(e) => {
                  e.stopPropagation()

                  handleInactivateService(row.id)
                }}
              >
                Inativar
              </Button>
            ),
          },
        ]}
      />
    </Container>
  )
}
