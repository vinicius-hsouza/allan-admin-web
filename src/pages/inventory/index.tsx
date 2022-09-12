import { Button } from '@atmoutsourcing/siakit';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Container, Card } from './styles';

export default function Inventories(): JSX.Element {
  const navigate = useNavigate();

  const inventoryItems = [
    { id: 1, title: 'Entradas', route: '/inventory/purchaseproducts' },
    // { id: 2, title: 'Comissão', route: '/reports/commission' },
  ];

  return (
    <Container>
      {inventoryItems.map(inventoryItem => (
        <Card key={inventoryItem.id} onClick={() => navigate(inventoryItem.route)}>
          <p>{inventoryItem.title}</p>
        </Card>
      ))}
    </Container>
  );
}