import React, { FC, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { TextInput, Button, Text } from 'react-native-paper';
import { CustomerFormResult, FormProps } from './types';
import { Customer } from '../../models/Customer';
import styled from 'styled-components/native';

// Define validation schema with Yup
const validationSchema = yup.object().shape({
    customer_name: yup.string().required('Customer name is required'),
    // Add more fields as needed...
});

const InputBox = styled.View`
    padding-bottom: 20px;
`

const CustomerForm: FC<FormProps<CustomerFormResult>> = (props) => {
    const [submitting, setSubmitting] = useState<boolean>(false);

    return (
        <Formik
            initialValues={props.defaultValues || new Customer() as CustomerFormResult}
            validationSchema={validationSchema}
            onSubmit={async (data: CustomerFormResult) => {
                setSubmitting(true)
                const res = await props.onSubmit(data);
                setSubmitting(!res);
            }}
            enableReinitialize
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <InputBox>
                        <TextInput
                            label="Customer Name"
                            onChangeText={handleChange('customer_name')}
                            onBlur={handleBlur('customer_name')}
                            value={values.customer_name}
                            error={touched.customer_name && Boolean(errors.customer_name)}
                            style={{ marginBottom: 10 }}
                        />
                        {touched.customer_name && <Text>{errors.customer_name}</Text>}
                    </InputBox>

                    <Button mode="contained" onPress={(e) => handleSubmit()} disabled={submitting}>
                        {submitting ? "Loading..." : "Submit"}
                    </Button>
                </>
            )}
        </Formik>
    );
};

export default CustomerForm;
