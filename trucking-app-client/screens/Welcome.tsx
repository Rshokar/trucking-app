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
import FlashAnimation from '../components/Animated/FlashAnimation'



type Props = StackScreenProps<RoofStackParamList, "Welcome">

const Welcome: FunctionComponent<Props> = ({ navigation }) => {


    const [showLogin, setShowLogin] = useState<boolean>(true)
    const [showAuth, setShowAuth] = useState<boolean>(false)
    const [flashMessage, setFlashMessage] = useState<string>("")

    const hideAuth = () => setShowAuth(false)

    const handleLogin = (res: LoginFormResult): any => {
        console.log("HANDLE LOGIN: ", res)
    }

    const handleRegister = async (res: RegisterFormResult): Promise<any> => {
        console.log("HANDLE REGISTER: ", res)
        let u: User = new User(undefined, res.acType, res.email, res.password)
        console.log("USER: ", u)
        try {
            const { user, company } = await AuthController.register(u, res.company)
            console.log("USER: ", user)
            console.log("COMPANY: ", company)

            // Indicate successful registration
            setFlashMessage("Welcome to the future")
        } catch (e: any) {
            console.log(e.message)
            // Deal with errors
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
                <SwipeDownViewAnimation show={showAuth} close={hideAuth} VH={showLogin ? .80 : .95}>
                    <Form>
                        <BigText textStyle={{ color: colors.primary }}>{showLogin ? "Welcome Back" : "Create an Account"}</BigText>
                        <SmallText textStyle={{ color: colors.secondary }}>
                            {showLogin ? "Welcome to the trucking app, enter you credentials and lets started" : "Welcome to the trucking app, enter you credentials and lets started"}
                        </SmallText>
                        <FlashAnimation onAnimationBegin={() => setShowLogin(true)}>
                            {flashMessage}
                        </FlashAnimation>
                        {
                            showLogin ? <LoginForm onSubmit={handleLogin} /> : <RegisterForm onSubmit={handleRegister} />
                        }
                        <SmallText
                            textStyle={{ textAlign: 'center', color: colors.secondary }}>
                            {showLogin ? "Don't have an account?" : "Already have an account?"}
                            <TouchableOpacity onPress={showLogin ? () => setShowLogin(false) : () => setShowLogin(true)}>
                                <FormSwitchText>
                                    {showLogin ? "Create an account" : "Login"}
                                </FormSwitchText>
                            </TouchableOpacity>
                        </SmallText>
                    </Form>
                </SwipeDownViewAnimation>
            </WelcomContainer>
        </>
    )
}

export default Welcome