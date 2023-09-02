import React, { useState, FC } from 'react'
import { View } from 'react-native';
import EmailForm from './Forms/ForgotPassowrdForms/EmailForm';
import CodeForm from './Forms/ForgotPassowrdForms/CodeForm';
import NewPasswordForm from './Forms/ForgotPassowrdForms/NewPasswordForm';
import { Text, useTheme } from 'react-native-paper'
type ForgotPasswordProps = {
    showLogin: () => void;
}

enum STEPS {
    EMAIL = 1,
    CODE = 2,
    PASSWORD = 3,
}

const ForgotPassword: FC<ForgotPasswordProps> = () => {
    const [step, setStep] = useState<STEPS>(STEPS.EMAIL);
    const theme = useTheme();

    const sendVerificationCode = async (values: { email: string }): Promise<void> => {
        console.log(values);
    }

    const validateCode = async (values: { code: string }): Promise<void> => {

    }

    const updatePassword = async (values: { password: string }): Promise<void> => {

    }

    if (step === STEPS.EMAIL) {
        // Enter Email
        return <>
            <View>
                <Text variant='bodyLarge' style={{ textAlign: 'center', color: theme.colors.secondary }}>We are going to email you a code if we find your email.</Text>
            </View>
            <EmailForm onSubmit={sendVerificationCode} />
        </>
    } else if (step === STEPS.CODE) {

        // Enter Code
        return <CodeForm onSubmit={validateCode} />
    } else {
        // New Password
        return <NewPasswordForm onSubmit={updatePassword} />
    }
}

export default ForgotPassword