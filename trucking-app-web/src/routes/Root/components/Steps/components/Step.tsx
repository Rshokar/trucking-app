import React, { CSSProperties, ReactNode } from 'react'
import styled from 'styled-components'
import { Container } from '../../../../../components/shared'
import { Typography, useTheme } from '@mui/material'
import { useMediaQuery } from 'react-responsive';

import Break from '../../../../../components/Break/Break'
import { device } from '../../../../../components/devices'

const StepContainer = styled(Container)`
    width: 300px;
    padding: 20px;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: space-evenly;
    gap: 20px;
`

type Props = {
    color: string;
    breakColor: string
    style?: CSSProperties
    step: {
        title: string;
        stepName: string;
        SVG: ReactNode;
        callToActionButtons?: ReactNode;
        callToAction: string;
    }
}

const Step = (props: Props) => (
    <StepContainer
        style={{ backgroundColor: props.color, ...props.style }}
    >
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '25%',
            }}
        >
            <Typography variant='h3' style={{ textAlign: 'center' }}>
                {props.step.title}
            </Typography>
            <Typography variant='subtitle1' style={{ textAlign: 'center' }}>
                {props.step.stepName}
            </Typography>
        </div>
        {props.step.SVG}
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            flexDirection: 'column'
        }}>
            {props.step.callToActionButtons}
            <Typography variant='subtitle2' color='white' maxWidth='75%'>
                {props.step.callToAction}
            </Typography>
            <Break style={{ height: '3px', backgroundColor: props.breakColor }} />
        </div>
    </StepContainer>
)

export default Step