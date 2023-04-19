import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { colors } from '../colors'

export const StyledView = styled.View`
    border-bottom-width: 10px;
    border-bottom-color: ${colors.tertiary};
    padding: 10px
    margin-left: 20px
    margin-right: 20px
    margin-bottom: 20px
`

import { BreakProps } from './types'

const Break: FunctionComponent<BreakProps> = (props) => {
    return (
        <StyledView style={props.style}></StyledView>
    )
}

export default Break