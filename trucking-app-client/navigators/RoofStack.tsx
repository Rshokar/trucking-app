import React, { FunctionComponent } from 'react'

import Welcome from '../screens/Welcome'
import Home from '../screens/Home'
import { colors } from '../components/colors'

// React Naviation 
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Greeting from '../components/Header/Greeting'
import Profile from '../components/Header/Profile'


export type RoofStackParamList = {
    Welcome: undefined
    Home: undefined
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
                initialRouteName='Home'
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
                        headerLeft: () => <></>
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RoofStack