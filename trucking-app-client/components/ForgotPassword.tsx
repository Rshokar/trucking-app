import React, { useState, FC } from 'react'
import { View } from 'react-native';
import EmailForm from './Forms/ForgotPassowrdForms/EmailForm';
import CodeForm from './Forms/ForgotPassowrdForms/CodeForm';
import NewPasswordForm from './Forms/ForgotPassowrdForms/NewPasswordForm';
import { Text, useTheme } from 'react-native-paper'
import UserController from '../controllers/UserController';
import useSnackbar from '../hooks/useSnackbar';
import { AuthController } from '../controllers/AuthController';

type ForgotPasswordProps = {
    done: () => void;
}

enum STEPS {
    EMAIL = 1,
    CODE = 2,
    PASSWORD = 3,
}

const ForgotPassword: FC<ForgotPasswordProps> = ({ done }) => {
    const [step, setStep] = useState<STEPS>(STEPS.EMAIL);
    const [resetPasswordToken, setResetPasswordToken] = useState<string>();
    const [email, setEmail] = useState<string>();
    const theme = useTheme();
    const { showSnackbar } = useSnackbar();

    const sendVerificationCode = async (values: { email: string }): Promise<void> => {
        try {
            await UserController.sendForgotPasswordCode(values.email);
            setEmail(values.email);
            setStep(STEPS.CODE)
        } catch (err: any) {
            showSnackbar({
                message: err.message,
                color: theme.colors.error,
            })
        }
    }

    const validateCode = async (values: { code: string }): Promise<void> => {
        console.log(values);

        try {
            setResetPasswordToken(await UserController.validateForgotPasswordCode(values.code, email + ''))
            setStep(STEPS.PASSWORD);
        } catch (err: any) {
            showSnackbar({
                message: err.message,
                color: theme.colors.error,
            })
        }
    }

    const updatePassword = async (values: { password: string }): Promise<void> => {
        console.log(values);

        try {
            await UserController.updatePassword(values.password, resetPasswordToken + '', email + '');
            done();
        } catch (err: any) {
            showSnackbar({
                message: err.message,
                color: theme.colors.error,
            })
        }
    }

    console.log(email, resetPasswordToken);

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
        return <>
            <View>
                <Text variant='bodyLarge' style={{ textAlign: 'center', color: theme.colors.secondary }}>If your email was found we sent you a six digit code. Enter it bellow.</Text>
            </View>
            <CodeForm onSubmit={validateCode} />
        </>
    } else {
        // New Password
        return <>
            <View>
                <Text variant='bodyLarge' style={{ textAlign: 'center', color: theme.colors.secondary }}>Sucess, enter your new password.</Text>
            </View>
            <NewPasswordForm onSubmit={updatePassword} />
        </>
    }
}

export default ForgotPassword