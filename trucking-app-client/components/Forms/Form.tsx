learimport React from 'react'
import styled from 'styled-components/native'
import { KeyboardAvoidingView, Platform, StyleProp, ViewStyle } from 'react-native'

const StyledView = styled.View`
    flex-direction: column; 
    justify-content: center; 
    align-content: center;
    width: 100%
    height: 100%;
    padding: 5%;
    gap: 20px
`

type FormProps = {
    children: React.ReactNode
}

const container: StyleProp<ViewStyle> = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: 5,
    gap: 20
}

const Form = (props: FormProps) => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
            style={container}
            enabled
        >
            <StyledView>
                {props.children}
            </StyledView>
        </KeyboardAvoidingView>
    )
}

export default Form