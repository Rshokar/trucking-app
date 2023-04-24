import React, { FunctionComponent } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { TextInput } from 'react-native-gesture-handler'


import RegularButton from '../Buttons/RegularButton'
import { StyledInputeView } from './style'
import { LoginFormResult } from './types'


import { FormProps } from './types'
import Input from './Inputs/Input'

const intialValues: LoginFormResult = { email: '', password: '' }
const LoginForm: FunctionComponent<FormProps<LoginFormResult>> = (props) => {


    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string()
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.')
            .required('Password is required')
    })

    return <Formik initialValues={intialValues} onSubmit={props.onSubmit} validationSchema={validationSchema}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => <>
            <Input
                errorProps={{ error: errors.email, touched: touched.email }}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                placeholder="Paperless@trucking-app.com"
                name={'email'}
            />

            <Input
                errorProps={{ error: errors.password, touched: touched.password }}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry={true}
                value={values.password}
                placeholder="***********"
                name={"password"}
            />

            <RegularButton
                onPress={() => { handleSubmit() }}
            >Login</RegularButton>
        </>
        }
    </Formik>
}

export default LoginForm