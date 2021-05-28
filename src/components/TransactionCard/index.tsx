import React from 'react';
import { categories } from '../../utils/categories';

import {
  Container,
  Title,
  Amount,
  CategoryName,
  Category,
  Icon,
  Date,
  Footer,
} from './styles';

export interface TransactionCardProps {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  amountFormatted: string;
  category: string;
  date: string;
  dateFormatted: string;
}

interface Props {
  data: TransactionCardProps;
}

const TransactionCard: React.FC<Props> = ({ data }) => {
  const { type, name, amountFormatted, dateFormatted } = data;
  const categoryKey = data.category;
  const [category] = categories.filter(item => item.key === categoryKey);
  return (
    <Container>
      <Title>{name}</Title>
      <Amount type={type}>
        {type === 'negative' && '- '}
        {amountFormatted}
      </Amount>
      <Footer>
        <Category>
          <Icon name={category.icon} />
          <CategoryName>{category.name}</CategoryName>
        </Category>
        <Date>{dateFormatted}</Date>
      </Footer>
    </Container>
  );
};

export { TransactionCard };
