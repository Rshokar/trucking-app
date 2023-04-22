import React, { FunctionComponent, useState, useEffect } from 'react'
import { TextInput } from 'react-native-gesture-handler'

import { colors } from '../../colors';
import { StyledInputeView, StyledErrorView } from './style';

import { InputProps } from './types';

const Input: FunctionComponent<InputProps> = (props) => {

    const [color, setColor] = useState<string>(colors.gray);
    const { error, touched } = props.errorProps;


    useEffect(() => {
        if (error && touched)
            return setColor('red')

        if (touched)
            return setColor(colors.success)

        return setColor(colors.gray)


    }, [error, touched])


    return <>
        <StyledInputeView style={{
            borderColor: color
        }}>
            <TextInput
                {...props}
            />
        </StyledInputeView>
        {error && touched && <StyledErrorView>{error}</StyledErrorView>}
    </>
}

export default Input