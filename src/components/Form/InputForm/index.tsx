import React from 'react';
import { TextInputProps } from 'react-native';
import { Control, Controller } from 'react-hook-form';
import Input from '../Input';

import { Container } from './styles';

interface Props extends TextInputProps {
  control: Control;
  name: string;
}

const InputForm: React.FC<Props> = ({ control, name, ...rest }) => {
  return (
    <Container>
      <Controller
        name={name}
        control={control}
        render={({ field: { onBlur, onChange, value } }) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            {...rest}
          />
        )}
      />
    </Container>
  );
};

export default InputForm;
