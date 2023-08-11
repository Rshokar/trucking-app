import React, { FunctionComponent, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import styled from 'styled-components/native'

import { Tabs, TabScreen, useTabNavigation } from 'react-native-paper-tabs'

import { AuthController } from '../../controllers/AuthController'
import { DispatchController } from '../../controllers/DispatchController'
import { RoofStackParamList } from '../../navigators/RoofStack'
import { Customer, CustomerQuery } from '../../models/Customer'
import { Dispatch, DispatchQuery } from '../../models/Dispatch'

import DispatchSection from '../../components/TicketSections/DispatchSection'
import OperatorSection from '../../components/TicketSections/OperatorSection'
import CustomerSection from '../../components/TicketSections/CustomerSection'
import { CustomerController } from '../../controllers/CustomerController'
import { number } from 'yup'
import { View, Text } from 'react-native'

const HomeContainer = styled.View`
    width: 100%; 
    flex: 1;
`

export type Props = StackScreenProps<RoofStackParamList, "Home">

const Home: FunctionComponent<Props> = ({ navigation, route }) => {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [filterCustomers, setFilteredCustomers] = useState<Set<Customer>>(new Set<Customer>());


    useEffect(() => {
        async function fetchCustomers() {
            const cC = new CustomerController();
            const cQ = new CustomerQuery();
            cQ.limit = 100
            const customerList = await cC.getAll(cQ)
            setCustomers(customerList)
        }
        fetchCustomers()
    }, [])

    // Here we will add or remove the customer from the set. 
    // If they are in the set already, then they are removed
    const handleCustomerFilter = (cus: Customer) => {
        if (filterCustomers.has(cus)) filterCustomers.delete(cus)
        else filterCustomers.add(cus);
        setFilteredCustomers(new Set<Customer>(filterCustomers))
    }


    return (
        <HomeContainer>
            <Tabs>
                <TabScreen label="Dispatches">
                    <DispatchSection
                        removeCustomerFilter={handleCustomerFilter}
                        filteringCustomers={filterCustomers}
                        customers={customers}
                        navigateToTickets={(dispId: string): void => navigation.navigate("Tickets", { dispId: parseFloat(dispId) })}
                    />
                </TabScreen>
                <TabScreen label="Customers">
                    <CustomerSection
                        navigateToTicket={handleCustomerFilter} />
                </TabScreen>
                <TabScreen label="Operators">

                    <OperatorSection
                        navigate={navigation.navigate}
                        navigateToTicket={ticketId => console.log("HELLO WORLD", ticketId)} />
                </TabScreen>
            </Tabs>
        </HomeContainer>
    )
}

export default Home
