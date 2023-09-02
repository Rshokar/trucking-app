import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { InputBox, ErrorText, DualInput } from '../styles';

const initialValues = {
    password: '',
    confirmPassword: '',
};

const NewPasswordFormSchema = Yup.object().shape({
    password: Yup.string()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
});

const NewPasswordForm: React.FC<{ onSubmit: (values: { password: string, confirmPassword: string }) => void }> = (props) => {
    const theme = useTheme();

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={props.onSubmit}
            validationSchema={NewPasswordFormSchema}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting }) => (
                <>
                    <DualInput>
                        <InputBox style={{ flex: 1 }}>
                            <TextInput
                                label={"New Password"}
                                value={values.password}
                                placeholder='**************'
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                error={!!errors.password}
                                secureTextEntry={true}
                            />
                            {errors.password && <ErrorText>{errors.password}</ErrorText>}
                        </InputBox>

                        <InputBox style={{ flex: 1 }}>
                            <TextInput
                                label={"Confirm New Password"}
                                value={values.confirmPassword}
                                placeholder='**************'
                                onChangeText={handleChange('confirmPassword')}
                                onBlur={handleBlur('confirmPassword')}
                                error={!!errors.confirmPassword}
                                secureTextEntry={true}
                            />
                            {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
                        </InputBox>
                    </DualInput>

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
                        {isSubmitting ? "Updating Password..." : "Update Password"}
                    </Button>
                </>
            )}
        </Formik>
    );
};

export default NewPasswordForm;
