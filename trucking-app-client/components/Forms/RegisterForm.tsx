import React, { FunctionComponent } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { TextInput } from 'react-native-gesture-handler'

import RegularButton from '../Buttons/RegularButton'
import { StyledInputeView, StyledErrorView } from './style'

import { FormProps, RegisterFormResult } from './types'

const intialValues: RegisterFormResult = { email: '', password: '', confirmPassword: '', company: '', acType: 'dispatcher' }
const RegisterForm: FunctionComponent<FormProps<RegisterFormResult>> = (props) => {

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string()
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Password is required'),
        company: Yup.string().required('Company name is requires').length(4, "Company name must be longer than 4 characters"),
        acType: Yup.string().test('valid-acType', 'Invalid account type', value => {
            return value === 'dispatcher' || value === 'operator';
        })
    });


    return (
        <Formik
            initialValues={intialValues}
            onSubmit={props.onSubmit}
            validationSchema={validationSchema}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <StyledInputeView>
                        <TextInput
                            placeholder="Email"
                            keyboardType="email-address"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                        />
                    </StyledInputeView>

                    {errors.email && touched.email && <StyledErrorView>{errors.email}</StyledErrorView>}
                    <StyledInputeView>
                        <TextInput
                            placeholder="Password"
                            secureTextEntry={true}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                        />
                    </StyledInputeView>
                    {errors.password && touched.password && <StyledErrorView>{errors.password}</StyledErrorView>}
                    <StyledInputeView>
                        <TextInput
                            placeholder="Confirm password"
                            secureTextEntry={true}
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            value={values.confirmPassword}
                        />
                    </StyledInputeView>
                    {errors.confirmPassword && touched.confirmPassword && <StyledErrorView>{errors.confirmPassword}</StyledErrorView>}
                    <StyledInputeView>
                        <TextInput
                            placeholder="Company"
                            onChangeText={handleChange('company')}
                            onBlur={handleBlur('company')}
                            value={values.company}
                        />
                        {errors.company && touched.company && <StyledErrorView>{errors.company}</StyledErrorView>}
                    </StyledInputeView>
                    <RegularButton
                        onPress={() => { handleSubmit() }}
                        disabled={!values.email || !values.password || !values.confirmPassword || !values.company}
                    >Register</RegularButton>
                </>
            )
            }
        </Formik >
    )
}

export default RegisterForm
