import styled from 'styled-components';
import { Container } from '../../../../components/shared';
import { device } from '../../../../components/devices';
import { Typography, useTheme } from '@mui/material';
import Break from '../../../../components/Break/Break';
import DumpTruckSvg from '../../../../components/SVGS/DumpTruckSvg';
import DownloadApp from '../../../../components/DownloadApp/DownloadApp';

const HeroContainer = styled(Container)`
    background-color: white;
    height: 100vh;
    width: 100%;


    @media(${device.tablet}) {
        height: 90vh; 
    }

`

const ContentWrapper = styled(Container)`

    flex-direction: column;

    @media(${device.tablet}) {
        flex-direction: row;
        height: 90vh;
    }
`

const HeroSection = styled(Container)`
    flex: 1;
    flex-direction: column;
    gap: 10px;
`

const Hero = () => {
    const theme = useTheme();

    return (
        <HeroContainer>
            <ContentWrapper>
                <HeroSection>
                    <Typography variant='h3' style={{ fontWeight: 'bold' }} textAlign={'center'}>TARE TICKETING</Typography>
                    <Break />
                    <Typography variant='subtitle1' fontWeight={'bold'}>Drop the books and pick up the future</Typography>
                </HeroSection>
                <HeroSection>
                    <HeroSection>
                        <DumpTruckSvg height={'300px'} width={'300px'} />
                    </HeroSection>
                    <HeroSection>
                        <Typography textAlign='center' variant='caption' padding={'10px'} fontWeight='bold'>
                            SIMPLE AND EASY TICKET AND DISPATCH MANAGMENT FOR AGGREGATE LOGISTICS DISPATCHERS
                        </Typography>
                        <DownloadApp />
                        <Typography variant='caption' fontWeight='bold'>
                            DOWNLOAD
                        </Typography>
                    </HeroSection>
                </HeroSection>
            </ContentWrapper>
        </HeroContainer>
    )
}

export default Hero