import React, { useState, FC, useEffect } from 'react'
import styled from 'styled-components/native'
import LoginForm from '../../../components/Forms/LoginForm'
import RegisterForm from '../../../components/Forms/RegisterForm'
import { LoginFormResult, RegisterFormResult } from '../../../components/Forms/types'
import ForgotPassword from '../../../components/ForgotPassword'


import { Text, useTheme } from 'react-native-paper'


const Container = styled.View`
    display: flex; 
    flex-directio: column;
    justify-content: flex-start; 
    padding-horizontal: 5%;
    padding-vertical: 10%;
    align-items: center; 
    width: 100%; 
    gap: 20px;
`

const ActionContainer = styled.View`
    flex-direction: row; 
`

const ActionButton = styled.TouchableOpacity`
    justify-content: flex-end;
    padding-left: 5px; 
`

type Props = {
    handleLogin: (formRes: LoginFormResult) => Promise<any>,
    handleRegister: (formResult: RegisterFormResult) => Promise<any>
    toggleLogin: boolean,
}

type ActionProps = {
    message: string,
    actionMessage: string,
    action: () => any,
    color: string
}

type HeadProps = {
    title: string,
    subTitle?: string,
    titleColor: string,
    subTitleColor: string,
}

const Action: FC<ActionProps> = ({ message, actionMessage, action, color }) => <ActionContainer>
    <Text>
        {message}
    </Text>
    <ActionButton onPress={action}>
        <Text style={{ color: color }}>
            {actionMessage}
        </Text>
    </ActionButton>
</ActionContainer>

const Head: FC<HeadProps> = ({ title, subTitle, titleColor, subTitleColor }) => <>
    <Text style={{ color: titleColor }} variant='displaySmall'>{title}</Text>
    {subTitle && <Text style={{ color: subTitleColor, textAlign: 'center' }} variant='bodyLarge'>{subTitle}</Text>}
</>

const AuthSection: FC<Props> = ({ handleLogin, handleRegister, toggleLogin }) => {
    const theme = useTheme();
    const [forgotPassword, setForgotPassword] = useState<boolean>(false);
    const [login, setLogin] = useState<boolean>(true);

    useEffect(() => {
        setLogin(toggleLogin)
        setForgotPassword(false);
    }, [toggleLogin])

    const showLogin = () => {
        setForgotPassword(false)
        setLogin(true);
    }
    const showRegister = () => {
        setForgotPassword(false)
        setLogin(false);
    }

    const showForgotPassword = () => setForgotPassword(true)

    if (forgotPassword) {
        return <Container>
            <Head
                title="Forgot password?"
                titleColor={theme.colors.primary}
                subTitleColor={theme.colors.secondary}
            />
            <ForgotPassword showLogin={() => setLogin(true)} />
            <Action
                message=''
                actionMessage='Remember your password?'
                action={showLogin}
                color={theme.colors.tertiary}
            />
        </Container>
    } else if (login) {
        // Show Login 
        return <Container>
            <Head
                title="Welcome Back"
                subTitle='Welcome to the trucking app, enter you credentials and lets get started'
                titleColor={theme.colors.primary}
                subTitleColor={theme.colors.secondary}
            />
            <LoginForm onSubmit={handleLogin} />
            <Action
                message='Need an account?'
                actionMessage='Create an account.'
                action={showRegister}
                color={theme.colors.tertiary}
            />
            <Action
                message={''}
                actionMessage={'Forgot you password?'}
                action={showForgotPassword}
                color={theme.colors.tertiary}
            />
        </Container>
    } else {
        return <Container>
            <Head
                title="Create an Account"
                subTitle='Welcome to the trucking app, register and lets get started'
                titleColor={theme.colors.primary}
                subTitleColor={theme.colors.secondary}
            />
            <RegisterForm onSubmit={handleRegister} />
            <Action
                message='Already have an account?'
                actionMessage='Register.'
                action={showLogin}
                color={theme.colors.tertiary}
            />
        </Container>
    }
}

export default AuthSection