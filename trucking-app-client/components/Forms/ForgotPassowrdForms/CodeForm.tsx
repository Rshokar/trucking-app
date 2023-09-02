import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { InputBox, ErrorText } from '../styles';

const initialValues = {
    code: '',
};

const CodeFormSchema = Yup.object().shape({
    code: Yup.string().length(6, 'Code should be 6 digits').required('Code is required'),
});

const CodeForm: React.FC<{ onSubmit: (values: { code: string }) => void }> = (props) => {
    const theme = useTheme();

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={props.onSubmit}
            validationSchema={CodeFormSchema}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting }) => (
                <>
                    <InputBox>
                        <TextInput
                            label={"Code"}
                            value={values.code}
                            placeholder='123456'
                            onChangeText={handleChange('code')}
                            onBlur={handleBlur('code')}
                            error={!!errors.code}
                        />
                        {errors.code && <ErrorText>{errors.code}</ErrorText>}
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
                        {isSubmitting ? "Validating..." : "Validate Code"}
                    </Button>
                </>
            )}
        </Formik>
    );
};

export default CodeForm;
