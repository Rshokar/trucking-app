import React, { FunctionComponent, useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import styled from 'styled-components/native'
import { StackScreenProps } from '@react-navigation/stack'
import { DateData } from 'react-native-calendars'

import { colors } from '../components/colors'
import { Container } from '../components/shared'

import logo from '../assets/icon.png';
import CardSection from '../components/Cards/CardSection'
import TransactionSection from '../components/Transactions/TransactionSection'
import SendMoneySection from '../components/SendMoney/SendMoneySection'
import RegularButton from '../components/Buttons/RegularButton'
import { AuthController } from '../controllers/AuthController'
import DateRangeCalendar from '../components/Calendars/DateRangeCalendar'

import { DispatchController } from '../controllers/DispatchController'
import { Dispatch, DispatchQuery } from '../models/Dispatch'

const HomeContainer = styled(Container)`
    background-color: ${colors.graylight};
    width: 100%; 
    flex: 1
`

import portrait from '../assets/portrait.jpg'

import { RoofStackParamList } from '../navigators/RoofStack'

export type Props = StackScreenProps<RoofStackParamList, "Home">

const Home: FunctionComponent<Props> = ({ navigation }) => {

    const [dispatch, setDispatch] = useState<Dispatch[]>([]);
    const [query, setQuery] = useState<DispatchQuery>(new DispatchQuery());

    useEffect(() => {
        async function run() {
            const q: DispatchQuery = new DispatchQuery();

            q.company_id = 1;

            try {
                const dispatches: Dispatch = await new DispatchController().get(q);
                console.log("DISPATCHES", dispatches);
            } catch (error: any) {
                console.log(error.message);
            }

            console.log("CURRENTLY LOGGED IN USER: ", await AuthController.getUser())
            console.log("CURRENTLY LOGGED IN COMPANY: ", await AuthController.getCompany())
        }
        run();
    }, []);

    useEffect(() => {
        console.log('QUERY USER EFFECT: ', query)
        async function run() {

        }

        run();

    }, [query])

    const setDate = (date: DateData) => {
        if (!query.startDate || (query.startDate && query.endDate)) {
            query.startDate = date;
            query.endDate = undefined;
        } else if (date.timestamp < query.startDate.timestamp) {
            query.startDate = date
        } else {
            query.endDate = date;
        }
        setQuery({ ...query });
    }

    const logout = async () => {
        try {
            await AuthController.logOut()
            navigation.navigate("Welcome");
        } catch (error: any) {
            console.log("ERROR", error);
        }
    }

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

    console.log("DATE RANGE: ", query.startDate, query.endDate)

    return (
        <HomeContainer>
            <StatusBar style='dark' />
            <DateRangeCalendar
                setDate={setDate}
                startDate={query.startDate}
                endDate={query.endDate}
            >
                <TransactionSection data={transactionData} />
            </DateRangeCalendar>
            <SendMoneySection data={sendMoneyData} />
        </HomeContainer>
    )
}

export default Home