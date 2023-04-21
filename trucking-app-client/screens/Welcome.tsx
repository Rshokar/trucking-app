import React, { FunctionComponent, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import styled from 'styled-components/native'
import { TouchableOpacity } from 'react-native'

import BigText from '../components/Texts/BigText'
// import RegularText from '../components/Texts/RegularText'
import SmallText from '../components/Texts/SmallText'
import RegularButton from '../components/Buttons/RegularButton'
import { LoginFormResult, RegisterFormResult } from '../components/Forms/types'
import Form from '../components/Forms/Form'
import LoginForm from '../components/Forms/LoginForm'
import RegisterForm from '../components/Forms/RegisterForm'
import SwipeDownViewAnimation from '../components/Animated/SwipeDownViewAnimation'
import { AuthController } from '../controllers/AuthController'
import { User } from '../models/User'

// Custom Components
import { colors } from '../components/colors'
import { Container } from '../components/shared'

const WelcomContainer = styled(Container)`
    background-color: ${colors.secondary};
    justify-content: space-between;
    width: 100%;
    height: 100%;
`

const TopSection = styled.View`
    width: 100%;
    flex: 1;
    max-height: 55%;
`

const TopImage = styled.Image`
    width: 100%; 
    height: 100%; 
    resize-mode: stretch;
`

const BottomSection = styled.View`
    width: 100%; 
    padding: 25px;
    flex: 1;
    justify-content: flex-end;
`

const FormSwitchText = styled.Text`
    padding-left: 5px;
    margin-top: 5px;
    color: ${colors.tertiary}
`



import { RoofStackParamList } from '../navigators/RoofStack'
import { StackScreenProps } from '@react-navigation/stack'

import background from '../assets/welcome.png'



type Props = StackScreenProps<RoofStackParamList, "Welcome">

const Welcome: FunctionComponent<Props> = ({ navigation }) => {


    const [showLogin, setShowLogin] = useState<boolean>(true)
    const [showAuth, setShowAuth] = useState<boolean>(false)

    const hideAuth = () => setShowAuth(false)

    const handleLogin = (res: LoginFormResult): any => {
        console.log("HANDLE LOGIN: ", res)
    }

    const handleRegister = async (res: RegisterFormResult): Promise<any> => {
        console.log("HANDLE REGISTER: ", res)
        let user: User = new User(undefined, res.acType, res.email, res.password)
        console.log("USER: ", user)
        try {
            user = await AuthController.register(user)
        } catch (e: any) {
            console.log("Welcome Error", e.message)
        }
    }



    return (
        <>
            <StatusBar style='light' />
            <WelcomContainer>
                <TopSection >
                    <TopImage source={background} />
                </TopSection>
                <BottomSection >
                    <BigText textStyle={{ width: "70%", marginBottom: 25 }}>
                        Paper Less Trucking
                    </BigText>
                    <SmallText textStyle={{ width: "70%", marginBottom: 25 }}>
                        Drop the books and pick up the future
                    </SmallText>
                    <RegularButton onPress={() => setShowAuth(true)}>
                        Get Started
                    </RegularButton>
                </BottomSection>
                <SwipeDownViewAnimation show={showAuth} close={hideAuth} VH={showLogin ? .70 : .95}>
                    {
                        showLogin ?
                            <>
                                <Form>
                                    <BigText textStyle={{ color: colors.primary }}>Welcome Back</BigText>
                                    <SmallText textStyle={{ color: colors.secondary }}>Welcome to the trucking app, enter you credentials and lets started</SmallText>
                                    <LoginForm onSubmit={handleLogin} />
                                    <SmallText
                                        textStyle={{ textAlign: 'center', color: colors.secondary }}>
                                        Dont't have an account?
                                        <TouchableOpacity onPress={() => { console.log("SWITCH TO REGISTER"); setShowLogin(false) }}>
                                            <FormSwitchText>Sign up</FormSwitchText>
                                        </TouchableOpacity>
                                    </SmallText>
                                </Form>
                            </>
                            :
                            <>
                                <Form>
                                    <BigText textStyle={{ color: colors.primary }}>Create an Account </BigText>
                                    <SmallText textStyle={{ color: colors.secondary }}>Welcome to the trucking app, enter you credentials and lets started</SmallText>
                                    <RegisterForm onSubmit={handleRegister} />
                                    <SmallText
                                        textStyle={{ textAlign: 'center', color: colors.secondary }}>
                                        Already have an account?
                                        <TouchableOpacity onPress={() => { console.log("SWITCH TO LOGIN"); setShowLogin(true) }}>
                                            <FormSwitchText>Login</FormSwitchText>
                                        </TouchableOpacity>
                                    </SmallText>
                                </Form>
                            </>

                    }
                </SwipeDownViewAnimation>
            </WelcomContainer>
        </>
    )
}

export default Welcome