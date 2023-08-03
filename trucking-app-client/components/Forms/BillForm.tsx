import React, { FC } from 'react';
import { Formik } from 'formik';
import { TextInput, Button, useTheme } from 'react-native-paper';
import * as Yup from 'yup';
import { InputBox } from './styles';

export type BillFormResult = {
    ticket_number: string;
};

type Props = {
    onSubmit: (values: BillFormResult, id?: string) => Promise<boolean>;
    defaultValues?: any;
};

const BillFormSchema = Yup.object().shape({
    ticket_number: Yup.string().required('Required'),
});

const BillForm: FC<Props> = ({ onSubmit, defaultValues }) => {
    const theme = useTheme();

    console.log("DEFAULT VALUE", defaultValues);

    return (
        <Formik
            initialValues={(defaultValues ?? {}) as BillFormResult}
            validationSchema={BillFormSchema}
            onSubmit={async (values, { setSubmitting }) => {
                await onSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting }) => {
                console.log(values);
                return (
                    <>
                        <InputBox>
                            <TextInput
                                label="Ticket Number"
                                onChangeText={handleChange('ticket_number')}
                                onBlur={handleBlur('ticket_number')}
                                value={values.ticket_number}
                                error={errors.ticket_number ? true : false}
                            />
                        </InputBox>
                        <Button mode="contained" onPress={() => handleSubmit()} disabled={isSubmitting} style={{ marginTop: 10, backgroundColor: theme.colors.primary }}>
                            {isSubmitting ? "Submitting...." : "Submit"}
                        </Button>
                    </>
                )
            }}
        </Formik>
    )
}

export default BillForm;
