import React, { FC, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { OperatorFormResult, FormProps } from './types';
import { Operator } from '../../models/Operator';
import styled from 'styled-components/native';
import { InputBox } from './styles';
import RegularButton from '../Buttons/RegularButton';

// Define validation schema with Yup
const validationSchema = yup.object().shape({
    operator_name: yup.string().required('Operator name is required'),
    operator_email: yup.string().email('Invalid email').required('Email is required'),
});

const OperatorForm: FC<FormProps<OperatorFormResult>> = (props) => {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const theme = useTheme();

    return (
        <Formik
            initialValues={props.defaultValues || new Operator() as OperatorFormResult}
            validationSchema={validationSchema}
            onSubmit={async (data: OperatorFormResult) => {
                setSubmitting(true);
                const res = await props.onSubmit(data);
                setSubmitting(!res);
            }}
            enableReinitialize
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <InputBox>
                        <TextInput
                            label="Operator Name"
                            onChangeText={handleChange('operator_name')}
                            onBlur={handleBlur('operator_name')}
                            value={values.operator_name}
                            error={touched.operator_name && Boolean(errors.operator_name)}
                            style={{ marginBottom: 10 }}
                        />
                        {touched.operator_name && <Text>{errors.operator_name}</Text>}
                    </InputBox>

                    <InputBox>
                        <TextInput
                            label="Operator Email"
                            onChangeText={handleChange('operator_email')}
                            onBlur={handleBlur('operator_email')}
                            value={values.operator_email}
                            error={touched.operator_email && Boolean(errors.operator_email)}
                            style={{ marginBottom: 10 }}
                        />
                        {touched.operator_email && <Text>{errors.operator_email}</Text>}
                    </InputBox>

                    <RegularButton onPress={(e) => handleSubmit()} disabled={submitting} btnStyles={{ backgroundColor: submitting ? theme.colors.onSurfaceDisabled : theme.colors.primary }}>
                        {submitting ? "Loading..." : "Submit"}
                    </RegularButton>
                </>
            )}
        </Formik>
    );
};

export default OperatorForm;
