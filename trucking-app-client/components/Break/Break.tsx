import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { ViewStyle } from 'react-native'


import { colors } from '../colors'

export const StyledView = styled.View`
    background-color: ${colors.tertiary};
    padding: 20px
    margin: 25px
    border-radius: 5px
`

interface BreakProps {
    style?: ViewStyle,
    innerRef: React.MutableRefObject<null>
}

const Break: FunctionComponent<BreakProps> = (props) => {
    return (
        <StyledView ref={props.innerRef} style={props.style}></StyledView>
    )
}

export default Break