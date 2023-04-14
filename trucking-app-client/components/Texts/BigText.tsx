import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { TextProps } from './types'

import { colors } from '../colors'

const StyledText = styled.Text`
    font-size: 37px;
    color: ${colors.white};
    text-align: left;
    font-family: Lato-Bold;
`


const BigText: FunctionComponent<TextProps> = (props: TextProps) => {
    return <StyledText style={props.textStyle}>{props.children}</StyledText>
}

export default BigText