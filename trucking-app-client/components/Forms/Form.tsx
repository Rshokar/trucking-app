import React from 'react'
import styled from 'styled-components/native'

const StyledView = styled.View`
    flex-direction: column; 
    justify-content: center; 
    align-content: center;
    width: 100%
    height: 100%;
    padding: 10%;
    gap: 20px
`

type FormProps = {
    children: React.ReactNode
}

const Form = (props: FormProps) => {
    return (
        <StyledView>
            {props.children}
        </StyledView>
    )
}

export default Form