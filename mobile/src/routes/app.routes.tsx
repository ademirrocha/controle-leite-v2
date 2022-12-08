import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlusCircle, SoccerBall } from 'phosphor-react-native';
import { useTheme } from 'native-base';

import { Platform } from 'react-native';
import { Milks } from '../screens/Milks';
import { NewMilk } from '../screens/NewMilk';
import { UpdateConfigMilk } from '../screens/updateConfigMilk';

const { Navigator, Screen } = createBottomTabNavigator();
export function AppRoutes() {

    const { colors, sizes } = useTheme();

    const size = sizes[6];

    return (
        <Navigator screenOptions={{
            headerShown: false,
            tabBarLabelPosition: 'beside-icon',
            tabBarActiveTintColor: colors.yellow[500],
            tabBarInactiveTintColor: colors.gray[300],
            tabBarStyle: {
                position: 'absolute',
                height: sizes[22],
                borderTopWidth: 0,
                backgroundColor: colors.gray[800]
            },
            tabBarItemStyle: {
                position: 'relative',
                top: Platform.OS === 'android' ? -10 : 0
            }
        }}>

            <Screen
                name="milks" 
                component={Milks}
                options={{
                    tabBarIcon: ({ color }) => <SoccerBall  color={color} size={size} />,
                    tabBarLabel: 'Lista de Registros'
                }}
            />

            <Screen
                name="newMilk" 
                component={NewMilk}
                options={{
                    tabBarIcon: ({ color }) => <PlusCircle color={color} size={size} />,
                    tabBarLabel: 'Novo Registro'
                }}
            />

            <Screen
                name="updateConfigMilk" 
                component={UpdateConfigMilk}
                options={{ tabBarButton: () => null }}
            />

        </Navigator>
    )
}