import React, { CSSProperties, ReactNode } from 'react'
import styled from 'styled-components'
import { Container } from '../../../../../components/shared'
import { Typography, useTheme } from '@mui/material'
import { useMediaQuery } from 'react-responsive';

import Break from '../../../../../components/Break/Break'
import { device } from '../../../../../components/devices'

const StepContainer = styled(Container)`
    height: 90vh;
    width: 100%; 

    @media(${device.tablet}) {
        height: 70vh;
    }
`

const ContentContainer = styled(Container)`
    height: 90vh; 
    max-width: 500px;
    flex-direction: column;
    justify-content: space-evenly;
    gap: 20px;

    
    @media(${device.tablet}) {
        height: 50vh;
        }
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
        <ContentContainer>
            <div>
                <Typography variant='h4' style={{ color: 'white' }}>
                    {props.step.title}
                </Typography>
                <Typography variant='h6' style={{ color: 'white' }}>
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
                <Typography variant='subtitle1' color='white' maxWidth='75%'>
                    {props.step.callToAction}
                </Typography>
                <Break style={{ height: '3px', backgroundColor: props.breakColor }} />
            </div>
        </ContentContainer>
    </StepContainer>
)

export default Step