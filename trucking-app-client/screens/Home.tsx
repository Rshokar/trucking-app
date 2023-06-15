import React, { FunctionComponent, useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import styled from 'styled-components/native'
import { StackScreenProps } from '@react-navigation/stack'
import { DateData } from 'react-native-calendars'

import { colors } from '../components/colors'
import { Container } from '../components/shared'

import TicketSection from '../components/Tickets/TicketSection'
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


import { RoofStackParamList } from '../navigators/RoofStack'
import { Customer } from '../models/Customer'
import DispatchItem from '../components/Tickets/DispatchItem'

export type Props = StackScreenProps<RoofStackParamList, "Home">

const Home: FunctionComponent<Props> = ({ navigation }) => {

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [dispatches, setDispatches] = useState<Dispatch[]>([]);
    const [query, setQuery] = useState<DispatchQuery>(new DispatchQuery());

    useEffect(() => {
        async function run() {

            console.log("\n\nRENDER RENDER\n\n")
            try {
                const dispatches: Dispatch[] = await new DispatchController().getAll(query);
                // console.log(dispatches)
                setDispatches(dispatches)
            } catch (error: any) {
                console.log(error.message);
            }
        }
        run();
    }, [query]);

    useEffect(() => {
        async function run() {
            setCustomers(await AuthController.getCustomers());
        }
        run()
    }, [])

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
        if (!query.startDate || (query.startDate.dateString === date.dateString) || (query.startDate && query.endDate)) {
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

    return (
        <HomeContainer>
            <StatusBar style='dark' />
            <DateRangeCalendar
                setDate={setDate}
                startDate={query.startDate}
                endDate={query.endDate}
            >
                <TicketSection data={dispatches}
                    render={function ({ item }: any) {
                        return <DispatchItem {...item} />
                    }}


                />
            </DateRangeCalendar>
            <CustomerSection data={customers} onClick={handleAddCustomer} />
        </HomeContainer>
    )
}

export default Home