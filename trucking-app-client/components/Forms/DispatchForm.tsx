import React, { useState, useCallback, FC } from 'react';
import { Button, TextInput, Menu, Divider, Text, useTheme } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Customer } from '../../models/Customer';
import RegularButton from '../Buttons/RegularButton';
import { InputBox } from './styles';
import { DatePickerModal } from 'react-native-paper-dates';
import moment from 'moment';
import { Dispatch } from '../../models/Dispatch';

export type DispatchFormResult = {
    customer_id: number;
    notes: string;
    date: string;
}

type Props = {
    onSubmit: (values: Dispatch, id?: string) => Promise<boolean>;
    defaultValues?: DispatchFormResult;
    customers: Customer[],
}

const DispatchFormSchema = Yup.object().shape({
    customer_id: Yup.number()
        .min(1, "Customer is required")
        .required('Required'),
    notes: Yup.string().required('Required'),
    date: Yup.string().required('Required'),
});

const DispatchForm: FC<Props> = ({ onSubmit, defaultValues, customers }) => {
    const theme = useTheme();
    const [visible, setVisible] = useState(false);
    const [showDateModal, setShowDateModal] = useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const dv: any = { ...defaultValues, date: defaultValues?.date.toString().split("T")[0] }

    return (
        <Formik
            initialValues={dv ?? new Dispatch()}
            validationSchema={DispatchFormSchema}
            onSubmit={async (values, { setSubmitting }) => {
                values.customer_id = parseFloat(values.customer_id + "");
                await onSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting }) => {
                return <>
                    <InputBox>
                        <Menu
                            visible={visible}
                            onDismiss={closeMenu}
                            anchor={
                                <Button buttonColor={theme.colors.secondary} onPress={openMenu} textColor={'white'}>
                                    {(!values.customer_id || values.customer_id === 0) ? "Select Customer" : `Customer: ${values.customer_id && customers.find(c => c.customer_id == values.customer_id)?.customer_name}`}
                                </Button>
                            }
                        >
                            {customers.map((customer: Customer) =>
                                <Menu.Item
                                    key={customer.customer_id}
                                    onPress={() => {
                                        handleChange("customer_id")(customer.customer_id + "");
                                        closeMenu();
                                    }}
                                    title={customer.customer_name} />
                            )}
                        </Menu>
                        {errors.customer_id && <Text>{errors.customer_id}</Text>}
                    </InputBox>
                    <Divider />
                    <InputBox>
                        <TextInput
                            label="Date"
                            value={values.date}
                            onPressIn={() => setShowDateModal(true)}
                            error={errors.date ? true : false}
                        />
                        <DatePickerModal
                            locale='en'
                            mode='single'
                            visible={showDateModal}
                            onDismiss={() => setShowDateModal(false)}
                            date={values.date ? new Date(values.date) : new Date()}
                            onConfirm={({ date }) => {
                                setShowDateModal(false);
                                handleChange("date")(moment(date).format("YYYY-MM-DD"));
                            }}
                        />
                    </InputBox>
                    <InputBox>
                        <TextInput
                            label="Notes"
                            style={{ height: 100 }}
                            onChangeText={handleChange('notes')}
                            onBlur={handleBlur('notes')}
                            value={values.notes}
                            multiline
                            error={errors.notes ? true : false}
                        />
                    </InputBox>
                    <Button onPress={() => handleSubmit()} disabled={isSubmitting} style={{ backgroundColor: isSubmitting ? theme.colors.onSurfaceDisabled : theme.colors.primary }} >
                        <Text style={{ color: 'white' }}>
                            {isSubmitting ? "Submitting...." : "Submit"}
                        </Text>
                    </Button>
                </>
            }}
        </Formik>
    )
}

export default DispatchForm;
