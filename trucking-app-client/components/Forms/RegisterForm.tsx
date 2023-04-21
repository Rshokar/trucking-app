import React, { FunctionComponent } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { Picker } from '@react-native-picker/picker';

import RegularButton from '../Buttons/RegularButton'

import Input from './Inputs/Input'

import { FormProps, RegisterFormResult } from './types'
import SelectInput from './Inputs/SelectInput';

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
        company: Yup.string().required('Company name is required').min(4, "Company name must be longer than 4 characters"),
        acType: Yup.string().test('valid-acType', 'Invalid account type', value => {
            return value === 'dispatcher' || value === 'operator';
        })
    });

    const acTypeOptions = [
        { label: 'Dispatcher', value: 'dispatcher' },
        { label: 'Operator', value: 'operator' },
    ];


    return (
        <Formik
            initialValues={intialValues}
            onSubmit={props.onSubmit}
            validationSchema={validationSchema}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <Input name={'email'}
                        errorProps={{ error: errors.email, touched: touched.email }}
                        placeholder="Email"
                        keyboardType="email-address"
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                    />
                    <Input name={'password'}
                        errorProps={{ error: errors.password, touched: touched.password }}
                        placeholder="Password"
                        secureTextEntry={true}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                    />

                    <Input name={'confirmPassword'}
                        errorProps={{ error: errors.confirmPassword, touched: touched.confirmPassword }}
                        placeholder="Confirm Password"
                        secureTextEntry={true}
                        onChangeText={handleChange('confirmPassword')}
                        onBlur={handleBlur('confirmPassword')}
                        value={values.confirmPassword}
                    />

                    <Input name={'company'}
                        errorProps={{ error: errors.company, touched: touched.company }}
                        placeholder="Company"
                        onChangeText={handleChange('company')}
                        onBlur={handleBlur('company')}
                        value={values.company}
                    />
                    <SelectInput options={acTypeOptions}
                        onChange={handleChange('acType')}
                        errorProps={{ error: errors.acType, touched: touched.acType }}
                        name={'acType'}
                        value={values.acType}
                    />
                    <RegularButton
                        onPress={() => { handleSubmit() }}
                    >Register</RegularButton>
                </>
            )
            }
        </Formik >
    )
}



export default RegisterForm
