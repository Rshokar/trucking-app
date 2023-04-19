import React from 'react'
import { KeyboardAvoidingView, Platform, StyleProp, ViewStyle } from 'react-native'

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
    paddingHorizontal: '5%',
    gap: 20
}

const Form = (props: FormProps) => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
            style={container}
            enabled
        >
            {props.children}

        </KeyboardAvoidingView>
    )
}

export default Form