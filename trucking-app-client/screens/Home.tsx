import React, { FunctionComponent, useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import styled from 'styled-components/native'
import { StackScreenProps } from '@react-navigation/stack'
import { DateData } from 'react-native-calendars'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { colors } from '../components/colors'
import { Container } from '../components/shared'

import TransactionSection from '../components/Transactions/TransactionSection'
import CustomerSection from '../components/Customers/CustomerSection'
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
import { Customer } from '../models/Customer'

export type Props = StackScreenProps<RoofStackParamList, "Home">

const Home: FunctionComponent<Props> = ({ navigation }) => {

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [dispatch, setDispatch] = useState<Dispatch[]>([]);
    const [query, setQuery] = useState<DispatchQuery>(new DispatchQuery());

    useEffect(() => {
        async function run() {
            const q: DispatchQuery = new DispatchQuery();
            q.company_id = 1;
            try {
                const dispatches: Dispatch = await new DispatchController().get(q);
            } catch (error: any) {
                console.log(error.message);
            }
            setCustomers(await AuthController.getCustomers());
        }
        run();
    }, []);

    useEffect(() => {
        console.log('QUERY USER EFFECT: ', query)
        async function run() {

        }

        run();

    }, [query])

    const handleAddCustomer = (id: number) => {
        if (!query.customers) {
            query.customers = new Set<number>();
        }

        if (query.customers.has(id))
            query.customers.delete(id)
        else
            query.customers.add(id);
        setQuery({ ...query });
    }

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

    console.log('QUERY:', query);

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
            <CustomerSection data={customers} onClick={handleAddCustomer} />
        </HomeContainer>
    )
}

export default Home