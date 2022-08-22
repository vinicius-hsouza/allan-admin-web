import { FormHandles } from '@unform/core';
import { format } from 'date-fns';
import { debounce, maxBy } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { FaBirthdayCake } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { IoEllipseOutline, IoPhonePortraitOutline } from 'react-icons/io5';
import * as Yup from 'yup';
import ptBR from 'date-fns/locale/pt-BR';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import Button from '../../../components/Button';
import { Footer, Form } from '../../../components/Form';
import Input from '../../../components/Input';
import InputMask from '../../../components/InputMask';
import { Modal } from '@atmoutsourcing/siakit';
import { useToast } from '../../../hooks/toast';
import api from '../../../services/api';
import getValidationErrors from '../../../utils/getValidationErrors';

import {
  Container,
  Header,
  Calendar,
  ModalNewAppointmentContainer,
  ContainerItemSelect,
  ProviderItem,
  ServiceItem,
  ServiceContainerItems,
  HourItem,
  ContainerUser,
  UserItem,
  ContainerSelectUser,
  UserSelectItem,
  ModalBlockHourContainer,
} from './styles';
import { useLoading } from '../../../hooks/loading';

interface IProvider {
  id: string;
  text: string;
  color: string;
  avatar_url: string;
}

interface IService {
  id: number;
  name: string;
  duration: number;
  price: string;
  isCombo: boolean;
}

