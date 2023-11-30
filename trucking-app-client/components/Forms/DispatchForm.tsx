import React, { useState, FC } from 'react';
import { View, Keyboard } from 'react-native';
import { Button, TextInput, Divider, Text, useTheme, IconButton } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Customer } from '../../models/Customer';
import { ErrorText, FormContainer, InputBox } from './styles';
import { DatePickerModal } from 'react-native-paper-dates';
import moment from 'moment';
import { Dispatch } from '../../models/Dispatch';
import DropDown from 'react-native-paper-dropdown';
import MyModal from '../Modal/MyModal';
import CustomerForm from './CustomerForm';
import { CustomerFormResult } from './types';
import { CustomerController } from '../../controllers/CustomerController';
import useSnackbar from '../../hooks/useSnackbar';

export type DispatchFormResult = {
    customer_id: number;
    notes: string;
    date: string;
    expiry: string;
}

type Props = {
    onSubmit: (values: Dispatch, id?: string) => Promise<boolean>;
    defaultValues?: DispatchFormResult;
    customers: Customer[],
}



const DispatchForm: FC<Props> = ({ onSubmit, defaultValues, customers }) => {
    const theme = useTheme();
    const [visible, setVisible] = useState(false);
    const [cusModal, setCusModsl] = useState<boolean>(false);
    const [showDateModal, setShowDateModal] = useState(false);
    const [showExpiryModal, setShowExpiryModal] = useState(false);
    const { showSnackbar } = useSnackbar();

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const openCustomerModal = () => setCusModsl(true);
    const closeCustomerModal = () => setCusModsl(false);

    const dv: any = defaultValues ? {
        ...defaultValues,
        date: defaultValues?.date.toString().split("T")[0],
        expiry: defaultValues?.expiry.toString().split("T")[0],
        showExpiry: true
    } : undefined

    const DispatchFormSchema = Yup.object().shape({
        customer_id: Yup.number()
            .min(1, "Customer is required")
            .required('Required'),
        notes: Yup.string()
            .required('Required')
            .min(10, "Too short")
            .max(1000, "Too long"),
        date: Yup.date()
            .required('Required'),
        expiry: Yup.date()
            .when("showExpiry", {
                is: true,
                then: (schema) => schema.required("Expiry Date Required"),
            })
            .min(Yup.ref('date'), 'Expiry date must be after the dispatch date')
    });


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
            {({ handleChange, handleBlur, handleSubmit, values, errors, isSubmitting, setFieldValue }) => {

                console.log(errors, values)

                const handleAddCustomer = async (customer: Customer) => {
                    try {
                        const cC = new CustomerController();
                        const res: Customer = await cC.create(customer);
                        showSnackbar({
                            message: 'Customer created successfully',
                            color: theme.colors.primary,
                            onClickText: 'Ok'
                        })
                        setFieldValue("customer_id", res.customer_id, false)
                        closeCustomerModal()
                        return true;
                    } catch (err: any) {
                        console.log(err);
                        showSnackbar({
                            message: err.message,
                            color: theme.colors.error,
                            onClickText: 'Ok'
                        })
                        return false;
                    }
                }
                return <FormContainer>

                    <InputBox>
                        <View style={{
                            flexDirection: 'row',
                            width: '100%',
                            gap: 10,
                            alignItems: 'center',
                        }}>
                            <View style={{ flex: 1 }}>
                                <DropDown
                                    label='Customer'
                                    visible={visible}
                                    onDismiss={closeMenu}
                                    showDropDown={openMenu}
                                    value={customers.find(c => {
                                        return c.customer_id == values.customer_id
                                    })?.customer_id}
                                    setValue={function (_value: any): void {
                                        setFieldValue("customer_id", _value, false);
                                    }}
                                    list={customers.map(c => {
                                        return {
                                            label: c.customer_name + "",
                                            value: c.customer_id
                                        }
                                    })} />
                            </View>
                            <IconButton
                                icon={'plus'}
                                size={25}
                                style={{ backgroundColor: theme.colors.secondary }}
                                iconColor='white'
                                onPress={openCustomerModal}
                            />
                        </View>
                        {errors.customer_id && <ErrorText>{errors.customer_id as string}</ErrorText>}
                    </InputBox>
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
                    {
                        defaultValues &&
                        <InputBox>
                            <TextInput
                                label="Expiry Date"
                                value={values.expiry}
                                onPressIn={() => setShowExpiryModal(true)}
                                error={errors.expiry ? true : false}
                            />
                            <DatePickerModal
                                locale='en'
                                mode='single'
                                visible={showExpiryModal}
                                onDismiss={() => setShowExpiryModal(false)}
                                date={values.expiry ? new Date(values.expiry) : new Date()}
                                onConfirm={({ date }) => {
                                    setShowExpiryModal(false);
                                    handleChange("expiry")(moment(date).format("YYYY-MM-DD"));
                                }}
                            />
                            {errors.expiry && <ErrorText>{errors.expiry as string}</ErrorText>}
                        </InputBox>
                    }
                    <InputBox>
                        <TextInput
                            label="Notes"
                            style={{ height: 100 }}
                            onChangeText={handleChange('notes')}
                            onBlur={handleBlur('notes')}
                            value={values.notes}
                            multiline
                            blurOnSubmit={true} // Add this line
                            error={!!errors.notes}
                        />
                        {errors.notes && <ErrorText>{errors.notes as string}</ErrorText>}
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
                    <MyModal
                        visible={cusModal}
                        onDismiss={() => setCusModsl(false)}
                        title={'Add Customer'}
                    >
                        <CustomerForm
                            onSubmit={async function (results: CustomerFormResult, id?: string | undefined) {
                                await handleAddCustomer(results as Customer)
                            }}
                        />
                    </MyModal>
                </FormContainer>
            }}
        </Formik>
    )
}

export default DispatchForm;
