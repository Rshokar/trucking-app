import React from 'react'
import Step from './components/Step'
import styled from 'styled-components'
import { Container } from '../../../../components/shared'
import { useTheme } from '@mui/material'

const StepsContainer = styled(Container)`
    flex-direction: column;

`

type Props = {}

const Steps = (props: Props) => {
    const theme = useTheme();

    return (
        <StepsContainer>
            <Step color={theme.palette.primary.main} breakColor={theme.palette.secondary.main} />
            <Step color={theme.palette.secondary.main} breakColor={theme.palette.primary.main} />
            <Step color={theme.palette.primary.main} breakColor={theme.palette.secondary.main} />
            <Step color={theme.palette.secondary.main} breakColor={theme.palette.primary.main} />
        </StepsContainer>
    )
}

export default Steps