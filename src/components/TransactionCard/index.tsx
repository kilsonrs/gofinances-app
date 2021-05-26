import React from 'react';

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

interface Category {
  name: string;
  icon: string;
}

export interface TransactionCardProps {
  type: 'positive'|'negative';
  title: string;
  amount: string;
  category: Category;
  date: string;
}

interface Props {
  data: TransactionCardProps;
}

const TransactionCard: React.FC<Props> = ({ data }) => {
  const {
    type,
    title,
    amount,
    category,
    date,
  } = data;
  return (
    <Container>
      <Title>{title}</Title>
      <Amount type={type}>
        {type === 'negative' && '- '}
        {amount}
      </Amount>
      <Footer>
        <Category>
          <Icon name={category.icon} />
          <CategoryName>{category.name}</CategoryName>
        </Category>
        <Date>{date}</Date>
      </Footer>
    </Container>
  );
}

export { TransactionCard };