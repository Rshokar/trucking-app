import React, { FunctionComponent, useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import styled from 'styled-components/native'
import { StackScreenProps } from '@react-navigation/stack'

import { colors } from '../components/colors'
import { Container } from '../components/shared'

import logo from '../assets/icon.png';
import CardSection from '../components/Cards/CardSection'
import TransactionSection from '../components/Transactions/TransactionSection'
import SendMoneySection from '../components/SendMoney/SendMoneySection'
import { Dispatch, DispatchQuery } from '../models/Dispatch'

const HomeContainer = styled(Container)`
    background-color: ${colors.graylight};
    width: 100%; 
    flex: 1
`

import portrait from '../assets/portrait.jpg'

import { RoofStackParamList } from '../navigators/RoofStack'

export type Props = StackScreenProps<RoofStackParamList, "Home">

const Home: FunctionComponent = () => {

    const [dispatch, setDispatch] = useState<Dispatch[]>([]);

    useEffect(() => {
        async function run() {
            const q: DispatchQuery = new DispatchQuery();

            q.model = new Dispatch();
            q.model.company_id = 1;

            console.log("GET DISPATCHES", q.model);

            try {
                const dispatches = await q.get();
                console.log(dispatches);
            } catch (error: any) {
                console.log(error.message);
            }
        }

        run();
    }, []);
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

    const sendMoneyData = [
        {
            id: 1,
            name: "Rod Williams",
            amount: "$25.00",
            background: colors.primary,
            img: portrait
        },
        {
            id: 2,
            name: "Rob Wilhiam",
            amount: "$5.00",
            background: colors.secondary,
            img: portrait
        },
        {
            id: 1,
            name: "Rog Villiams",
            amount: "$25.01",
            background: colors.tertiary,
            img: portrait
        },
    ]

    return (
        <HomeContainer>
            <StatusBar style='dark' />
            <CardSection data={cardsData} />
            <TransactionSection data={transactionData} />
            <SendMoneySection data={sendMoneyData} />
        </HomeContainer>
    )
}

export default Home