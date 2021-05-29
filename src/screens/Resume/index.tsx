/* eslint-disable import/no-duplicates */
import React, { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';
import { VictoryPie } from 'victory-native';
import { addMonths, format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { useFocusEffect } from '@react-navigation/core';
import { categories } from '../../utils/categories';
import { formatCurrency } from '../../utils/formatCurrency';

import HistoryCard from '../../components/HistoryCard';

import {
  Container,
  Content,
  ChartContainer,
  Header,
  Title,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  Loading,
} from './styles';

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
  const bottomTabBarHeight = useBottomTabBarHeight();

  const [loading, setLoading] = useState(false);
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const theme = useTheme();

  const handleDateChange = useCallback(
    (action: 'previous' | 'next') => {
      if (action === 'next') {
        setSelectedDate(addMonths(selectedDate, 1));
      } else {
        setSelectedDate(subMonths(selectedDate, 1));
      }
    },
    [selectedDate],
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    const dataKey = '@gofinances:transactions';
    const storageData = await AsyncStorage.getItem(dataKey);
    const currentData = storageData ? JSON.parse(storageData) : [];

    const expensives = currentData.filter(
      (expensive: TransactionData) =>
        expensive.type === 'negative' &&
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear(),
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
    setLoading(false);
  }, [selectedDate]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {loading ? (
        <Loading color={theme.colors.primary} />
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: bottomTabBarHeight,
          }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleDateChange('previous')}>
              <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>
            <Month>
              {format(selectedDate, 'MMMM, yyyy', {
                locale: ptBR,
              })}
            </Month>
            <MonthSelectButton onPress={() => handleDateChange('next')}>
              <MonthSelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>
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
          {totalByCategories?.map(item => (
            <HistoryCard
              key={item.key}
              color={item.color}
              title={item.name}
              amount={item.totalFormatted}
            />
          ))}
        </Content>
      )}
    </Container>
  );
};

export default Resume;
