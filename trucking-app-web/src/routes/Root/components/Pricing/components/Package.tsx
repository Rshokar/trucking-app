import { FC } from 'react'
import { Typography } from '@mui/material';
import { Container } from '../../../../../components/shared';
import { styled } from 'styled-components';
import Break from '../../../../../components/Break/Break';


const PackageContainer = styled(Container) <{ color: string }>`
  background-color: ${props => props.color};
  height: 240px;
  max-width: 90%; 
  width: 400px;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  padding: 20px; 
  box-sizing: border-box; 
  gap: 10px;
`


interface Props {
  title: string;
  monthRange: string;
  dayRange: string;
  color: string;
  breakColor: string;
  pricePerRFO: string;
  totalPrice: number
}

const Package: FC<Props> = ({ title, monthRange, dayRange, color, breakColor, pricePerRFO, totalPrice }) => (
  <PackageContainer color={color}>
    <Typography variant='h5' color='white' textAlign='left' width='100%' fontWeight='bold'>
      {monthRange}
    </Typography>
    <Typography variant='h4' color='white' fontWeight='bold' textAlign='left'>
      ${pricePerRFO}/RFO  <br />  ${totalPrice}/month

    </Typography>
    <Typography color='white' width='100%' fontWeight='bold'>
      {dayRange}
    </Typography>
    <Break style={{ width: '100%', backgroundColor: breakColor }} />
  </PackageContainer >
)


export default Package