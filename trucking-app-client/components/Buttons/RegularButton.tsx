import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import {
    GestureResponderEvent,
    StyleProp,
    TextStyle,
    ViewStyle,
} from 'react-native'


import { colors } from '../colors'
import RegularText from '../Texts/RegularText'


const ButtonView = styled.TouchableOpacity`
    align-items: center;
    background-color: ${colors.primary};
    width: 100%;
    padding: 20px;
    border-radius: 20px;
`

interface ButtonProps {
    btnStyles?: StyleProp<ViewStyle>;
    onPress: ((event: GestureResponderEvent) => void) | undefined;
    textStyles?: StyleProp<TextStyle>
    children: React.ReactNode;
    disabled?: boolean
}

const RegularButton: FunctionComponent<ButtonProps> = (props) => {

    const { disabled = false } = props
    return (
        <ButtonView disabled={disabled} onPress={props.onPress} style={props.btnStyles}>
            <RegularText textStyle={props.textStyles}>
                {props.children}
            </RegularText>
        </ButtonView>
    )
}

export default RegularButton