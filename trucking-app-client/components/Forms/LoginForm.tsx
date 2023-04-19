import React, { FunctionComponent } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'



interface FormValues {
    email: string,
    password: string
}

import { FormProps } from './types'
import { TextInput } from 'react-native-gesture-handler'
import RegularButton from '../Buttons/RegularButton'

const LoginForm: FunctionComponent<FormProps> = (props) => {

    const intialValues: FormValues = { email: '', password: '' }

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string()
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.')
            .required('Password is required')
    })

    return <Formik initialValues={intialValues} onSubmit={props.onSubmit} validationSchema={validationSchema}>
        {(formikProps: any) => <>
            <TextInput
                onChangeText={formikProps.handleChange('name')}
                onBlur={formikProps.handleBlur('name')}
                value={formikProps.values.email}
                placeholder="Name"
            />
            <TextInput
                onChangeText={formikProps.handleChange('email')}
                onBlur={formikProps.handleBlur('email')}
                value={formikProps.values.password}
                placeholder="Email"
            />
            <RegularButton onPress={formikProps.hnadleSubmit}>Login</RegularButton>
        </>
        }
    </Formik>
}

export default LoginForm