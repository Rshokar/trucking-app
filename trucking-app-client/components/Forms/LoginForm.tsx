import React, { FunctionComponent } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { TextInput } from 'react-native-gesture-handler'


import RegularButton from '../Buttons/RegularButton'
import { StyledInputeView } from './style'
import { LoginFormResult } from './types'


import { FormProps } from './types'

const intialValues: LoginFormResult = { email: '', password: '' }
const LoginForm: FunctionComponent<FormProps<LoginFormResult>> = (props) => {


    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string()
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.')
            .required('Password is required')
    })

    console.log("Hello");

    return <Formik initialValues={intialValues} onSubmit={props.onSubmit} validationSchema={validationSchema}>
        {(formikProps: any) => <>
            <StyledInputeView>
                <TextInput
                    onChangeText={formikProps.handleChange('email')}
                    onBlur={formikProps.handleBlur('email')}
                    value={formikProps.values.email}
                    placeholder="Paperless@trucking-app.com"
                />
            </StyledInputeView>
            <StyledInputeView>
                <TextInput
                    onChangeText={formikProps.handleChange('password')}
                    onBlur={formikProps.handleBlur('password')}
                    value={formikProps.values.password}
                    placeholder="***********"
                />
            </StyledInputeView>
            <RegularButton
                onPress={() => { console.log('BLABLA') }}
            >Login</RegularButton>
        </>
        }
    </Formik>
}

export default LoginForm