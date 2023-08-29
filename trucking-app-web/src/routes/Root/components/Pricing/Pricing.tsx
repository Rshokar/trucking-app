import React from 'react'
import { Typography, useTheme } from '@mui/material';
import styled from 'styled-components';
import { Container } from '../../../../components/shared';
import Package from './components/Package';


const PricingContainer = styled(Container)`
    background-color: white;
    gap: 40px;
    flex-direction: column; 
    padding: 40px 10px 0px 10px; 
`

const PackageContainer = styled(Container)`
    gap: 40px;
    flex-wrap: wrap; 
    flex-basis: calc(50% - 10px);
`

const Message = styled(Container)`
    flex-direction: column;
    gap: 20px;
`

const Pricing = () => {

    const theme = useTheme();

    return (
        <PricingContainer>
            <Message >
                <Typography variant='h3' fontWeight='bold'>
                    Teared Pricing
                </Typography>
                <Typography textAlign='center' maxWidth='400px' variant='h6'>
                    With teared pricing get charged for how much you use. Because one consistency is the inconsistency of logistics
                </Typography>
            </Message>
            <PackageContainer>

                <Package
                    title='BEGINNER'
                    monthRange="70-120 RFO'S PER MONTH"
                    dayRange="On average of 0-5 RFO's per day"
                    color={theme.palette.secondary.main}
                    breakColor={theme.palette.primary.main}
                />
                <Package
                    title='STANDARD'
                    monthRange="120-360 RFO'S PER MONTH"
                    dayRange="On average of 6-15 RFO's per day"
                    color={theme.palette.primary.main}
                    breakColor={theme.palette.secondary.main}

                />
                <Package
                    title='PROFESSIONAL'
                    monthRange="360-720 RFO'S PER MONTH"
                    dayRange="On average of 15-30 RFO's per day"
                    color={theme.palette.secondary.main}
                    breakColor={theme.palette.primary.main}
                />
                <Package
                    title='ENTERPRISE'
                    monthRange="720+ RFO'S PER MONTH"
                    dayRange="On average of 30+ RFO's per day"
                    color={theme.palette.primary.main}
                    breakColor={theme.palette.secondary.main}
                />
            </PackageContainer>
        </PricingContainer>
    )
}

export default Pricing