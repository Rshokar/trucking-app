import React, { CSSProperties, ReactNode } from 'react'
import styled from 'styled-components'
import { Container } from '../../../../../components/shared'
import { ButtonGroup, Typography } from '@mui/material'

import Break from '../../../../../components/Break/Break'

const StepContainer = styled(Container)`
    height: 90vh;
    width: 100%; 
`

const ContentContainer = styled(Container)`
    height: 90vh; 
    max-width: 500px;
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

const Step = (props: Props) => {
    return (
        <StepContainer
            style={{ backgroundColor: props.color, ...props.style }}
        >
            <ContentContainer>
                <div>
                    <Typography variant='h4' style={{ fontWeight: 'bold', color: 'white' }}>
                        {props.step.title}
                    </Typography>
                    <Typography variant='h6' style={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
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
                    <Typography variant='subtitle1' fontWeight='bold' textAlign='center' color='white' maxWidth='75%'>
                        {props.step.callToAction}
                    </Typography>
                    <Break style={{ height: '3px', backgroundColor: props.breakColor }} />
                </div>
            </ContentContainer>
        </StepContainer>
    )
}

export default Step