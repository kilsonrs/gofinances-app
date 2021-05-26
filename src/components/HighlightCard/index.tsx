import React from 'react';

import { 
  Container,
  Title,
  Icon,
  Header,
  Amount,
  LastTransaction,
  Footer,
} from './styles';

interface HighlightCardProps {
  type: 'up'|'down'|'total';
  title: string;
  amount: string;
  lastTransaction: string;
}

const icon = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle',
  total: 'dollar-sign',
}

const HighlightCard: React.FC<HighlightCardProps> = ({
  type,
  title,
  amount,
  lastTransaction,
}) => {
  return (
    <Container type={type}>
      <Header>
        <Title type={type}>{title}</Title>
        <Icon name={icon[type]} type={type} />
      </Header>
      <Footer>
        <Amount type={type}>{amount}</Amount>
        <LastTransaction type={type}>
          {lastTransaction}
        </LastTransaction>
      </Footer>
    </Container>
  );
}

export {HighlightCard};