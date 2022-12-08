import { Heading, VStack, Text, useToast, Pressable } from "native-base";
import { Header } from "../components/Header";
import Logo from '../assets/logo.svg';
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useEffect, useState } from "react";
import { alertError, alertSuccess } from "../utils/alert.utils";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";
import { InputDateAndroid } from "../components/InputDateAndroid";
import { getMoney } from "../utils/convert.utils";

export interface ConfigValueLeite {
    id: string;
    value: number;
    createdAt: string;
  }

export function NewMilk() {

    const [qty, setQty] = useState('1');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const { navigate } = useNavigation();

    const [date, setDate] = useState(new Date())
    const [configValue, setConfigValue] = useState<ConfigValueLeite>(null)


    async function handlePollCreate() {
        if(!qty){
            return alertError(toast, 'Informe a quantidade')
        }

        if(!date){
            return alertError(toast, 'Informe a data')
        }


        try {
            setIsLoading(true);

            await api.post('/milk', { qty: parseInt(qty), date })

            alertSuccess(toast, 'Registro adicionado com sucesso!');

            setQty('1');
            setDate(new Date());
            navigate('milks', {dateInit: date.toLocaleString()})

        } catch (error) {
            console.log(error);
            alertError(toast, 'Não foi possível salvar o registro')
            throw error;
        } finally {
            setIsLoading(false);
        }
    }
    
    async function reloadData(){
        try {
            setIsLoading(true)
            const response = await api.get('/config/milk');
            console.log(response.data)
            setConfigValue(response.data.config)
        } catch (error) {
            console.log(error);
            alertError(toast, 'Houve um erro ao buscar daados do valor do Leite!')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect( () => {
        reloadData()
    }, [])

    return (
        <VStack flex={1} bgColor="gray.900" >
            <Header title="Criar Novo Registro"/>

            <VStack mt={8} mx={5} alignItems='center'>
                <Logo width={212} height={40} />

                <Heading fontFamily='heading' color="white" fontSize='md' my={8} textAlign="center">
                { configValue?.value ? 'O Litro do litro de leite é ' + getMoney(configValue.value / 100) : 'Não há valor do litro de leito configurado' }
                    {'\n'}
                    <Pressable onPress={() => navigate('updateConfigMilk', {configValue: configValue, setConfigValue})}>
                        <Text textDecorationLine="underline" justifyContent="center"  color="yellow.500">
                            Alterar valor 
                        </Text>
                    </Pressable>
                </Heading>

                <Heading fontFamily='heading' color="white" fontSize='xl' my={8} textAlign="center">
                    Adicionar registro de leite
                </Heading>


                <InputDateAndroid 
                   date={date}
                   setDate={setDate}
                />

                <Input 
                    mb={2}  
                    placeholder='Quantidade'
                    onChangeText={setQty}
                    value={qty}
                />

                <Button 
                    title="SALVAR"
                    onPress={handlePollCreate}
                    isLoading={isLoading}
                />

                <Text color="gray.200" fontSize='sm' textAlign="center" px={10} mt={4} >
                    By Ademir Rocha Ferreira
                </Text>

            </VStack>
        </VStack>
    )
}