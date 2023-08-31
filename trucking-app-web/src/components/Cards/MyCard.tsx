import React, { ReactNode } from 'react'
import { Typography } from '@mui/material'
import styled from 'styled-components'

const Container = styled.div`
width: 90%;
max-width: 500px;
background-color: white;
padding: 20px; 
box-sizing: border-box;
display: flex; 
flex-direction: column; 
align-items: center; 
`

const Header = styled.div`
    display: flex; 
    flex-direction: column; 
    align-items: center;
`
type MyCardProps = {
    title: string;
    subtitle: string;
    svg?: ReactNode;
    children?: ReactNode;
}

const MyCard = ({ title, subtitle, svg, children }: MyCardProps) => (
    <Container>
        {svg}
        <Header>
            <Typography variant="subtitle1" fontWeight={'bold'}>{title}</Typography>
            <Typography variant='subtitle2' textAlign={'center'}>{subtitle}</Typography>
        </Header>
        {children}
    </Container>
)


export default MyCard