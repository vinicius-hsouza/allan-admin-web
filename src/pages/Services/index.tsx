import React, { useCallback, useEffect, useState, useRef } from 'react';
import VMasker from 'vanilla-masker';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { FiBox, FiClock, FiDollarSign, FiPercent } from 'react-icons/fi';
import List from '../../components/List';
import Button from '../../components/Button';
import { Modal } from '@atmoutsourcing/siakit';
import { Form, Footer } from '../../components/Form';
import Input from '../../components/Input';
import { Spin } from '../../components/Spin';
import { useToast } from '../../hooks/toast';

import api from '../../services/api';

// DTOS
import ServicesDTO from '../../dtos/ServicesDTO';
import getValidationErrors from '../../utils/getValidationErrors';
import InputMask from '../../components/InputMask';
import Switch from '../../components/Switch';
import convertToFloat from '../../utils/convertTofloat';

import { Container } from './styles';
import { useLoading } from '../../hooks/loading';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

const Services: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const [services, setServices] = useState<ServicesDTO[]>([]);
  const { setLoading } = useLoading();
  const [modal, setModal] = useState(false);
  const [serviceToUpdate, setServiceToUpdate] = useState<Service>(
    {} as Service,
  );

  const listServices = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get('services');

      setServices(response.data);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    listServices();
  }, []);

  const handleSubmit = useCallback(
    async (data: any) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Campo obrigatório'),
          price: Yup.string().required('Campo obrigatório'),
          duration: Yup.string().required('Campo obrigatório'),
          commission: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, { abortEarly: false });

        if (serviceToUpdate.id) {
          const response = await api.put(`/services/${serviceToUpdate.id}`, {
            ...data,
            price: convertToFloat(data.price),
            commission: Number(data.commission),
          });
          addToast({
            type: 'success',
            title: '',
            description: ' Serviço atualizado com sucesso!',
          });
          setServices(
            services.map(service =>
              service.id === serviceToUpdate.id ? response.data : service,
            ),
          );
          setModal(false);
          setServiceToUpdate({} as Service);
        } else {
          const response = await api.post('/services', {
            ...data,
            price: convertToFloat(data.price),
            commission: Number(data.commission),
          });
          addToast({
            type: 'success',
            title: '',
            description: ' Serviço criado com sucesso!',
          });
          setServices([...services, response.data]);
          setModal(false);
          setServiceToUpdate({} as Service);
        }
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
        }
      } finally {
        setLoading(false);
      }
    },
    [serviceToUpdate],
  );

  async function handleInactivateService(id: string): Promise<void> {
    setLoading(true);

    try {
      await api.delete(`/services/inactivate/${id}`);
      addToast({
        type: 'success',
        title: '',
        description: ' Serviço removido com sucesso!',
      });
      setServices(state => state.filter(item => item.id !== id));
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Modal
        title={serviceToUpdate.id ? 'Editar serviço' : 'Novo serviço'}
        onRequestClose={() => {
          setServiceToUpdate({} as Service);
          setModal(false);
        }}
        isOpen={modal}
        size="md"
      >
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          autoComplete="off"
          initialData={serviceToUpdate}
        >
          <section>
            <Input
              name="name"
              placeholder="Nome do serviço (Obrigatório)"
              label="Nome do serviço"
              icon={FiBox}
            />
          </section>
          <section>
            <Input
              name="description"
              placeholder="Descrição do serviço"
              label="Descrição do serviço"
              icon={FiBox}
            />
          </section>
          <section>
            <InputMask
              mask="money"
              name="price"
              placeholder="Valor do serviço (Obrigatório)"
              label="Valor do serviço"
              icon={FiDollarSign}
            />
          </section>
          <section>
            <InputMask
              mask="code"
              name="duration"
              placeholder="Duração do serviço em min (Obrigatório)"
              label="Duração do serviço"
              icon={FiClock}
            />
          </section>
          <section>
            {/* <InputMask
              mask="percent"
              name="commission"
              placeholder="porcentagem de comissão do serviço ao profissional"
              label="Comissão"
              icon={FiPercent}
            /> */}
            <Input
              name="commission"
              maxLength={3}
              placeholder="porcentagem de comissão do serviço ao profissional"
              label="Comissão"
              icon={FiPercent}
            />
          </section>
          <section>
            <Switch name="isCombo" label="Combo?" orientation="vertical" />
          </section>

          <Footer modal>
            <Button type="submit">
              {serviceToUpdate.id ? 'Salvar' : 'Cadastrar'}
            </Button>
          </Footer>
        </Form>
      </Modal>
      <header>
        <Button onClick={() => setModal(true)}>Novo Serviço</Button>
      </header>
      <List
        data={services}
        onClick={(row: any) => {
          setModal(true);
          setServiceToUpdate({
            ...row,
            price: row?.price.toLocaleString('PT-BR', {
              minimumFractionDigits: 2,
            }),
          });
        }}
        options={[
          { title: 'Nome', dataIndex: 'name' },
          {
            title: 'Preço',
            dataIndex: 'price',
            render: row => {
              return (
                row?.price &&
                VMasker.toMoney(row?.price, {
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$',
                })
              );
            },
          },
          {
            title: 'Combo?',
            dataIndex: 'isCombo',
            render: row => (row.isCombo ? 'Sim' : 'Não'),
          },
          {
            title: 'Comissão',
            dataIndex: 'commission',
            render: row => {
              if (row?.commission) {
                return `${row?.commission}%`;
              }

              return '';
            },
          },
          {
            title: 'Ação',
            dataIndex: 'age',
            render: row => (
              <Button
                size="small"
                color="danger"
                onClick={e => {
                  e.stopPropagation();

                  handleInactivateService(row.id);
                }}
              >
                Inativar
              </Button>
            ),
          },
        ]}
      />
    </Container>
  );
};

export default Services;
