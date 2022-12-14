import React, { useEffect, useRef, useState } from 'react';
import { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/esm/locale/pt-BR/index.js';
import { format } from 'date-fns';

import VMasker from 'vanilla-masker';
import { FormHandles } from '@unform/core';
import List from '../../../components/List';
// import Button from '../../../components/Button';
import ButtonCSV from '../../../components/ButtonCSV';
import { Form } from '../../../components/Form';
import InputMask from '../../../components/InputMask';
// import Select from '../../../components/Select';

import { Container, Header } from './styles';
import api from '../../../services/api';
import { Spin } from '../../../components/Spin';
import { date, datetime, real } from '../../../utils/especialFormats';
import { MaskInput, Select, Button } from '@atmoutsourcing/siakit';

type Provider = {
  id: string;
  username: string;
};

export default function ReportCommision(): JSX.Element {
  const formRef = useRef<FormHandles>(null);

  const [reportData, setReportData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    registerLocale('ptBR', ptBR);
  }, []);

  async function getReport(data: any): Promise<void> {
    try {
      setLoading(true);
      const [month, year] = data.month.split('/');

      const response = await api.get('/report/commision', {
        params: {
          month,
          year,
          provider_id: data.providerId,
        },
      });
      setReportData(response.data);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadProviders(): Promise<void> {
    try {
      setLoading(true);
      const response = await api.get('/users/provider');
      setProviders(response.data);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function generateDataFormatted(): any {
    // setLoading(true);
    const dataFormatted = reportData.map((reportItem: any) => ({
      Dia: date(reportItem.date),
      Tipo: reportItem.type === 'SERVICE' ? 'Servi??o' : 'Produto',
      Nome: reportItem.name,
      Profissional: reportItem.provider_name,
      Comiss??o: `${reportItem.percentageCommission}%`,
      'Valor Total': real(reportItem.totalValue),
      'Valor de Comiss??o': real(reportItem.commissionValue),
    }));
    // setLoading(false);

    return dataFormatted;
  }

  useEffect(() => {
    loadProviders();
  }, []);

  return (
    <Spin isVisible={loading}>
      <Container>
        <Header>
          <h3>Relat??rio de comiss??es</h3>
          <div>
            <Form ref={formRef} onSubmit={getReport}>
              <section>
                {reportData.length ? (
                  <ButtonCSV
                    data={generateDataFormatted()}
                    reportName="relatorio_comissao"
                    size="large"
                  />
                ) : null}
                <Select
                  name="providerId"
                  // width="300px"
                  // label="Prestador"
                  placeholder="Selecione o prestador"
                  options={providers.map(provider => ({
                    value: provider.id,
                    label: provider.username,
                  }))}
                />
                <MaskInput
                  name="month"
                  mask="monthAndYear"
                  placeholder="Digite o m??s e o ano"
                />
                <Button
                  type='button'
                  onClick={() => formRef.current?.submitForm()}
                >
                  Buscar
                </Button>
              </section>
            </Form>
          </div>
        </Header>
        <List
          data={reportData}
          options={[
            {
              title: 'Dia',
              dataIndex: 'date',
              render: (row: any) => datetime(row.date),
            },
            {
              title: 'Tipo',
              dataIndex: 'type',
              render: (row: any) => {
                if (row.type) {
                  return row.type === 'SERVICE' ? 'Servi??o' : 'Produto';
                }
                return '';
              },
            },
            { title: 'Nome', dataIndex: 'name' },
            { title: 'Profissional', dataIndex: 'provider_name' },
            {
              title: 'Comiss??o (%)',
              dataIndex: 'percentageCommission',
              render: (row: any) => {
                if (row.percentageCommission) {
                  return `${row.percentageCommission}%`;
                }
                return '';
              },
            },
            {
              title: 'Valor Total',
              dataIndex: 'totalValue',
              render: (row: any) => {
                if (row.totalValue) {
                  return VMasker.toMoney(row.totalValue, {
                    precision: 2,
                    separator: ',',
                    delimiter: '.',
                    unit: 'R$',
                  });
                }
                return '';
              },
            },
            {
              title: 'Valor de comiss??o',
              dataIndex: 'commissionValue',
              render: (row: any) => {
                if (row.commissionValue) {
                  return VMasker.toMoney(row.commissionValue, {
                    precision: 2,
                    separator: ',',
                    delimiter: '.',
                    unit: 'R$',
                  });
                }
                return '';
              },
            },
          ]}
        />
      </Container>
    </Spin>
  );
}
