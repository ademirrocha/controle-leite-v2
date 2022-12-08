import { useNavigation } from '@react-navigation/native';
import { Row, Text, Pressable } from 'native-base';

export function EmptyMilkList() {

  const { navigate } = useNavigation();

  return (
    <Row flexWrap="wrap" justifyContent="center">
      <Text color="white" fontSize="sm" textAlign="center">
        Não há registros em aberto 
        {'\n\n'}
        <Pressable  onPress={() => navigate('newMilk')}>
        <Text textDecorationLine="underline" justifyContent="center"  color="yellow.500">
          Adicionar um novo
        </Text>
      </Pressable>
      </Text>
      <Text color="white" fontSize="sm" textAlign="center">
        ?
      </Text>
    </Row>
  );
}