const formatCurrency = (value: number | string): string => {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export { formatCurrency };
