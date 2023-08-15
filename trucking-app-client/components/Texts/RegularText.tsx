import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { TextProps } from './types'

import { colors } from '../colors'

const StyledText = styled.Text`
    font-size: 15px;
    color: ${colors.gray};
    text-align: left;
    font-family: Lato-Bold;
`


const RegularText: FunctionComponent<TextProps> = (props: TextProps) => {
    return <StyledText style={props.textStyle}>{props.children}</StyledText>
}

export default RegularText