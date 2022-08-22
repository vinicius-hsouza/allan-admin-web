import React from 'react';
import Button from '../Button';

import { Container } from './styles';

interface Props {
  data: any;
  reportName: string;
  size?: string;
}

export default function ButtonCSV({
  data,
  reportName,
  size = 'middle',
}: Props): JSX.Element {
  return (
    <Container size="middle" data={data} filename={reportName}>
      <Button type="button" size={size} color="success">
        Exportar CSV
      </Button>
    </Container>
  );
}
