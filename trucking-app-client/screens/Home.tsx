import React, { FunctionComponent } from 'react'
import { StatusBar } from 'expo-status-bar'
import styled from 'styled-components/native'

import { colors } from '../components/colors'
import { Container } from '../components/shared'

import logo from '../assets/icon.png';
import CardSection from '../components/Cards/CardSection'

const HomeContainer = styled(Container)`
    background-color: ${colors.graylight};
    width: 100%; 
    flex: 1
`



const Home: FunctionComponent = () => {

    const cardsData = [
        {
            id: 1,
            accountNo: "3845757744",
            balance: 20000.15,
            alias: "Work Debit",
            logo: logo
        },
        {
            id: 2,
            accountNo: "3845757744",
            balance: 12000.15,
            alias: "Personal Prepaid",
            logo: logo
        },
        {
            id: 3,
            accountNo: "3845757744",
            balance: 2000.15,
            alias: "School Prepaid",
            logo: logo
        },
    ]
    return (
        <HomeContainer>
            <StatusBar style='dark' />
            <CardSection data={cardsData} />
        </HomeContainer>
    )
}

export default Home