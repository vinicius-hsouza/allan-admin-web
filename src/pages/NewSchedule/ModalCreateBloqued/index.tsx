import { FormHandles } from '@unform/core';
import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import ptBR from 'date-fns/locale/pt-BR';
import { DayPicker } from 'react-day-picker';
import Button from '../../../components/Button';
import { Footer, Form } from '../../../components/Form';
import Input from '../../../components/Input';
import InputMask from '../../../components/InputMask';
import { Modal } from '@atmoutsourcing/siakit';
import { useLoading } from '../../../hooks/loading';
import { useToast } from '../../../hooks/toast';
import api from '../../../services/api';
import getValidationErrors from '../../../utils/getValidationErrors';
import {
  Calendar,
  ContainerItemSelect,
  ModalBlockHourContainer,
  ProviderItem,
} from '../ModalCreateAppointment/styles';

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreated: (data: any) => void;
}

export default function ModalCreateBloqued({
  visible,
  onClose,
  onCreated,
}: Props): JSX.Element {
  const formBlockHourRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const { setLoading } = useLoading();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [providerSelectedId, setProviderSelectedId] = useState<string | null>(
    null,
  );
  const [providers, setProviders] = useState<any>([]);

  async function loadProviders(): Promise<void> {
    try {
      setLoading(true);
      const response = await api.get('/provider');
      if (response.data) {
        const array = response.data.map((item: any) => ({
          id: item.id,
          name: item.username,
          color: '#fff',
          avatar_url: item.avatar_url,
        }));
        setProviders(array);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function validateFieldsToBlockHour(data: any): boolean {
    if (!providerSelectedId) {
      addToast({
        type: 'error',
        title: 'Aah não!',
        description:
          'É necessário selecionar o prestador para efetuar o bloqueio',
      });
      return false;
    }

    if (!selectedDate) {
      addToast({
        type: 'error',
        title: 'Aah não!',
        description: 'É necessário selecionar a data para efetuar o bloqueio',
      });
      return false;
    }

    if (!data.startHour && !data.endHour) {
      addToast({
        type: 'error',
        title: 'Aah não!',
        description:
          'É necessário informar a hora de inicio e de fim do bloqueio',
      });
      return false;
    }
    return true;
  }

  async function handleCreateBlockHour(data: any): Promise<void> {
    try {
      const isValid = validateFieldsToBlockHour(data);
      if (isValid) {
        formBlockHourRef.current?.setErrors({});

        const schema = Yup.object().shape({
          startHour: Yup.string().required('Campo obrigatório'),
          endHour: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, { abortEarly: false });

        const [startHour, startMinute] = data.startHour.split(':');
        const [endHour, endMinute] = data.endHour.split(':');

        if (!selectedDate) return;

        const startDate = new Date(selectedDate);
        if (startDate) {
          startDate.setHours(Number(startHour));
          startDate.setMinutes(Number(startMinute));
          startDate.setSeconds(0);
          startDate.setMilliseconds(0);
        }

        const endDate = new Date(selectedDate);
        if (endDate) {
          endDate.setHours(Number(endHour));
          endDate.setMinutes(Number(endMinute));
          endDate.setSeconds(0);
          endDate.setMilliseconds(0);
        }

        setLoading(true);

        const response = await api.post('/provider/bloqued', {
          startDate,
          endDate,
          reason: data.reason,
          provider_id: providerSelectedId,
        });
        onClose();
        onCreated(response.data);

        setSelectedDate(new Date());
        setProviderSelectedId(null);
      }
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formBlockHourRef.current?.setErrors(errors);
      }

      addToast({
        title:
          err?.data?.message || 'Houve um erro ao tentar criar um usuários',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProviders();
  }, []);

  return (
    <Modal
      title="Novo Bloqueio"
      isOpen={visible}
      onRequestClose={() => {
        setSelectedDate(new Date());
        setProviderSelectedId(null);

        onClose();
      }}
      size="sm"
    >
      <ModalBlockHourContainer>
        <h6>Selecione um prestador</h6>
        <ContainerItemSelect>
          {providers.map((item: any) => (
            <ProviderItem
              onClick={() => setProviderSelectedId(item.id)}
              selected={providerSelectedId === item.id}
              url={item.avatar_url}
            />
          ))}
        </ContainerItemSelect>
        <h6>Selecione o dia</h6>
        <ContainerItemSelect>
          <Calendar>
            <DayPicker
              locale={ptBR}
              onSelect={setSelectedDate}
              selected={selectedDate}
              onDayClick={setSelectedDate}
              weekStartsOn={1}
              modifiersStyles={{
                selected: {
                  color: '#ff8503',
                  background: '#343233',
                  border: 'none',
                },
                today: {
                  color: '#237BC3',
                },
                disabled: {
                  color: '#737373',
                },
              }}
              styles={{
                caption: { color: '#ff8503' },
                day: {
                  color: '#a3b0b4',
                },
              }}
            />
          </Calendar>
        </ContainerItemSelect>
        <Form ref={formBlockHourRef} onSubmit={handleCreateBlockHour}>
          <section>
            <InputMask
              mask="hour"
              name="startHour"
              label="Hora Inicio"
              placeholder="HH:mm"
            />
            <InputMask
              mask="hour"
              name="endHour"
              label="Hora Fim"
              placeholder="HH:mm"
            />
          </section>
          <section>
            <Input
              name="reason"
              label="Mensagem de bloqueio"
              placeholder="Digite aqui o motivo de bloqueio"
            />
          </section>
        </Form>
        <Footer modal>
          <Button
            onClick={() => {
              // Swal.fire({
              //   title: 'Confirme!',
              //   text: `Bloqueio de horário para ${
              //     providers.find(item => item.id === providerSelectedId)
              //       ?.text
              //   } em ${dateSelected} das`,
              //   icon: 'warning',
              //   confirmButtonText: 'Sim, Bloquear horário',
              //   confirmButtonColor: '#dc3545',
              //   cancelButtonText: 'Fechar',
              //   showCancelButton: true,
              // }).then(resultCancel => {
              //   if (resultCancel.isConfirmed) {
              formBlockHourRef.current?.submitForm();
              //   }
              // });
            }}
          >
            Salvar
          </Button>
        </Footer>
      </ModalBlockHourContainer>
    </Modal>
  );
}
