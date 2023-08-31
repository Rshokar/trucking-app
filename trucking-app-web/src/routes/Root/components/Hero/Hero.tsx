import styled from 'styled-components';
import { Container } from '../../../../components/shared';
import { device } from '../../../../components/devices';
import { Typography, useTheme } from '@mui/material';
import Break from '../../../../components/Break/Break';
import DumpTruckSvg from '../../../../components/SVGS/DumpTruckSvg';
import DownloadApp from '../../../../components/DownloadApp/DownloadApp';
import { useMediaQuery } from 'react-responsive';
const HeroContainer = styled(Container)`
    background-color: white;
    height: 100vh;
    width: 100%;

    @media(${device.tablet}) {
        height: 90vh; 
    }

    @media(${device.laptop}) {
        height: 80vh; 
    }

`

const ContentWrapper = styled(Container)`
    flex-direction: column;

    @media(${device.laptop}) {
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

    const isDesktop = useMediaQuery({ query: device.laptopL });


    return (
        <HeroContainer>
            <ContentWrapper>
                <HeroSection>
                    <Typography variant={isDesktop ? 'h1' : 'h3'} style={{ fontWeight: 'bold' }} textAlign={'center'}>TARE TICKETING</Typography>
                    <Break />
                    <Typography variant={isDesktop ? 'h4' : 'subtitle1'} fontWeight={'bold'} textAlign='center'>Drop the books and pick up the future</Typography>
                </HeroSection>
                <HeroSection>
                    <HeroSection>
                        <DumpTruckSvg height={isDesktop ? '30rem' : '200px'} width={isDesktop ? '30rem' : '300px'} />
                    </HeroSection>
                    <HeroSection>
                        <Typography variant={isDesktop ? 'h6' : 'subtitle2'} textAlign='center' padding={'10px'} maxWidth={'450px'}>
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