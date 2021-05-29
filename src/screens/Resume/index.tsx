import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { useTheme } from 'styled-components';

import { RFValue } from 'react-native-responsive-fontsize';
import HistoryCard from '../../components/HistoryCard';
import { categories } from '../../utils/categories';
import { formatCurrency } from '../../utils/formatCurrency';

import { Container, Content, ChartContainer, Header, Title } from './styles';

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
  total: number;
  totalFormatted: string;
  percent: number;
  percentFormatted: string;
}

const Resume: React.FC = () => {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>();

  const theme = useTheme();

  const loadData = useCallback(async () => {
    const dataKey = '@gofinances:transactions';
    const storageData = await AsyncStorage.getItem(dataKey);
    const currentData = storageData ? JSON.parse(storageData) : [];

    const expensives = currentData.filter(
      (expensive: TransactionData) => expensive.type === 'negative',
    );

    const expensivesTotal = expensives.reduce(
      (accumulator: number, expensive: TransactionData) => {
        return accumulator + Number(expensive.amount);
      },
      0,
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
        const percent = (categorySum / expensivesTotal) * 100;
        const percentFormatted = `${percent.toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum,
          totalFormatted: formatCurrency(categorySum),
          percent,
          percentFormatted,
        });
      }
    });
    setTotalByCategories(totalByCategory);
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      <ChartContainer>
        <VictoryPie
          data={totalByCategories}
          colorScale={totalByCategories?.map(category => category.color)}
          style={{
            labels: {
              fontSize: RFValue(18),
              fontWeight: 'bold',
              fill: theme.colors.shape,
            },
          }}
          labelRadius={50}
          x="percentFormatted"
          y="total"
        />
      </ChartContainer>
      <Content>
        {totalByCategories?.map(item => (
          <HistoryCard
            key={item.key}
            color={item.color}
            title={item.name}
            amount={item.totalFormatted}
          />
        ))}
      </Content>
    </Container>
  );
};

export default Resume;
