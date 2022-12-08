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
import { ConfigValueLeite } from "./NewMilk";

export interface ConfigValueLeitePros {
    configValue: ConfigValueLeite;
    setConfigValue: Function;
}

interface Props {
    params: ConfigValueLeitePros
}

export function UpdateConfigMilk({...rest}: any) {

    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const { navigate } = useNavigation();

    const [ configValue, setConfigValue ] = useState<ConfigValueLeite>(rest.route.params.configValue);

    const [value, setValue ] = useState((configValue.value / 100).toFixed(2).toString());

    async function handleConfigUpdate() {

        if(!value){
            return alertError(toast, 'Informe o valor')
        }

        try {
            setIsLoading(true);
            const response = await api.put('/config/milk', { value: Number(value.replace(',', '.')) })

            rest.route.params.setConfigValue(response.data.configValue)

            alertSuccess(toast, 'Valor do leite alterado com sucesso!');
            navigate('newMilk')

        } catch (error) {
            console.log(error);
            alertError(toast, 'Não foi possível alterar o valor')
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <VStack flex={1} bgColor="gray.900" >
            <Header title="Alterar Valor do Litro de Leite"/>

            <VStack mt={8} mx={5} alignItems='center'>
                <Logo width={212} height={40} />

                <Heading fontFamily='heading' color="white" fontSize='xl' my={8} textAlign="center">
                    Alterar Valor do Litro de Leite
                </Heading>

                <Input 
                    mb={2}  
                    placeholder='Valor do leite'
                    keyboardType="numeric"
                    onChangeText={setValue}
                    value={value}
                />

                <Button 
                    title="SALVAR"
                    onPress={handleConfigUpdate}
                    isLoading={isLoading}
                />

                <Text color="gray.200" fontSize='sm' textAlign="center" px={10} mt={4} >
                    By Ademir Rocha Ferreira
                </Text>

            </VStack>
        </VStack>
    )
}