import React, { useCallback } from 'react';
import { FlatList } from 'react-native';

import {
  Container,
  Header,
  Title,
  Category,
  Icon,
  Name,
  Separator,
  Footer,
} from './styles';
import { categories } from '../../utils/categories';
import Button from '../../components/Form/Button';

interface Category {
  key: string;
  name: string;
}

interface Props {
  category: Category;
  setCategory: (category: Category) => void;
  closeSelectCategory: () => void;
}

const CategorySelect: React.FC<Props> = ({
  category,
  setCategory,
  closeSelectCategory,
}) => {
  const handleCategorySelect = useCallback(
    (categoryItem: Category) => {
      setCategory(categoryItem);
    },
    [setCategory],
  );

  return (
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>

      <FlatList
        data={categories}
        style={{ flex: 1, width: '100%' }}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <Category
            onPress={() => handleCategorySelect(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />

      <Footer>
        <Button title="Selecionar" onPress={closeSelectCategory} />
      </Footer>
    </Container>
  );
};

export default CategorySelect;
