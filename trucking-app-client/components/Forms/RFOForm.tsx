import React, { FC, useState } from 'react';
import { Formik } from 'formik';
import { TextInput, Button, useTheme, Divider, Text } from 'react-native-paper';
import * as Yup from 'yup';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import moment from 'moment';
import DropDown from 'react-native-paper-dropdown';
import { Operator } from '../../models/Operator';
import { RFO } from '../../models/RFO';
import { InputBox } from './styles';

export type RFOFormResult = {
    operator_id: number;
    truck: string;
    trailer: string;
    start_location: string;
    dump_location: string;
    load_location: string;
    start_date: string;
    start_time: string;
};

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
});

const RFOForm: FC<Props> = ({ onSubmit, defaultValues, operators }) => {
    const theme = useTheme();
    const [step, setStep] = useState(1);
    const [dateVisible, setDateVisible] = useState(false);
    const [timeVisible, setTimeVisible] = useState(false);
    const [operatorDropdownVisible, setOperatorDropdownVisible] = useState(false);
    const [truckDropdownVisible, setTruckDropdownVisible] = useState(false);
    const [trailerDropdownVisible, setTrailerDropdownVisible] = useState(false);
    const operatorList = operators.map(operator => ({ label: operator.operator_name + "", value: operator.operator_id ?? 0 }));

    console.log('OPERATORS', operators);

    const iv: any = { ...defaultValues };

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
            {({ handleChange, setFieldValue, handleBlur, handleSubmit, values, errors, isSubmitting }) => {
                return <>
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


                            </InputBox>
                            <InputBox>
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
                            </InputBox>
                            <InputBox>
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
                            </InputBox>
                            <Button mode="contained" onPress={() => {
                                if (!errors.start_date && !errors.start_time && !errors.operator_id)
                                    setStep(2)
                            }} style={{ marginTop: 10, backgroundColor: theme.colors.primary }}>
                                Next
                            </Button>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <InputBox>
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
                            </InputBox>
                            <InputBox>
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
                            </InputBox>
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
                            <Button mode="contained" onPress={() => handleSubmit()} disabled={isSubmitting} style={{ marginTop: 10, backgroundColor: theme.colors.primary }}>
                                {isSubmitting ? "Submitting...." : "Submit"}
                            </Button>
                            <Button mode="contained" onPress={() => setStep(step - 1)} disabled={isSubmitting} style={{ marginTop: 10, backgroundColor: theme.colors.secondary }}>
                                Back
                            </Button>
                        </>
                    )}
                </>
            }}
        </Formik>
    )
}

export default RFOForm;
