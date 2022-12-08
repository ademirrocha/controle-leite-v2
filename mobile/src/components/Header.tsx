import { Text, HStack, Box } from 'native-base';
import { CaretLeft, Export } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

import { ButtonIcon } from './ButtonIcon';

interface Props {
  title: string;
  showBackButton?: boolean;
  showShareButton?: boolean;
  onShare?: () => void;
}

export function Header({ title, showBackButton = false, showShareButton = false, onShare }: Props) {
  const EmptyBoxSpace = () => (<Box w={6} h={6} />);

  const { navigate } = useNavigation();

  return (
    <HStack w="full" h={24} bgColor="gray.800" alignItems="flex-end" pb={5} px={5}>
      <HStack w="full" alignItems="center" justifyContent="space-between">
        {
          showBackButton
            ? <ButtonIcon icon={CaretLeft} onPress={() => navigate('milks')}/>
            : <EmptyBoxSpace />
        }

        <Text color="white"  fontFamily="heading" fontWeight="medium" fontSize="md" textAlign="center">
          {title}
        </Text>

        {
          showShareButton
            ?
            <ButtonIcon icon={Export} onPress={onShare} />
            :
            <EmptyBoxSpace />
        }
      </HStack>
    </HStack>
  );
}