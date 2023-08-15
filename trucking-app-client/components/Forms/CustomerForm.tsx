import React, { FC, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { CustomerFormResult, FormProps } from './types';
import { Customer } from '../../models/Customer';
import { ErrorText, FormContainer, InputBox } from './styles';

// Define validation schema with Yup
const validationSchema = yup.object().shape({
    customer_name: yup.string()
        .required('Customer name is required')
        .min(3, "Customer name too short")
        .max(50, "Customer name too long"),
    // Add more fields as needed...
});

const CustomerForm: FC<FormProps<CustomerFormResult>> = (props) => {
    const theme = useTheme();

    return (
        <Formik
            initialValues={props.defaultValues || new Customer() as CustomerFormResult}
            validationSchema={validationSchema}
            onSubmit={async (data: CustomerFormResult, { setSubmitting }) => {
                await props.onSubmit(data);
                setSubmitting(false);
            }}
            enableReinitialize
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                <FormContainer>
                    <InputBox>
                        <TextInput
                            label="Customer Name"
                            onChangeText={handleChange('customer_name')}
                            onBlur={handleBlur('customer_name')}
                            value={values.customer_name}
                            error={touched.customer_name && Boolean(errors.customer_name)}
                            style={{ marginBottom: 10 }}
                        />
                        {errors.customer_name && <ErrorText>{errors.customer_name}</ErrorText>}
                    </InputBox>
                    <Button
                        onPress={() => handleSubmit()}
                        disabled={isSubmitting}
                        style={{
                            backgroundColor: isSubmitting ? theme.colors.onSurfaceDisabled : theme.colors.primary,
                            width: '100%'
                        }}
                    >
                        <Text style={{ color: 'white' }}>
                            {isSubmitting ? "Submitting...." : "Submit"}
                        </Text>
                    </Button>
                </FormContainer>
            )}
        </Formik>
    );
};

export default CustomerForm;
