import React, { FunctionComponent, useEffect, useState } from 'react'
import { Dimensions, View } from 'react-native';
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
    const [enablePaginate, setEnablePaginate] = useState<boolean>(false);
    // Get dispatches
    useEffect(() => {
        async function run() {
            try {
                const dispatches: Dispatch[] = await new DispatchController().getAll(query);
                setEnablePaginate(dispatches.length === query.limit);
                setDispatches(dispatches)
            } catch (error: any) {
                console.log(error.message);
            }
        }
        setDispatches([]);
        run();
    }, [customers]);

    // Get Customers
    useEffect(() => {
        async function run() {
            setCustomers(await AuthController.getCustomers());
        }
        run()
    }, [])


    const paginate = () => {

        console.log("PAGINATING", query);
        if (enablePaginate) {
            query.page = query.page + 1;
            setQuery({ ...query });
            setEnablePaginate(false);
        }
    }


    // Add a new customer to the dispatch query
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


    // Date range for dispatch query
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
            <View style={{ height: 150 }}>
                <DateRangeCalendar
                    setDate={setDate}
                    startDate={query.startDate}
                    endDate={query.endDate}
                    reset={() => {
                        query.endDate = undefined;
                        query.startDate = undefined;
                        setQuery({ ...query })
                    }}
                >
                </DateRangeCalendar>
            </View>
            <TicketSection
                data={dispatches}
                render={function ({ item }: any) {
                    return <DispatchItem {...item} />
                }}
                paginate={paginate}

            />
            <CustomerSection data={customers} onClick={handleAddCustomer} />
        </HomeContainer>
    )
}

export default Home