import { ConfigValueLeite } from "../screens/NewMilk"

export declare global {
    namespace ReactNavigation {
        interface RootParamList {
            newMilk: undefined,
            milks: {
                dateInit?: Date|string
            },
            updateConfigMilk: {
                configValue: ConfigValueLeite,
                setConfigValue: Function
            }

        }
    }
}