import React, { FunctionComponent, } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { Animated, View, Text } from 'react-native'
import { TextInput } from 'react-native-paper'
import { colors } from '../colors'
import { FormProps, RegisterFormResult } from './types'
import { Button, useTheme } from 'react-native-paper'
import { InputBox, ErrorText, DualInput } from './styles'

const initialValues: RegisterFormResult = {
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
}

const RegisterForm: FunctionComponent<FormProps<RegisterFormResult>> = (props) => {
    const theme = useTheme();

    const StepOneSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string()
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Password is required'),
        company: Yup.string().required('Company name is required').min(4, 'Company name must be longer than 4 characters'),
    })


    return (
        <>
            <Formik
                initialValues={initialValues}
                onSubmit={async (val: RegisterFormResult, { setSubmitting }) => {
                    await props.onSubmit(val);
                    setSubmitting(false);
                }}
                validationSchema={StepOneSchema}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting }) => (
                    <>

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
                                label={"Company Name"}
                                value={values.company}
                                placeholder='AKS Trucking Ltd'
                                onChangeText={handleChange('company')}
                                onBlur={handleBlur('company')}
                                error={!!errors.company}
                            />
                            {errors.company && <ErrorText>{errors.company}</ErrorText>}
                        </InputBox>
                        <DualInput>
                            <InputBox style={{ flex: 1 }}>
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

                            <InputBox style={{ flex: 1 }}>
                                <TextInput
                                    label={"Confirm Password"}
                                    value={values.confirmPassword}
                                    placeholder='**************'
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    error={!!errors.confirmPassword}
                                    secureTextEntry={true}
                                />
                                {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
                            </InputBox>
                        </DualInput>

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
                )}
            </Formik>
        </>
    )
}

export default RegisterForm
