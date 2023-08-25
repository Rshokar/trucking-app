import React, { CSSProperties } from 'react'
import { styled } from 'styled-components'
import { useTheme } from '@mui/material'


// This component is just a bar that acts as a spacer.
type Props = {
    style?: CSSProperties,
}

const StyledBreak = styled.div`
    width: 200px;
    height: 5px;
`


const Break = (props: Props) => {

    const theme = useTheme();
    return (
        <StyledBreak style={{
            backgroundColor: theme.palette.secondary.main,
            ...props.style
        }} />
    )
}

export default Break