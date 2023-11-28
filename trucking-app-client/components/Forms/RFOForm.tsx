import React, { FC, useState } from 'react';
import { Formik } from 'formik';
import { View } from "react-native"
import { TextInput, Button, useTheme, Divider, Text, Checkbox } from 'react-native-paper';
import * as Yup from 'yup';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import moment from 'moment';
import DropDown from 'react-native-paper-dropdown';
import { Operator } from '../../models/Operator';
import { RFO } from '../../models/RFO';
import styled from 'styled-components/native';
import { DualInput, ErrorText, FormContainer, InputBox } from './styles';
import { err } from 'react-native-svg/lib/typescript/xml';

export type RFOFormResult = {
    operator_id: number;
    truck: string;
    trailer: string;
    start_location: string;
    dump_location: string;
    load_location: string;
    start_date: string;
    start_time: string;
    confirmUpgradePayment: boolean;
};

const ConfirmPaymentTierUpgradeContainer = styled.View`
    flex-direction: row;  // Align children in a row
    align-items: center;  // Center-align children vertically
    background-color: green;
    padding: 10px;  // Optional for some padding
`

const CheckboxWrapper = styled.View`
    border-width: 1px;
    border-color: #000; // You can change this to your desired border color
    border-radius: 4px; // Optional, for rounded corners
    padding: 2px; // Optional, to give some space between the checkbox and the border
`;


const truckOptions = [
    { label: 'Tandem', value: 'Tandem' },
    { label: 'Tridem', value: 'Tridem' },
];

const trailerOptions = [
    { label: 'None', value: 'None' },
    { label: '2 Axle Pony', value: '2 Axle Pony' },
    { label: '3 Axle Pony', value: '3 Axle Pony' },
    { label: '3 Axle Transfer', value: '3 Axle Transfer' },
    { label: '4 Axle Transfer', value: '4 Axle Transfer' },
    { label: '4 Axle End Dump', value: '4 Axle End Dump' },
];

type Props = {
    onSubmit: (values: RFOFormResult, id?: string) => Promise<boolean>;
    defaultValues?: RFO;
    operators: Operator[];
    showConfirmUpgradePaymentTier: boolean
};

const RFOFormSchema = Yup.object().shape({
    operator_id: Yup.number()
        .min(1, "Operator is required")
        .required('Required'),
    truck: Yup.string().required('Required'),
    trailer: Yup.string().required('Required'),
    start_location: Yup.string().required('Required'),
    dump_location: Yup.string().required('Required'),
    load_location: Yup.string().required('Required'),
    start_date: Yup.string().required('Required'),
    start_time: Yup.string().required('Required'),
    confirmUpgradePayment: Yup.boolean().default(false)
});

