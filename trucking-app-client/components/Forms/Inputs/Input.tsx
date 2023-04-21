import React, { FunctionComponent } from 'react'
import styled from "styled-components/native";
import { TextInput } from 'react-native-gesture-handler'

import { colors } from "../../colors";


export const StyledInputeView = styled.View`
  width: 100%;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid ${colors.gray};

`;

export const StyledErrorView = styled.Text`
  width: 90%
  color: red
`


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