import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { TextProps } from './types'

import { colors } from '../colors'

const StyledText = styled.text`
    font-size: 15px;
    color: ${colors.gray};
    text-align: left, 
    font-family: Lato-Bold
`


const RegularText: FunctionComponent<TextProps> = (props: TextProps) => {
    return <>  </>
}

export default RegularText