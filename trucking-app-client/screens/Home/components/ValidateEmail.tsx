import React from 'react'
import { View } from 'react-native'
import { Button, Text, useTheme } from 'react-native-paper'
import styled from 'styled-components/native'
import UserController from '../../../controllers/UserController'
import useSnackbar from '../../../hooks/useSnackbar'
import EngineSVG from '../../../assets/svgs/EngineSVG'


const ValidateEmailStyledView = styled(View)`
    display: flex; 
    flex-direction: column;
    justify-content: space-between;
    align-items: center; 
    gap: 20px;
    padding: 20px; 
    padding-bottom: 80px;
    height: 100%;

`
type Props = {
    onCompletion: () => void;
}

const ValidateEmail = (props: Props) => {

    const { showSnackbar } = useSnackbar();


    const checkAgain = async () => {
        if (await UserController.checkEmailValidation()) {
            props.onCompletion();
        } else {
            showSnackbar({
                message: "Email not validated",
                color: theme.colors.error,
                onClickText: 'Ok'
            })
        }
    }

    const sendValidationEmail = async () => {
        try {
            await UserController.sendEmailValidationEmail();
            showSnackbar({
                message: "Email sent",
                color: theme.colors.primary,
                onClickText: 'Ok'
            })
        } catch (err: any) {
            showSnackbar({
                message: err.message,
                color: theme.colors.error,
                onClickText: 'Ok'
            })
        }
    }

    const theme = useTheme();
    return (
        <ValidateEmailStyledView>
            <View style={{ width: '100%', height: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                <View style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
                    <EngineSVG />
                    <View>
                        <Text variant='titleMedium' style={{ textAlign: 'center' }}>Validate Email</Text>
                        <Text variant='bodyLarge' style={{ textAlign: 'center' }}>We’ve sent a verification link to your email. Click on the link to proceed</Text>
                    </View>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
                    <Button mode='contained' style={{ minWidth: '80%' }} onPress={checkAgain}>
                        <Text variant='labelLarge' style={{ color: theme.colors.white }}>
                            Check Again
                        </Text>
                    </Button>
                    <Button
                        mode='contained'
                        style={{ minWidth: 200, backgroundColor: theme.colors.secondary }}
                        onPress={sendValidationEmail}
                    >
                        <Text variant='labelSmall' style={{ color: theme.colors.white }}>
                            Resend Email
                        </Text>
                    </Button>
                </View>
            </View>
            <View>
                <Text variant='bodySmall' style={{ textAlign: 'center' }}>
                    If you don't receive the email within a few minutes, check your spam folder or click below to resend the verification link.
                </Text>
            </View>
        </ValidateEmailStyledView>
    )
}

export default ValidateEmail