import React, { useEffect, useState } from 'react';
import { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/esm/locale/pt-BR/index.js';
import ReactDateRangerPicker from '@wojtekmaj/react-daterange-picker';
import { format } from 'date-fns';

import VMasker from 'vanilla-masker';
import List from '../../../components/List';
import Button from '../../../components/Button';

import { Container, Header } from './styles';
import api from '../../../services/api';
import { Spin } from '../../../components/Spin';
import ButtonCSV from '../../../components/ButtonCSV';
import { datetime, real } from '../../../utils/especialFormats';

export default function ReportOrders(): JSX.Element {
  const [value, onChange] = useState([new Date(), new Date()]);
  const [reportData, setReportData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    registerLocale('ptBR', ptBR);
  }, []);

  async function getReport(): Promise<void> {
    try {
      setLoading(true);
      const [startDate, endDate] = value;
      const response = await api.get('/report/order', {
        params: {
          startDate: format(startDate, 'yyyy-MM-dd 00:00:00'),
          endDate: format(endDate, 'yyyy-MM-dd 23:59:59'),
        },
      });
      setReportData(response.data);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function generateDataFormatted(): any {
    // setLoading(true);
    const dataFormatted = reportData.map((reportItem: any) => ({
      Dia: datetime(reportItem.date),
      Cliente: reportItem.appointment?.user?.username,
      Profissional: reportItem.appointment?.provider?.username,
      'Valor Total': real(reportItem.total),
      'Valor Pago': real(reportItem.totalPayment),
      'Valor Troco': real(reportItem.change),
      'Tipo Pagamento': reportItem.type_payment,
      'Fechado em': datetime(reportItem.finishedDate),
    }));
    // setLoading(false);

    return dataFormatted;
  }

  return (
    <Spin isVisible={loading}>
      <Container>
        <Header>
          <h3>Relatório de atendimentos</h3>
          <div>
            {!!reportData.length && (
              <ButtonCSV
                data={generateDataFormatted()}
                reportName="relatorio_atendimento"
              />
            )}
            <ReactDateRangerPicker
              className="teste"
              calendarClassName="calendarCustom"
              onChange={onChange}
              value={value}
              format="dd/MM/yyyy"
              calendarIcon={null}
            />
            <Button onClick={getReport}>Buscar</Button>
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
      </Container>
    </Spin>
  );
}
