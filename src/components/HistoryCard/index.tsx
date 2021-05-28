import React from 'react';

import { Container, Title, Amount } from './styles';

interface Props {
  title: string;
  color: string;
  amount: string;
}

const HistoryCard: React.FC<Props> = ({ color, title, amount }) => {
  return (
    <Container color={color}>
      <Title>{title}</Title>
      <Amount>{amount}</Amount>
    </Container>
  );
};

export default HistoryCard;
