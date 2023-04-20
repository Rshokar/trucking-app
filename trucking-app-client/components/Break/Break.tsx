import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { ViewStyle } from 'react-native'


import { colors } from '../colors'

export const StyledView = styled.View`
    background-color: ${colors.tertiary};
    padding: 2.5px;
    margin: 25px;
    border-radius: 5px;
    justify-content: center;
    align-items: center
`

interface BreakProps {
    style?: ViewStyle,
    innerRef: React.MutableRefObject<null>,
    children?: React.ReactNode
}

const Break: FunctionComponent<BreakProps> = (props) => {
    return (
        <StyledView ref={props.innerRef} style={props.style}>{props.children}</StyledView>
    )
}

export default Break