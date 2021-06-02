import { RectButton } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Button = styled(RectButton)`
  flex-direction: row;
  align-items: center;

  background: ${({ theme }) => theme.colors.shape};

  border-radius: 5px;
  margin-bottom: 16px;
`;

export const ImageContainer = styled.View`
  padding: ${RFValue(16)}px;
  border-right-width: 1px;
  border-right-color: ${({ theme }) => theme.colors.background};
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.title};
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;

  flex: 1;
  text-align: center;
`;
