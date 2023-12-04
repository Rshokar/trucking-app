import React, { FC, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker'; // import Picker
import { OperatorFormResult, FormProps } from './types';
import { Operator } from '../../models/Operator';
import { ErrorText, FormContainer, InputBox } from './styles';
import { err } from 'react-native-svg/lib/typescript/xml';

// Define validation schema with Yup
const validationSchema = yup.object().shape({
    operator_name: yup.string().required('Operator name is required'),
    contact_method: yup.string().required('Contact method is required'),
    operator_email: yup.string().when('contact_method', (contact_method, schema: yup.StringSchema) => {
        return contact_method[0] == 'email' ? schema.required("Email is required") : schema;
    }),
    operator_phone: yup.string().when('contact_method', (contact_method, schema: yup.StringSchema) => {
        return contact_method[0] == 'sms' ? schema.required("Phone number is required") : schema;
    }),
    operator_phone_country_code: yup.string().when('contact_method', (contact_method, schema: yup.StringSchema) => {
        return contact_method[0] == 'sms' ? schema.required("Country code is required") : schema;
    }),
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
            {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting, setFieldValue }) => (
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

                    {/* Phone number input */}
                    <InputBox>
                        <TextInput
                            label="Operator Phone"
                            onChangeText={handleChange('operator_phone')}
                            onBlur={handleBlur('operator_phone')}
                            value={values.operator_phone}
                            error={!!errors.operator_phone}
                        />
                        {errors.operator_phone && <ErrorText>{errors.operator_phone}</ErrorText>}
                    </InputBox>
                    <InputBox>
                        <TextInput
                            label="Country Code"
                            onChangeText={handleChange('operator_phone_country_code')}
                            onBlur={handleBlur('operator_phone_country_code')}
                            value={values.operator_phone_country_code}
                            error={!!errors.operator_phone_country_code}
                        />
                        {errors.operator_phone_country_code && <ErrorText>{errors.operator_phone_country_code}</ErrorText>}
                    </InputBox>

                    {/* Contact method dropdown */}
                    <InputBox>
                        <Text>Contact Method</Text>
                        <Picker
                            selectedValue={values.contact_method}
                            onValueChange={(itemValue) => {
                                console.log(itemValue)
                                setFieldValue('contact_method', itemValue)
                            }}>
                            <Picker.Item label="Select Method" value="" />
                            <Picker.Item label="Email" value="email" />
                            <Picker.Item label="SMS" value="sms" />
                        </Picker>
                        {errors.contact_method && <ErrorText>{errors.contact_method}</ErrorText>}
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
