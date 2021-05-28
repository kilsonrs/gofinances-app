import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import HistoryCard from '../../components/HistoryCard';
import { categories } from '../../utils/categories';
import { formatCurrency } from '../../utils/formatCurrency';

import { Container, Content, Header, Title } from './styles';

interface TransactionData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  amountFormatted: string;
  category: string;
  date: string;
  dateFormatted: string;
}

interface CategoryData {
  key: string;
  name: string;
  color: string;
  total: string;
}

const Resume: React.FC = () => {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>();

  const loadData = useCallback(async () => {
    const dataKey = '@gofinances:transactions';
    const storageData = await AsyncStorage.getItem(dataKey);
    const currentData = storageData ? JSON.parse(storageData) : [];

    const expensives = currentData.filter(
      (expensive: TransactionData) => expensive.type === 'negative',
    );

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionData) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });

      if (categorySum > 0) {
        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: formatCurrency(categorySum),
        });
      }
    });
    setTotalByCategories(totalByCategory);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      <Content>
        {totalByCategories?.map(item => (
          <HistoryCard
            key={item.key}
            color={item.color}
            title={item.name}
            amount={item.total}
          />
        ))}
      </Content>
    </Container>
  );
};

export default Resume;
