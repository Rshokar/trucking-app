import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { TextProps } from './types'

import { colors } from '../colors'

const StyledText = styled.text`
    font-size: 13px;
    color: ${colors.gray};
    text-align: left, 
    font-family: Lato-Regular
`


const SmallText: FunctionComponent<TextProps> = (props: TextProps) => {
    return <>  </>
}

export default SmallText