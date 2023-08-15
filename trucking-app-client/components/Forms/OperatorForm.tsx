import React, { FC, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { OperatorFormResult, FormProps } from './types';
import { Operator } from '../../models/Operator';
import { ErrorText, FormContainer, InputBox } from './styles';
import { err } from 'react-native-svg/lib/typescript/xml';

// Define validation schema with Yup
const validationSchema = yup.object().shape({
    operator_name: yup.string().required('Operator name is required'),
    operator_email: yup.string().email('Invalid email').required('Email is required'),
});

const OperatorForm: FC<FormProps<OperatorFormResult>> = (props) => {
    const theme = useTheme();

    return (
        <Formik
            initialValues={props.defaultValues || new Operator() as OperatorFormResult}
            validationSchema={validationSchema}
            onSubmit={async (data: OperatorFormResult, { setSubmitting }) => {
                await props.onSubmit(data);
                setSubmitting(false);
            }}
            enableReinitialize
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting }) => (
                <FormContainer>
                    <InputBox>
                        <TextInput
                            label="Operator Name"
                            onChangeText={handleChange('operator_name')}
                            onBlur={handleBlur('operator_name')}
                            value={values.operator_name}
                            error={!!errors.operator_name}
                        />
                        {errors.operator_name && <ErrorText>{errors.operator_name}</ErrorText>}
                    </InputBox>

                    <InputBox>
                        <TextInput
                            label="Operator Email"
                            onChangeText={handleChange('operator_email')}
                            onBlur={handleBlur('operator_email')}
                            value={values.operator_email}
                            error={!!errors.operator_email}
                        />
                        {errors.operator_email && <ErrorText>{errors.operator_email}</ErrorText>}
                    </InputBox>

                    <Button
                        onPress={(e) => handleSubmit()}
                        disabled={isSubmitting}
                        style={{
                            backgroundColor: isSubmitting ? theme.colors.onSurfaceDisabled : theme.colors.primary,
                            width: '100%',
                        }}

                    >
                        <Text style={{ color: 'white' }}>
                            {isSubmitting ? "Loading..." : "Submit"}

                        </Text>
                    </Button>
                </FormContainer>
            )}
        </Formik>
    );
};

export default OperatorForm;
