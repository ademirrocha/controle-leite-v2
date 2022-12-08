import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Column, Heading, HStack, Row, Text, useToast, VStack } from 'native-base';

import { Button } from './Button';
import { alertConfirm, alertError, alertSuccess } from '../utils/alert.utils';
import { api } from '../services/api';
import { IToastService } from 'native-base/lib/typescript/components/composites/Toast';
import { useNavigation } from '@react-navigation/native';
import { dateStr } from '../utils/convert.utils';

export interface MilkCardPros {
  id: string;
  date: Date;
  value: number;
  qty: number;
  createdAt: string;
  paidOut: boolean;
}

interface Props extends TouchableOpacityProps {
  data: MilkCardPros,
  setIsLoading: any,
  toast: IToastService,
  onDelete: Function
}

export function MilkCard({data, toast, onDelete, setIsLoading, ...rest }: Props) {

  const { navigate } = useNavigation();

  const valueFormat = (value: number) => {
    return 'R$ ' + (value / 100).toFixed(2).replace('.', ',');
  }

  const excluir = (id: string) => {
    alertConfirm("Deseja mesmo Excluir este registro?", deleteMilk, id)
  }

  async function deleteMilk(id) {
    try {
      setIsLoading(true)
        const response = await api.delete(`/milk/${id}`);
        if(response.data?.result){
          alertSuccess(toast, 'Registro excluído com sucesso!');
          onDelete()
        }
       
    } catch (error) {
        console.log(error);
        alertError(toast, 'Houve um erro deletar o registro!')
    } finally {
        setIsLoading(false)
    }

}
  
  return (
    <TouchableOpacity {...rest}>
          <VStack>
            
              <Row flexWrap="wrap"  mt={4} pb={4} borderBottomWidth={1}  borderColor="gray.600">
                <Text color="gray.100" w={56}>
                  Data: {dateStr(data.date)}
                  {'\n'} 
                  Valor: {valueFormat(data.value)}
                  {'\n'} 
                  Quantidade: {data.qty}
                </Text>
                <Column>
                  <Button mt={3} title='Excluir' onPress={() => excluir(data.id)} w={20} />
                </Column>
                
              </Row>
            
          </VStack>
     
    </TouchableOpacity>
  );
}