const RFOForm: FC<Props> = ({ onSubmit, defaultValues, operators, showConfirmUpgradePaymentTier }) => {
    const theme = useTheme();
    const [step, setStep] = useState(1);
    const [dateVisible, setDateVisible] = useState(false);
    const [timeVisible, setTimeVisible] = useState(false);
    const [operatorDropdownVisible, setOperatorDropdownVisible] = useState(false);
    const [truckDropdownVisible, setTruckDropdownVisible] = useState(false);
    const [trailerDropdownVisible, setTrailerDropdownVisible] = useState(false);
    const operatorList = operators.filter(o => o.confirmed)
        .map(operator => ({ label: operator.operator_name + "", value: operator.operator_id ?? 0 }));


    const iv: any = { ...defaultValues, confirmUpgradePayment: false };

    if (defaultValues?.start_time) {
        const [date, time] = moment(defaultValues.start_time).format("YYYY-MM-DD HH:mm:ss").split(" ");
        iv["start_time"] = time;
        iv["start_date"] = date;
    }

    return (
        <Formik
            initialValues={iv as RFOFormResult}
            validationSchema={RFOFormSchema}
            onSubmit={async (values, { setSubmitting }) => {
                await onSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ handleChange, setFieldValue, handleBlur, handleSubmit, validateForm, values, errors, isSubmitting }) => {
                return <FormContainer>
                    {step === 1 && (
                        <>
                            <InputBox>
                                <DropDown
                                    label={'Operator'}
                                    mode={'outlined'}
                                    value={values.operator_id}
                                    setValue={(value) => {
                                        setFieldValue('operator_id', value)
                                    }}
                                    list={operatorList}
                                    visible={operatorDropdownVisible}
                                    showDropDown={() => setOperatorDropdownVisible(true)}
                                    onDismiss={() => setOperatorDropdownVisible(false)}
                                    inputProps={{
                                        keyboardType: 'numeric',
                                        error: errors.operator_id,
                                    }}
                                />
                                {errors.operator_id && <ErrorText>{errors.operator_id}</ErrorText>}
                            </InputBox>
                            <DualInput>
                                <InputBox style={{ flex: 1 }}>
                                    <TextInput
                                        label="Start Date"
                                        value={values.start_date}
                                        onPressIn={() => setDateVisible(true)}
                                        error={errors.start_date ? true : false}
                                    />
                                    <DatePickerModal
                                        locale='en'
                                        mode='single'
                                        visible={dateVisible}
                                        onDismiss={() => setDateVisible(false)}
                                        date={values.start_date ? new Date(values.start_date) : new Date()}
                                        onConfirm={({ date }) => {
                                            setDateVisible(false);
                                            handleChange("start_date")(moment(date).format("YYYY-MM-DD"));
                                        }}
                                    />
                                    {errors.start_date && <ErrorText>{errors.start_date}</ErrorText>}
                                </InputBox>
                                <InputBox style={{ flex: 1 }}>
                                    <TextInput
                                        label="Start Time"
                                        value={values.start_time}
                                        onPressIn={() => setTimeVisible(true)}
                                        error={errors.start_time ? true : false}
                                    />
                                    <TimePickerModal
                                        visible={timeVisible}
                                        onDismiss={() => setTimeVisible(false)}
                                        onConfirm={({ hours, minutes }) => {
                                            setTimeVisible(false);
                                            handleChange("start_time")(`${hours}:${minutes}`);
                                        }}
                                    />
                                    {errors.start_time && <ErrorText>{errors.start_time}</ErrorText>}
                                </InputBox>
                            </DualInput>
                            <DualInput>
                                <InputBox style={{ flex: 1 }}>
                                    <DropDown
                                        label={'Truck'}
                                        mode={'outlined'}
                                        value={values.truck}
                                        setValue={handleChange('truck')}
                                        list={truckOptions}
                                        visible={truckDropdownVisible}
                                        showDropDown={() => setTruckDropdownVisible(true)}
                                        onDismiss={() => setTruckDropdownVisible(false)}
                                        inputProps={{
                                            error: errors.truck,
                                        }}
                                    />
                                    {errors.truck && <ErrorText>{errors.truck}</ErrorText>}
                                </InputBox>
                                <InputBox style={{ flex: 1 }}>
                                    <DropDown
                                        label={'Trailer'}
                                        mode={'outlined'}
                                        value={values.trailer}
                                        setValue={handleChange('trailer')}
                                        list={trailerOptions}
                                        visible={trailerDropdownVisible}
                                        showDropDown={() => setTrailerDropdownVisible(true)}
                                        onDismiss={() => setTrailerDropdownVisible(false)}
                                        inputProps={{
                                            error: errors.trailer,
                                        }}
                                    />
                                    {errors.trailer && <ErrorText>{errors.trailer}</ErrorText>}
                                </InputBox>
                            </DualInput>
                            <Button mode="contained" onPress={async () => {
                                if (Object.keys(values).length === 0) {
                                    await validateForm();
                                    return;
                                } else if (
                                    !errors.start_date &&
                                    !errors.start_time &&
                                    !errors.operator_id &&
                                    !errors.truck &&
                                    !errors.trailer
                                ) {
                                    setStep(2)
                                }
                            }} style={{ width: '100%', backgroundColor: theme.colors.primary }}>
                                Next
                            </Button>
                        </>
                    )}
                    {step === 2 && (
                        <>

                            <InputBox>
                                <TextInput
                                    label="Start Location"
                                    onChangeText={handleChange('start_location')}
                                    onBlur={handleBlur('start_location')}
                                    value={values.start_location}
                                    error={errors.start_location ? true : false}
                                />
                            </InputBox>
                            <InputBox>
                                <TextInput
                                    label="Dump Location"
                                    onChangeText={handleChange('dump_location')}
                                    onBlur={handleBlur('dump_location')}
                                    value={values.dump_location}
                                    error={errors.dump_location ? true : false}
                                />
                            </InputBox>
                            <InputBox>
                                <TextInput
                                    label="Load Location"
                                    onChangeText={handleChange('load_location')}
                                    onBlur={handleBlur('load_location')}
                                    value={values.load_location}
                                    error={errors.load_location ? true : false}
                                />
                            </InputBox>
                            {
                                showConfirmUpgradePaymentTier &&
                                <ConfirmPaymentTierUpgradeContainer>
                                    <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingRight: 20 }}>
                                        <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Allow Tier Upgrade</Text>
                                    </View>
                                    <CheckboxWrapper>
                                        <Checkbox
                                            status={values.confirmUpgradePayment ? 'checked' : 'unchecked'}
                                            onPress={(e) => setFieldValue("confirmUpgradePayment", !values.confirmUpgradePayment)}
                                        />
                                    </CheckboxWrapper>
                                </ConfirmPaymentTierUpgradeContainer>
                            }
                            <Button
                                mode="contained"
                                onPress={() => handleSubmit()}
                                disabled={isSubmitting}
                                style={{ backgroundColor: isSubmitting ? theme.colors.onSurfaceDisabled : theme.colors.primary, width: '100%' }}>
                                {isSubmitting ? "Submitting...." : "Submit"}
                            </Button>
                            <Button
                                mode="contained"
                                onPress={() => setStep(step - 1)}
                                disabled={isSubmitting}
                                style={{
                                    backgroundColor: theme.colors.secondary, width: '100%'
                                }}>
                                Back
                            </Button>
                        </>
                    )}
                </FormContainer>
            }}
        </Formik>
    )
}

export default RFOForm;
