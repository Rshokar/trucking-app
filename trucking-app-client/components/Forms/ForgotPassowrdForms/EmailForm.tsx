import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { InputBox, ErrorText } from '../styles';

const initialValues = {
    email: '',
};

const EmailFormSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
});

const EmailForm: React.FC<{ onSubmit: (values: { email: string }) => void }> = (props) => {
    const theme = useTheme();

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={props.onSubmit}
            validationSchema={EmailFormSchema}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting }) => (
                <>
                    <InputBox>
                        <TextInput
                            label={"Email"}
                            value={values.email}
                            placeholder='example@example.com'
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            error={!!errors.email}
                        />
                        {errors.email && <ErrorText>{errors.email}</ErrorText>}
                    </InputBox>

                    <Button
                        mode="contained"
                        onPress={(e) => handleSubmit()}
                        disabled={isSubmitting}
                        style={{
                            marginTop: 10,
                            backgroundColor: isSubmitting ? theme.colors.onSurfaceDisabled : theme.colors.primary,
                            width: '100%',
                        }}
                    >
                        {isSubmitting ? "Sending Code..." : "Send Code"}
                    </Button>
                </>
            )}
        </Formik>
    );
};

export default EmailForm;
