import React, { CSSProperties, ReactNode } from 'react'
import styled from 'styled-components'
import { Container } from '../../../../../components/shared'
import { ButtonGroup, Typography } from '@mui/material'
import DownloadSVG from '../../../../../components/SVGS/DownloadSVG'
import DownloadApp from '../../../../../components/DownloadApp/DownloadApp'
import Break from '../../../../../components/Break/Break'
const StepContainer = styled(Container)`
    height: 90vh;
    width: 100vw; 
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
                    <Typography variant='h5' style={{ fontWeight: 'bold', color: 'white' }}>
                        Download the app
                    </Typography>
                    <Typography variant='subtitle1' style={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                        STEP ONE
                    </Typography>
                </div>
                <DownloadSVG width={'250px'} height={'250px'} stroke='white' />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    flexDirection: 'column'
                }}>
                    <DownloadApp
                        iosButtonStyle={{ border: '1px solid white' }}
                        playStoreButtonStyle={{ border: '1px solid white' }}
                    />
                    <Typography variant='subtitle2' fontWeight='bold' color='white'>
                        Download the app and register
                    </Typography>
                    <Break style={{ height: '3px', backgroundColor: props.breakColor }} />
                </div>
            </ContentContainer>
        </StepContainer>
    )
}

export default Step