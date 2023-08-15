import React, { FunctionComponent } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { StyleSheet } from 'react-native'

import { colors } from '../../colors';
import { StyledInputeView, StyledErrorView } from './style';

import { SelectInputProps } from './types';
const SelectInput: FunctionComponent<SelectInputProps> = (props) => {
    const { error, touched } = props.errorProps;

    return (
        <>
            <StyledInputeView style={{ paddingVertical: 0, borderColor: error && touched ? 'red' : colors.gray }}>
                <RNPickerSelect
                    onValueChange={props.onChange}
                    style={pickerSelectStyles}
                    value={props.value}
                    items={props.options.map((option) => ({
                        label: option.label,
                        value: option.value,
                    }))}
                />
            </StyledInputeView>
            {error && touched && <StyledErrorView>{error}</StyledErrorView>}
        </>
    );
};

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        paddingVertical: '.70%',
        color: colors.graydark,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});

export default SelectInput;
