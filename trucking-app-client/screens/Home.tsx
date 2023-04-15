import React, { FunctionComponent } from 'react'
import { StatusBar } from 'expo-status-bar'
import styled from 'styled-components/native'

import { colors } from '../components/colors'
import { Container } from '../components/shared'

import logo from '../assets/icon.png';
import CardSection from '../components/Cards/CardSection'
import TransactionSection from '../components/Transactions/TransactionSection'

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


    const transactionData = [
        {
            id: 1,
            amount: "-$86.00",
            date: "14 Sep 2021",
            title: "Taxi",
            subtitle: "Uber car",
            art: {
                background: colors.primary,
                icon: "car"
            },
        },
        {
            id: 2,
            amount: "-$41.00",
            date: "14 Sep 2021",
            title: "Shopping",
            subtitle: "Ali Express",
            art: {
                background: colors.secondary,
                icon: "cart"
            },
        },
        {
            id: 3,
            amount: "-$586.00",
            date: "14 Aug 2021",
            title: "Travel",
            subtitle: "Emirates",
            art: {
                background: colors.tertiary,
                icon: "airplane"
            },
        }
    ]
    return (
        <HomeContainer>
            <StatusBar style='dark' />
            <CardSection data={cardsData} />
            <TransactionSection data={transactionData} />
        </HomeContainer>
    )
}

export default Home