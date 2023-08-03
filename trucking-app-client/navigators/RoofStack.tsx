import React, { FunctionComponent } from 'react'
import { Text } from 'react-native'
import Welcome from '../screens/Welcome'
import Home from '../screens/Home/Home'
import Tickets from '../screens/Tickets/Tickets'

import { colors } from '../components/colors'

import { Ionicons } from "@expo/vector-icons";

// React Naviation 
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Greeting from '../components/Header/Greeting'
import Profile from '../components/Header/Profile'
import { User } from '../models/User'
import { Company } from '../models/Company'
import { IconButton, useTheme } from 'react-native-paper'
import Account from '../screens/Account/Account'
import { AuthController } from '../controllers/AuthController'


export type RoofStackParamList = {
    Welcome: undefined
    Home: {
        company: Company
    }
    Tickets: {
        dispId: number,
        rfoId?: number,
        billId?: number,
    },
    Account: {
        company: Company
    }
}

const Stack = createStackNavigator<RoofStackParamList>();

const RoofStack: FunctionComponent = () => {
    const theme = useTheme();

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={({ navigation }) => ({
                    headerStyle: {
                        backgroundColor: colors.graylight,
                        borderBottomWidth: 0,
                        shadowColor: "transparent",
                        shadowOpacity: 0,
                        elevation: 0,
                        height: 100
                    },
                    headerTintColor: colors.secondary,
                    headerRightContainerStyle: {
                        paddingRight: 25,
                    },
                    headerLeftContainerStyle: {
                        paddingRight: 10,
                    },
                    headerRight: () => <IconButton
                        size={25}
                        containerColor={theme.colors.primary}
                        iconColor={'white'}
                        background={theme.colors.secondary}
                        icon={'account'}
                        onPress={async () => {
                            const company = await AuthController.getCompany();
                            navigation.navigate("Account", { company })
                        }}
                    />
                })}
                initialRouteName='Welcome'
            >
                <Stack.Screen
                    name="Welcome"
                    component={Welcome}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Home"

                    component={Home}
                    options={({ route }) => ({
                        headerTitle: props => {
                            return <Greeting
                                mainTextSubStyles={{ fontSize: 20 }}
                                mainText={`${route.params?.company.company_name ?? "Hello User"}`}
                                subText='Welcome back'
                                {...props}
                            />
                        },
                        headerTitleAlign: 'left',
                        headerLeft: null,
                    })}
                />

                <Stack.Screen
                    name="Tickets"
                    component={Tickets}
                    options={({ route }) => ({
                        headerTitle: route?.params?.alias,
                        headerTitleAlign: 'center',
                        headerBackImage: (props) => (
                            <Ionicons
                                {...props}
                                name="chevron-back"
                                size={25}
                                color={colors.secondary}
                            />
                        ),
                        headerLeftContainerStyle: {
                            paddingLeft: 0
                        }
                    })}
                />
                <Stack.Screen
                    name="Account"
                    component={Account}
                    options={({ route }) => ({
                        headerRight: props => {
                            return <Greeting
                                mainTextSubStyles={{ fontSize: 20 }}
                                subTextStyles={{ textAlign: 'right' }}
                                mainText={`${route.params?.company.company_name ?? "Hello User"}`}
                                subText='Welcome back'
                                {...props}
                            />
                        },
                        headerTitle: props => { },
                    })}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RoofStack