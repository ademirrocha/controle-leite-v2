import { useCallback, useEffect, useState } from "react";
import { FlatList, HStack, Icon, Row, Text, useToast, VStack } from "native-base";
import { Octicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native'

import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { api } from "../services/api";
import { Loading } from "../components/Loading";
import { alertConfirm, alertError, alertSuccess } from "../utils/alert.utils";
import { MilkCard, MilkCardPros } from "../components/MilkCard";
import { EmptyMilkList } from "../components/EmptyMilkList";
import { InputDateAndroid } from "../components/InputDateAndroid";
import { dateStr, getMoney } from "../utils/convert.utils";
import { addDays } from "../utils/date";


export function Milks({...rest}) {

    const { navigate } = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [milks, setMilks] = useState<MilkCardPros[]>([]);
    const toast = useToast();

    const [dateInit, setDateInit] = useState(new Date());
    const [dateFinal, setDateFinal] = useState(addDays(new Date(), 1));

    async function fetchMilks() {
        try {
            setIsLoading(true)
            const response = await api.get('/milk', {params: {dateInit, dateFinal}});
            setMilks(response.data.milks)
            
        } catch (error) {
            console.log(error);
            alertError(toast, 'Houve um erro ao buscar os registros!')
        } finally {
            setIsLoading(false)
        }

    }

    async function fetchInitialDate() {
        try {
            setIsLoading(true)
            const response = await api.get('/milk/initial-date');
            setDateInit(new Date(response.data.date))
            
        } catch (error) {
            console.log(error);
            alertError(toast, 'Houve um erro ao buscar a data inicial!')
        } finally {
            setIsLoading(false)
        }
    }

    const onDelete = async () => {
        const date = rest.route?.params?.dateInit && new Date(rest.route.params.dateInit) < dateInit ? new Date(rest.route.params.dateInit) : dateInit;
        setDateInit(date);
        await fetchInitialDate();
        await fetchMilks();
    } 

    const valorTotal = () => {
        return getMoney(milks.reduce(function(accumulator,value){
            return accumulator + value.value
          },0) / 100);
    }

    const totalLitros = () => {
        return (milks.reduce(function(accumulator,value){
            return accumulator + value.qty
          },0)).toString().replace('.', ',');
    }

    async function reloadData(){
        await fetchInitialDate();
    }

    async function payout(){
        alertConfirm("Deseja mesmo fazer o pagamento dos registro de " + dateStr(dateInit) + " a " + dateStr(dateFinal) + "?", sendPayments)
    }

    async function sendPayments(){
        try {
            setIsLoading(true)
            const response = await api.put('/milk/payments', {dateInit, dateFinal});
            setMilks(response.data.milks)
            alertSuccess(toast, 'Pagamentos registrados com sucesso!')
            
        } catch (error) {
            console.log(error);
            alertError(toast, 'Houve um erro ao registrar os pagamentos!')
        } finally {
            setIsLoading(false)
        }
    }

    useFocusEffect(useCallback( () => {
        reloadData()
    }, []))

    useEffect(() => {
        fetchMilks()
    }, [dateInit, dateFinal])

    return (
        <VStack flex={1} bgColor="gray.900" >

            <Header title="Registros" />
            <Row flexWrap="wrap" justifyContent="center" mt={4} borderBottomWidth={1}  borderColor="gray.600">
                <InputDateAndroid
                    date={dateInit}
                    setDate={setDateInit}
                    w='40'
                    mr={3}
                    testID="Data Inicial"
                />
                <InputDateAndroid
                    date={dateFinal}
                    setDate={setDateFinal}
                    w='40'
                    ml={3}
                    testID="Data Inicial"
                />
            </Row>
            <Row flexWrap="wrap" justifyContent="center" mt={4} pb={4} borderBottomWidth={1}  borderColor="gray.600">
                <Button title="Atualizar" type="SECONDARY" w={40} ml={4} onPress={() => fetchMilks()} />
                <Button title="Registrar Pagamento" w={40} ml={4} onPress={() => payout()} />
            </Row>

            <Text color='gray.100' ml={5} fontSize={20} w='full' borderBottomWidth={1}  borderColor="gray.600" pb={4} mb={4} >
                Valor Total: {valorTotal()}
                {'\n'}
                Quantidade: {totalLitros()} Litros
            </Text>

            

            {
                isLoading ? <Loading  /> :
                <FlatList
                    data={milks}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                        <HStack
                            w="full"
                            h='32'
                            bgColor="gray.800"
                            borderBottomWidth={3}
                            borderBottomColor="yellow.500"
                            justifyContent="space-between"
                            alignItems="center"
                            rounded="sm"
                            mb={3}
                            mt={2}
                            p={4}
                        >
                            <MilkCard data={item} 
                                setIsLoading={setIsLoading}
                                toast={toast}
                                onDelete={onDelete}
                            />
                        </HStack>
                    )}
                    px={5}
                    showsVerticalScrollIndicator={false}
                    _contentContainerStyle={{
                        pb: 24
                    }}
                    ListEmptyComponent={() => <EmptyMilkList />}
                />
            }
            
        </VStack>
    )
}