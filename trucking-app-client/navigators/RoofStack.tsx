import React, { FunctionComponent } from 'react'

import Welcome from '../screens/Welcome'
import Home from '../screens/Home'
import Balance from '../screens/Balance'

import { colors } from '../components/colors'

import { Ionicons } from "@expo/vector-icons";

// React Naviation 
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Greeting from '../components/Header/Greeting'
import Profile from '../components/Header/Profile'

import { CardProps } from '../components/Cards/types'

export type RoofStackParamList = {
    Welcome: undefined
    Home: undefined
    Balance: CardProps
}

const Stack = createStackNavigator<RoofStackParamList>();

const RoofStack: FunctionComponent = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.graylight,
                        borderBottomWidth: 0,
                        shadowColor: "transparent",
                        shadowOpacity: 0,
                        elevation: 0,
                        height: 120
                    },
                    headerTintColor: colors.secondary,
                    headerRightContainerStyle: {
                        paddingRight: 25,
                    },
                    headerLeftContainerStyle: {
                        paddingRight: 10,
                    },
                    headerRight: () => <Profile
                        imageContainerStyle={{ backgroundColor: colors.tertiary }}
                    />
                }}
                initialRouteName='Balance'
            >
                <Stack.Screen
                    name="Welcome"
                    component={Welcome}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{
                        headerTitle: (props) => <Greeting
                            mainText='Hello User'
                            subText='Welcome back'
                            {...props}
                        />,
                        headerTitleAlign: 'left',
                        headerLeft: () => <></>
                    }}
                />
                <Stack.Screen
                    name="Balance"
                    component={Balance}
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
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RoofStack