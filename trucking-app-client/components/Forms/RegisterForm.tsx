import React, { FunctionComponent, useEffect, useState } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { Animated, View, Text } from 'react-native'
import styled from 'styled-components/native'
import RegularButton from '../Buttons/RegularButton'
import Input from './Inputs/Input'
import SelectInput from './Inputs/SelectInput'
import { colors } from '../colors'
import { FormProps, RegisterFormResult } from './types'

const initialValues: RegisterFormResult = {
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    acType: 'dispatcher'
}

const AnimatedView = styled.View<{ show: boolean }>`
    display: flex; 
    flex-direction: column; 
    justify-content: center; 
    align-items: center;
    height: ${props => props.show ? "auto" : '0'}
    gap: 20px;
    width: 100%;
    overflow: hidden;e
    transition: all 0.2s ease-in-out
`

const RegisterForm: FunctionComponent<FormProps<RegisterFormResult>> = (props) => {
    const [step, setStep] = useState<number>(1)
    const [results, setResults] = useState({});

    const StepOneSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string()
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Password is required')
    })

    const StepTwoSchema = Yup.object().shape({
        company: Yup.string().required('Company name is required').min(4, 'Company name must be longer than 4 characters'),
        acType: Yup.string().test('valid-acType', 'Invalid account type', value => {
            return value === 'dispatcher' || value === 'operator'
        })
    })

    const acTypeOptions = [
        { label: 'Dispatcher', value: 'dispatcher' },
        { label: 'Operator', value: 'operator' }
    ]

    return (
        <>
            <Formik
                initialValues={initialValues}
                onSubmit={(val) => {
                    setResults(val);
                    setStep(2)
                }}
                validationSchema={StepOneSchema}
            >
                {({ handleChange, handleBlur, handleSubmit, isValid, values, errors, touched }) => (
                    <AnimatedView show={step === 1}>
                        <Input
                            name="email"
                            errorProps={{ error: errors.email, touched: touched.email }}
                            placeholder="Email"
                            keyboardType="email-address"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                        />

                        <Input
                            name="password"
                            errorProps={{ error: errors.password, touched: touched.password }}
                            placeholder="Password"
                            secureTextEntry={true}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                        />

                        <Input
                            name="confirmPassword"
                            errorProps={{ error: errors.confirmPassword, touched: touched.confirmPassword }}
                            placeholder="Confirm Password"
                            secureTextEntry={true}
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            value={values.confirmPassword}
                        />

                        <RegularButton onPress={() => handleSubmit()} disabled={!isValid}>
                            Next
                        </RegularButton>
                    </AnimatedView>
                )}
            </Formik>

            <Formik
                initialValues={initialValues}
                onSubmit={(res: RegisterFormResult) => {
                    props.onSubmit({ ...res, ...results })
                }}
                validationSchema={StepTwoSchema}
            >
                {({ handleChange, handleBlur, handleSubmit, isValid, values, errors, touched }) => (
                    <AnimatedView show={step === 2}>
                        <Input
                            name="company"
                            errorProps={{ error: errors.company, touched: touched.company }}
                            placeholder="Company"
                            onChangeText={handleChange('company')}
                            onBlur={handleBlur('company')}
                            value={values.company}
                        />
                        {errors.company && touched.company && <Text>{errors.company}</Text>}

                        <SelectInput
                            options={acTypeOptions}
                            onChange={handleChange('acType')}
                            errorProps={{ error: errors.acType, touched: touched.acType }}
                            name="acType"
                            value={values.acType}
                        />
                        {errors.acType && touched.acType && <Text>{errors.acType}</Text>}

                        <RegularButton onPress={() => handleSubmit()} disabled={!isValid}>
                            Register
                        </RegularButton>
                        <RegularButton
                            btnStyles={{ backgroundColor: colors.primary }}
                            onPress={() => {
                                setStep(1)
                            }}
                        >
                            Back
                        </RegularButton>
                    </AnimatedView>
                )}
            </Formik>
        </>
    )
}

export default RegisterForm
