import React, { FunctionComponent, useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import styled from 'styled-components/native'
import { TouchableOpacity } from 'react-native'
import { Snackbar } from 'react-native-paper'

import BigText from '../../components/Texts/BigText'
import SmallText from '../../components/Texts/SmallText'
import RegularButton from '../../components/Buttons/RegularButton'
import { LoginFormResult, RegisterFormResult } from '../../components/Forms/types'
import Form from '../../components/Forms/Form'
import LoginForm from '../../components/Forms/LoginForm'
import RegisterForm from '../../components/Forms/RegisterForm'
import SwipeDownViewAnimation from '../../components/Animated/SwipeDownViewAnimation'
import { AuthController } from '../../controllers/AuthController'
import { User } from '../../models/User'

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
        const run = async () => {
            try {
                await AuthController.isUserAuthed();
                navigation.navigate("Home", { company: await AuthController.getCompany() })
            } catch (err: any) {
            }
        }
        run();
    }, [])

    const handleLogin = async (res: LoginFormResult): Promise<any> => {
        let u: User = new User()
        u.email = res.email
        u.password = res.password
        try {
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

    const handleRegister = async (res: RegisterFormResult): Promise<any> => {
        let u: User = new User()
        u.role = res.acType;
        u.password = res.password;
        u.email = res.email;
        try {
            await AuthController.register(u, res.company)
            setFlashColor(colors.success)
            setFlashMessage("Registered. Please Login. ")
            setFlashToggle(!flashToggle)
            setShowLogin(true);

        } catch (e: any) {
            console.log(e.message)
            setFlashColor(colors.red)
            setFlashMessage(e.message)
            setFlashToggle(!flashToggle)
            // Deal with errors
        } finally {

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
                    <RegularButton btnStyles={{ backgroundColor: colors.primary }} onPress={() => setShowAuth(true)}>
                        Get Started
                    </RegularButton>
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