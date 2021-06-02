/* eslint-disable prefer-spread */
/* eslint-disable no-shadow */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/core';
import { useTheme } from 'styled-components';
import {
  Loading,
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
} from './styles';

import { HighlightCard } from '../../components/HighlightCard';
import {
  TransactionCard,
  TransactionCardProps,
} from '../../components/TransactionCard';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAuth } from '../../hooks/auth';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const { user, signOut } = useAuth();

  const getLastTransactionDate = useCallback(
    (collection: DataListProps[], type: 'positive' | 'negative') => {
      const lastTransaction = new Date(
        Math.max.apply(
          Math,
          collection
            .filter(transaction => transaction.type === type)
            .map(transaction => new Date(transaction.date).getTime()),
        ),
      );
      const lastTransactionFormatted = `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
        'pt-BR',
        { month: 'long' },
      )}`;
      return lastTransactionFormatted;
    },
    [],
  );

  const loadStorageTransactions = useCallback(async () => {
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    return response ? JSON.parse(response) : [];
  }, [user.id]);

  const formatTransactions = useCallback(
    (storageTransactions): DataListProps[] => {
      return storageTransactions.map((transaction: DataListProps) => ({
        ...transaction,
        amountFormatted: formatCurrency(transaction.amount),
        dateFormatted: Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(new Date(transaction.date)),
      }));
    },
    [],
  );

  const transactionsSummary = useMemo(() => {
    const { entries, expensives, total } = transactions.reduce(
      (accumulator, transaction) => {
        const { type } = transaction;
        const entries =
          type === 'positive'
            ? accumulator.entries + Number(transaction.amount)
            : accumulator.entries;
        const expensives =
          type === 'negative'
            ? accumulator.expensives + Number(transaction.amount)
            : accumulator.expensives;
        const total = entries - expensives;
        return {
          entries,
          expensives,
          total,
        };
      },
      {
        entries: 0,
        expensives: 0,
        total: 0,
      },
    );
    return {
      entries: formatCurrency(entries),
      expensives: formatCurrency(expensives),
      total: formatCurrency(total),
    };
  }, [transactions]);

  const lastTransactionsSummary = useMemo(() => {
    const lastEntries = getLastTransactionDate(transactions, 'positive');
    const lastExpensives = getLastTransactionDate(transactions, 'negative');
    const interval = `01 a ${lastExpensives}`;
    return {
      entries: `Última entrada dia ${lastEntries}`,
      expensives: `Última saída dia ${lastExpensives}`,
      interval,
    };
  }, [transactions, getLastTransactionDate]);

  const loadTransactions = useCallback(async () => {
    const storageTransactions = await loadStorageTransactions();
    const transactionsFormatted = formatTransactions(storageTransactions);
    setTransactions(transactionsFormatted);
    setLoading(false);
  }, [formatTransactions, loadStorageTransactions]);

  useEffect(() => {
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [loadTransactions]),
  );

  return (
    <>
      {loading ? (
        <Loading color={theme.colors.primary} />
      ) : (
        <Container>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{
                    uri: user.photo,
                  }}
                />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              type="up"
              title="Entradas"
              amount={transactionsSummary.entries}
              lastTransaction={lastTransactionsSummary.entries}
            />
            <HighlightCard
              type="down"
              title="Saídas"
              amount={transactionsSummary.expensives}
              lastTransaction={lastTransactionsSummary.expensives}
            />
            <HighlightCard
              type="total"
              title="Total"
              amount={transactionsSummary.total}
              lastTransaction={lastTransactionsSummary.interval}
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>
            <TransactionList
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </Container>
      )}
    </>
  );
};

export default Dashboard;
