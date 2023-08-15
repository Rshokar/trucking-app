import React, { FunctionComponent } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Input from './Inputs/Input'
import { LoginFormResult } from './types'

import { FormProps } from './types'
import { Button, Text, TextInput, useTheme } from 'react-native-paper'
import { ErrorText, InputBox } from './styles'

const intialValues: LoginFormResult = { email: '', password: '' }
const LoginForm: FunctionComponent<FormProps<LoginFormResult>> = (props) => {

    const theme = useTheme();


    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string()
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.')
            .required('Password is required')
    })

    return <Formik initialValues={intialValues} onSubmit={async (data: LoginFormResult, { setSubmitting }) => {
        await props.onSubmit(data);
        setSubmitting(false)
    }}
        validationSchema={validationSchema}
    >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => <>
            <InputBox>
                <TextInput
                    label={"Email"}
                    value={values.email}
                    placeholder='trucking@tare.com'
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    error={!!errors.email}
                />
                {errors.email && <ErrorText>{errors.email}</ErrorText>}
            </InputBox>
            <InputBox>
                <TextInput
                    label={"Password"}
                    value={values.password}
                    placeholder='**************'
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    error={!!errors.password}
                    secureTextEntry={true}
                />
                {errors.password && <ErrorText>{errors.password}</ErrorText>}
            </InputBox>
            <Button
                mode="contained"
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
                style={{
                    marginTop: 10,
                    backgroundColor: isSubmitting ? theme.colors.onSurfaceDisabled : theme.colors.primary,
                    width: '100%',
                }}
            >
                {isSubmitting ? "Submitting...." : "Login"}
            </Button>
        </>
        }
    </Formik>
}

export default LoginForm