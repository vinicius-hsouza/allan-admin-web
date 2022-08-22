import { Button } from '@atmoutsourcing/siakit';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Container, Card } from './styles';

export default function Reports(): JSX.Element {
  const navigate = useNavigate();

  const reports = [
    { id: 1, title: 'Atendimentos', route: '/reports/orders' },
    { id: 2, title: 'Comissão', route: '/reports/commission' },
  ];

  return (
    <Container>
      {reports.map(report => (
        <Card key={report.id} onClick={() => navigate(report.route)}>
          <p>{report.title}</p>
        </Card>
      ))}
    </Container>
  );
}
