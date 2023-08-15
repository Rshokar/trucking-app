import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

type FormProps = {
    children: React.ReactNode
}

const FormView = styled.View`
    display: flex; 
    flex-directio: column;
    justify-content: flex-start; 
    padding-horizontal: 5%;
    padding-vertical: 10%;
    align-items: center; 
    width: 100%; 
    height: 100%; 
    gap: 20px;
`

const Form = (props: FormProps) => {
    return (<FormView>
        {props.children}
    </FormView>

    )
}

export default Form