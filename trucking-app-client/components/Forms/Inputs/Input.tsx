import React, { FunctionComponent } from 'react'
import { TextInput } from 'react-native-gesture-handler'

import { colors } from '../../colors';
import { StyledInputeView, StyledErrorView } from './style';

import { InputProps } from './types';

const Input: FunctionComponent<InputProps> = (props) => {

    const { error, touched } = props.errorProps;

    return <>
        <StyledInputeView style={{ borderColor: error && touched ? 'red' : colors.gray }}>
            <TextInput
                {...props}
            />
        </StyledInputeView>
        {error && touched && <StyledErrorView>{error}</StyledErrorView>}
    </>
}

export default Input