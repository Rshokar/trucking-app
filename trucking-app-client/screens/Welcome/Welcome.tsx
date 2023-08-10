import React, { FunctionComponent, useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import styled from 'styled-components/native'
import { TouchableOpacity } from 'react-native'
import { Button, Snackbar, Text } from 'react-native-paper'

import BigText from '../../components/Texts/BigText'
import SmallText from '../../components/Texts/SmallText'
import { LoginFormResult, RegisterFormResult } from '../../components/Forms/types'
import Form from '../../components/Forms/Form'
import LoginForm from '../../components/Forms/LoginForm'
import RegisterForm from '../../components/Forms/RegisterForm'
import SwipeDownViewAnimation from '../../components/Animated/SwipeDownViewAnimation'
import { AuthController } from '../../controllers/AuthController'
import { User } from '../../models/User'
import { FIREBASE_AUTH } from '../../config/firebaseConfig'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'


// Custom Components
import { colors } from '../../components/colors'
import { Container } from '../../components/shared'

const WelcomContainer = styled(Container)`
    background-color: ${colors.secondary};
    justify-content: space-between;r
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
    color: ${colors.tertiary};
`



import { RoofStackParamList } from '../../navigators/RoofStack'
import { StackScreenProps } from '@react-navigation/stack'

import background from '../../assets/welcome.png'
import FlashAnimation from '../../components/Animated/FlashAnimation'



type Props = StackScreenProps<RoofStackParamList, "Welcome">

const Welcome: FunctionComponent<Props> = ({ navigation }) => {


    const [showLogin, setShowLogin] = useState<boolean>(true)
    const [showAuth, setShowAuth] = useState<boolean>(false)
    const [flashMessage, setFlashMessage] = useState<string>("")
    const [flashColor, setFlashColor] = useState<string>(colors.success)
    const [flashToggle, setFlashToggle] = useState<boolean>(false);

    const hideAuth = () => setShowAuth(false)

    // We want to check if the current user is logged in
    // If they are logged in then we will redirect to home
    useEffect(() => {
        const subscriber = onAuthStateChanged(FIREBASE_AUTH, async user => {
            if (user) {
                navigation.navigate("Home", { company: await AuthController.getCompany() });
            }
        });
        return subscriber; // unsubscribe on unmount
    }, []);


    const handleLogin = async (res: LoginFormResult): Promise<any> => {

        let u: User = new User()
        u.email = res.email
        u.password = res.password
        try {
            const res = await signInWithEmailAndPassword(FIREBASE_AUTH, u.email, u.password);
            const user = await AuthController.login(u);
            setFlashColor(colors.success)
            setFlashMessage("Successfully Loggd In")
            setFlashToggle(!flashToggle)
            setTimeout(async () => navigation.navigate("Home", { company: await AuthController.getCompany() }), 2000)
        } catch (e: any) {
            setFlashMessage(e.message)
            setFlashColor("red")
            setFlashToggle(!flashToggle)
        }
    }

    const handleRegister = async (formResult: RegisterFormResult): Promise<any> => {
        let u: User = new User()
        u.role = formResult.acType;
        u.password = formResult.password;
        u.email = formResult.email;
        console.log(formResult)
        try {
            const res = await createUserWithEmailAndPassword(FIREBASE_AUTH, u.email, u.password);
            console.log(await res.user.getIdToken())
            await AuthController.setJWTToken(await res.user.getIdToken())
            await AuthController.register(u, formResult.company, res.user.uid)
            setFlashColor(colors.success)
            setFlashMessage("Successfully Registered")
            setFlashToggle(!flashToggle)
            setShowLogin(true);
            setTimeout(async () => navigation.navigate("Home", { company: await AuthController.getCompany() }), 2000)
        } catch (e: any) {
            console.log(e.message)
            setFlashColor(colors.red)
            setFlashMessage(e.message)
            setFlashToggle(!flashToggle)
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
                    <Button style={{ backgroundColor: colors.primary }} onPress={() => setShowAuth(true)}>
                        <Text style={{ color: 'white' }}>

                            Get Started
                        </Text>
                    </Button>
                </BottomSection>
                <SwipeDownViewAnimation show={showAuth} close={hideAuth} VH={.95}>
                    <Form>
                        <BigText textStyle={{ color: colors.primary }}>{showLogin ? "Welcome Back" : "Create an Account"}</BigText>
                        <SmallText textStyle={{ color: colors.secondary }}>
                            {showLogin ? "Welcome to the trucking app, enter you credentials and lets started" : "Welcome to the trucking app, enter you credentials and lets started"}
                        </SmallText>
                        <FlashAnimation
                            toggle={flashToggle}
                            onAnimationBegin={!showLogin ? () => setShowLogin(true) : undefined}
                            color={flashColor}
                        >
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