import { FormHandles } from '@unform/core';
import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import Button from '../../components/Button';
import { Footer, Form } from '../../components/Form';
import InputMask from '../../components/InputMask';
import List from '../../components/List';
import { Modal } from '@atmoutsourcing/siakit';
import Switch from '../../components/Switch';
import { useLoading } from '../../hooks/loading';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { Container, OperationWork } from './styles';

export default function ConfigBarberHour(): JSX.Element {
  const formRef = useRef<FormHandles>(null);
  const { setLoading } = useLoading();
  const { addToast } = useToast();
  const [hoursBarber, setHoursBarber] = useState([]);
  const [hoursBarberEdit, setHoursBarberEdit] = useState<any>({});

  async function loadHourBarber(): Promise<void> {
    try {
      setLoading(true);
      const response = await api.get('/hourbarber');

      setHoursBarber(response.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleModifyBarberHour(data: any): Promise<void> {
    try {
      setLoading(true);
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        startTimeWork: Yup.string().required('Campo obrigatório'),
        endTimeWork: Yup.string().required('Campo obrigatório'),
        isOpenWork: Yup.string().required('Campo obrigatório'),
      });

      await schema.validate(data, { abortEarly: false });

      const response = await api.put(`/hourbarber/${hoursBarberEdit.id}`, data);

      if (response.data?.id) {
        setHoursBarber((prevState: any) =>
          prevState.map((item: any) =>
            item.id === hoursBarberEdit.id ? response.data : item,
          ),
        );

        addToast({
          title: 'Horário atualizado com sucesso',
          type: 'success',
        });

        setHoursBarberEdit({});
      }
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
      }

      addToast({
        title:
          err?.data?.message || 'Houve um erro ao tentar atualizar o horário',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHourBarber();
  }, []);

  return (
    <Container>
      <Modal
        title="Editar hora de trabalho"
        isOpen={hoursBarberEdit.id}
        onRequestClose={() => {
          setHoursBarberEdit({});
        }}
      >
        <Form
          ref={formRef}
          onSubmit={handleModifyBarberHour}
          initialData={hoursBarberEdit}
        >
          <section>
            <InputMask
              mask="hour"
              name="startTimeWork"
              label="Inicio de trabalho"
              placeholder="Inicio de trabalho"
            />
          </section>
          <section>
            <InputMask
              mask="hour"
              name="endTimeWork"
              label="Fim de trabalho"
              placeholder="Fim de trabalho"
            />
          </section>
          <section>
            <Switch name="isOpenWork" label="Faz atendimento?" />
          </section>
          <Footer modal>
            <Button type="submit">Salvar</Button>
          </Footer>
        </Form>
      </Modal>
      <List
        data={hoursBarber}
        options={[
          { title: 'Dia da Semana', dataIndex: 'dayLabel' },
          {
            title: 'Inicio de trabalho',
            dataIndex: 'startTimeWork',
          },
          { title: 'Fim de trabalho', dataIndex: 'endTimeWork' },
          {
            title: 'Faz atendimento?',
            dataIndex: 'isOpenWork',
            render: row => (
              <OperationWork open={!row.isOpenWork}>
                <div />
                <p>
                  {row.isOpenWork ? 'Barbearia aberta' : 'Barbearia fechada'}
                </p>
              </OperationWork>
            ),
          },
          {
            title: 'Ação',
            dataIndex: '',
            render: row => (
              <>
                <Button
                  size="small"
                  onClick={() => {
                    setHoursBarberEdit(row);
                  }}
                >
                  Editar
                </Button>
              </>
            ),
          },
        ]}
      />
    </Container>
  );
}
