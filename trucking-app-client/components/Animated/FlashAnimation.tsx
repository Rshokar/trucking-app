import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { colors } from '../colors'

const StyledFlashAnimationView = styled.View`
    width: 100%;
    height: 30px;
    background-color: ${colors.success};
`


import { AnimationProps } from './types'
export interface FlashAnimationProps extends AnimationProps {
    color?: string,
    duration?: number
}

const FlashAnimation: FunctionComponent<FlashAnimationProps> = (props) => {


    return <StyledFlashAnimationView>
        {props.children}
    </StyledFlashAnimationView>
}

export default FlashAnimation