interface IUser {
  id: string;
  username: string;
  phone: string;
  avatar_url: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function ModalCreateAppointment({
  visible,
  onClose,
}: Props): JSX.Element {
  const formRef = useRef<FormHandles>(null);
  const formNewAppointmentRef = useRef<FormHandles>(null);
  const formSearchUser = useRef<FormHandles>(null);
  const formCreateUserRef = useRef<FormHandles>(null);
  const formBlockHourRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const { setLoading } = useLoading();

  const [servicesSelected, setServicesSelected] = useState<IService[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [userSelected, setUserSelected] = useState<IUser>({} as IUser);
  const [usersSearch, setUsersSearch] = useState<IUser[]>([]);
  const [disabledDays, setDisabledDays] = useState<any>([]);
  const [hours, setHours] = useState<any>([]);
  const [hourSelected, setHourSelected] = useState<any>({});
  // const [loading, setLoading] = useState(false);
  const [modalCreateUser, setModalCreateUser] = useState(false);
  const [providers, setProviders] = useState<IProvider[]>([]);
  const [providerSelectedId, setProviderSelectedId] = useState<string | null>(
    'a0259518-9346-4ba7-8ae3-fde1773b4415',
  );
  const [services, setServices] = useState<IService[]>([]);
  const [modalSelectUser, setModalSelectUser] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [monthSelected, setMothSelected] = useState<Date | undefined>(
    new Date(),
  );

  async function loadProviders(): Promise<void> {
    try {
      setLoading(true);
      const response = await api.get('/provider');
      if (response.data) {
        const array = response.data.map((item: any) => ({
          id: item.id,
          // name: item.username,
          text: item.username,
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

  async function loadServices(): Promise<void> {
    try {
      setLoading(true);
      const response = await api.get('/services');

      setServices(response.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers(): Promise<void> {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
      setUsersSearch(response.data);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUser(data: any): Promise<void> {
    try {
      setLoading(true);
      formCreateUserRef.current?.setErrors({});

      const [day, month, year] = data?.dateBirth?.split('/');

      const dateBirth = new Date(year, month - 1, day);

      const schema = Yup.object().shape({
        username: Yup.string().required('Campo obrigatório'),
        phone: Yup.string().required('Campo obrigatório'),
      });

      await schema.validate(data, { abortEarly: false });

      const response = await api.post('/users', {
        ...data,
        isProvider: false,
        isAdmin: false,
        dateBirth,
      });

      addToast({
        title: 'Novo usuário criado com sucesso',
        type: 'success',
      });

      setUsersSearch([response.data, ...usersSearch]);

      setModalCreateUser(false);
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
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

  async function handleSubmitUser(data: any): Promise<void> {
    try {
      console.log(data);
    } catch (err: any) {
      console.error(err);
    }
  }

  const handleSearchUser = useCallback(
    debounce((value: string) => {
      if (value === '') {
        setUsersSearch(users);
      } else {
        setUsersSearch(
          users.filter(
            user =>
              user.username.toLowerCase().includes(value.toLowerCase()) ||
              user.phone.toLowerCase().includes(value.toLowerCase()),
          ),
        );
      }
    }, 500),
    [users, usersSearch],
  );

  function validateItemsSelected(): boolean {
    if (!userSelected.id) {
      addToast({
        type: 'error',
        title: '',
        description: 'É necessário selecionar o usuário que sera atendido',
      });
      return false;
    }
    if (!providerSelectedId) {
      addToast({
        type: 'error',
        title: '',
        description: 'É necessário selecionar o prestador do serviço',
      });
      return false;
    }
    if (!servicesSelected.length) {
      addToast({
        type: 'error',
        title: '',
        description: 'É necessário selecionar pelo menos 1 serviço.',
      });
      return false;
    }
    if (!selectedDate) {
      addToast({
        type: 'error',
        title: '',
        description: 'É necessário selecionar uma data de agendamento!',
      });
      return false;
    }

    if (!hourSelected.hour) {
      addToast({
        type: 'error',
        title: '',
        description: 'É necessário selecionar uma hora para o agendamento!',
      });
      return false;
    }

    return true;
  }

  async function handleNewAppointment(): Promise<void> {
    try {
      const isValid = validateItemsSelected();
      if (isValid) {
        setLoading(true);
        const dateAppointment = selectedDate;

        dateAppointment?.setHours(hourSelected.hour);
        dateAppointment?.setMinutes(hourSelected.minute);

        const response = await api.post('appointments', {
          provider_id: providerSelectedId,
          date: dateAppointment,
          services: servicesSelected,
          user_id: userSelected.id,
        });

        if (response.data) {
          console.log(response.data);
          onClose();
        }

        addToast({
          type: 'success',
          title: '',
          description: ' Agendamento realizado com sucesso!',
        });
        setProviderSelectedId(null);
        setServicesSelected([]);
        setHourSelected({});
      }
      // listHoursAvailable({ year: date.year, month: date.month, day: date.day });
    } catch (err: any) {
      console.log(err);
      addToast({
        type: 'error',
        title: 'Houve um erro ao processar sua solicitação.',
        description: err.data.message || 'Erro de solicitação',
      });
    } finally {
      setLoading(false);
    }
  }

  async function listDaysAvailable({ month, year }: any): Promise<void> {
    try {
      setLoading(true);
      const response = await api.get(
        `/provider/${providerSelectedId}/month-availability`,
        {
          params: {
            year,
            month,
          },
        },
      );

      const daysNotAvailable = response.data
        .filter(({ available }: any) => !available)
        .map(({ day }: any) => new Date(year, month - 1, day));

      setDisabledDays(daysNotAvailable);
    } catch (err: any) {
      console.error(err.data.message);
    } finally {
      setLoading(false);
    }
  }

  async function listHoursAvailable({ year, month, day }: any): Promise<void> {
    try {
      setLoading(true);
      const response = await api.get(
        `/provider/${providerSelectedId}/day-availability`,
        {
          params: {
            year,
            month,
            day,
            timeService: maxBy(servicesSelected, 'duration')?.duration,
            isProvider: true,
          },
        },
      );
      const hourAvailable = response.data.map(
        ({ hour, minute, available, bloqued }: any) => ({
          hour,
          minute,
          available,
          bloqued,
          hourFormatted: format(new Date().setHours(hour, minute), 'HH:mm'),
        }),
      );
      setHours(hourAvailable);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (monthSelected && providerSelectedId) {
      listDaysAvailable({
        month: monthSelected.getMonth() + 1,
        year: monthSelected.getFullYear(),
      });
    }
  }, [monthSelected, providerSelectedId]);

  useEffect(() => {
    if (providerSelectedId && selectedDate) {
      listHoursAvailable({
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
        day: selectedDate.getDate(),
      });
    }
  }, [providerSelectedId, selectedDate]);

  useEffect(() => {
    loadProviders();
    loadServices();
    loadUsers();
  }, []);

  return (
    <>
      <Modal
        size="lg"
        title="Novo agendamento"
        isOpen={visible}
        onRequestClose={() => {
          setProviderSelectedId(null);
          setServicesSelected([]);
          setHourSelected({});
          setUserSelected({} as IUser);

          if (onClose) {
            onClose();
          }
        }}
      >
        <ModalNewAppointmentContainer>
          <div
            style={{
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h6>Selecione um cliente</h6>
            <ContainerUser>
              <UserItem onClick={() => setModalSelectUser(true)}>
                {userSelected.id ? (
                  <>
                    <img src={userSelected.avatar_url} alt="avatar_user" />
                    <p>{userSelected.username}</p>
                  </>
                ) : (
                  <p>Clique para selecionar um usuário</p>
                )}
              </UserItem>
            </ContainerUser>
            <h6>Selecione um prestador</h6>
            <ContainerItemSelect>
              {providers.map(item => (
                <ProviderItem
                  onClick={() => setProviderSelectedId(item.id)}
                  selected={providerSelectedId === item.id}
                  url={item.avatar_url}
                />
              ))}
            </ContainerItemSelect>
            <h6>Selecione os serviços</h6>
            <div style={{ overflow: 'auto', marginTop: 8 }}>
              <h6>Combos</h6>
              <ServiceContainerItems>
                {services.map(item =>
                  item.isCombo ? (
                    <ServiceItem
                      onClick={() => {
                        const serviceAlreadySelected = servicesSelected.find(
                          serviceSelected => serviceSelected.id === item.id,
                        );
                        if (serviceAlreadySelected) {
                          setServicesSelected(
                            servicesSelected.filter(
                              serviceSelected => serviceSelected.id !== item.id,
                            ),
                          );
                        } else {
                          setServicesSelected([...servicesSelected, item]);
                        }
                      }}
                      selected={
                        !!servicesSelected.find(
                          serviceSelected => serviceSelected.id === item.id,
                        )
                      }
                    >
                      <div>
                        {servicesSelected.find(
                          serviceSelected => serviceSelected.id === item.id,
                        ) ? (
                          <IoIosCheckmarkCircle />
                        ) : (
                          <IoEllipseOutline />
                        )}
                      </div>
                      <div>
                        <p>{item.name}</p>
                        <span>
                          <p>
                            <b>
                              {item.price &&
                                Number(item.price).toLocaleString('PT-BR', {
                                  minimumFractionDigits: 2,
                                  style: 'currency',
                                  currency: 'BRL',
                                })}{' '}
                              -{' '}
                            </b>
                            {item.duration}min
                          </p>
                        </span>
                      </div>
                    </ServiceItem>
                  ) : (
                    <></>
                  ),
                )}
              </ServiceContainerItems>
              <h6>Individuais</h6>
              <ServiceContainerItems>
                {services.map(item =>
                  !item.isCombo ? (
                    <ServiceItem
                      onClick={() => {
                        const serviceAlreadySelected = servicesSelected.find(
                          serviceSelected => serviceSelected.id === item.id,
                        );
                        if (serviceAlreadySelected) {
                          setServicesSelected(
                            servicesSelected.filter(
                              serviceSelected => serviceSelected.id !== item.id,
                            ),
                          );
                        } else {
                          setServicesSelected([...servicesSelected, item]);
                        }
                      }}
                      selected={
                        !!servicesSelected.find(
                          serviceSelected => serviceSelected.id === item.id,
                        )
                      }
                    >
                      <div>
                        {servicesSelected.find(
                          serviceSelected => serviceSelected.id === item.id,
                        ) ? (
                          <IoIosCheckmarkCircle />
                        ) : (
                          <IoEllipseOutline />
                        )}
                      </div>
                      <div>
                        <p>{item.name}</p>
                        <span>
                          <p>
                            <b>
                              {item.price &&
                                Number(item.price).toLocaleString('PT-BR', {
                                  minimumFractionDigits: 2,
                                  style: 'currency',
                                  currency: 'BRL',
                                })}{' '}
                              -{' '}
                            </b>
                            {item.duration}min
                          </p>
                        </span>
                      </div>
                    </ServiceItem>
                  ) : (
                    <></>
                  ),
                )}
              </ServiceContainerItems>
            </div>
          </div>
          <div>
            <h6>Selecione o dia</h6>
            <ContainerItemSelect>
              <Calendar>
                <DayPicker
                  locale={ptBR}
                  onSelect={setSelectedDate}
                  selected={selectedDate}
                  onMonthChange={setMothSelected}
                  onDayClick={setSelectedDate}
                  modifiers={{
                    disabled: disabledDays,
                  }}
                  disabled={disabledDays}
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
            <h6>Horas disponiveis</h6>
            <ContainerItemSelect>
              {hours.map((hour: any) => {
                const date = new Date();
                date.setHours(hour.hour);
                date.setMinutes(hour.minute);
                if (hour.bloqued || !hour.available) {
                  return null;
                }

                return (
                  <HourItem
                    onClick={() => setHourSelected(hour)}
                    selected={
                      hourSelected.hour === hour.hour &&
                      hourSelected.minute === hour.minute
                    }
                  >
                    <p>{format(date, 'HH:mm')}</p>
                  </HourItem>
                );
              })}
            </ContainerItemSelect>
          </div>
        </ModalNewAppointmentContainer>
        <Footer modal>
          <Button
            onClick={() => {
              handleNewAppointment();
            }}
          >
            Agendar
          </Button>
        </Footer>
      </Modal>
      <Modal
        title="Selecione o usuário"
        isOpen={modalSelectUser}
        onRequestClose={() => setModalSelectUser(false)}
      >
        <Form ref={formSearchUser} onSubmit={handleSubmitUser}>
          <section style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Input
              name="name"
              placeholder="Digite o nome ou o numero do usuário"
              onChange={e => handleSearchUser(e.target.value)}
            />
          </section>
        </Form>
        <ContainerSelectUser>
          {usersSearch.map(user => (
            <UserSelectItem
              selected={userSelected.id === user.id}
              onClick={() => setUserSelected(user)}
            >
              <img src={user.avatar_url} alt="" />
              <div>
                <h5>{user.username}</h5>
                <p>{user.phone}</p>
              </div>
            </UserSelectItem>
          ))}
        </ContainerSelectUser>
        <Footer modal>
          <div>
            <Button onClick={() => setModalCreateUser(true)}>
              Novo usuário
            </Button>
          </div>
          <Button onClick={() => setModalSelectUser(false)}> Selecionar</Button>
        </Footer>
      </Modal>
      <Modal
        title="Novo usuário"
        onRequestClose={() => {
          setModalCreateUser(false);
        }}
        isOpen={modalCreateUser}
        size="md"
      >
        <Form ref={formRef} onSubmit={handleCreateUser} autoComplete="off">
          <section>
            <Input
              name="username"
              placeholder="Nome do usuário"
              label="Nome (Obrigatório)"
              icon={FiUser}
            />
          </section>

          <section>
            <InputMask
              mask="phone"
              label="Celular (Obrigatório)"
              name="phone"
              placeholder="Digite o numero do celular"
              icon={IoPhonePortraitOutline}
            />
          </section>

          <section>
            <InputMask
              name="dateBirth"
              mask="date"
              label="Data de nascimento (Obrigatório)"
              placeholder="Digite a data de nascimento"
              icon={FaBirthdayCake}
            />
          </section>

          <Footer modal>
            <Button type="submit">Cadastrar</Button>
          </Footer>
        </Form>
      </Modal>
    </>
  );
}
