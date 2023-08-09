import React, { FunctionComponent, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import styled from 'styled-components/native'

import { Tabs, TabScreen, useTabNavigation } from 'react-native-paper-tabs'

import { AuthController } from '../../controllers/AuthController'
import { DispatchController } from '../../controllers/DispatchController'
import { RoofStackParamList } from '../../navigators/RoofStack'
import { Customer } from '../../models/Customer'
import { Dispatch, DispatchQuery } from '../../models/Dispatch'

import DispatchSection from '../../components/TicketSections/DispatchSection'
import OperatorSection from '../../components/TicketSections/OperatorSection'
import CustomerSection from '../../components/TicketSections/CustomerSection'

const HomeContainer = styled.View`
    width: 100%; 
    flex: 1;
`

export type Props = StackScreenProps<RoofStackParamList, "Home">

const Home: FunctionComponent<Props> = ({ navigation }) => {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [dispatches, setDispatches] = useState<Dispatch[]>([])
    const [filterCustomers, setFilteredCustomers] = useState<Set<Customer>>(new Set<Customer>());
    const [query] = useState<DispatchQuery>(new DispatchQuery())
    const [paginate, setEnablePaginate] = useState<boolean>(false)


    useEffect(() => {
        async function fetchDispatches() {
            const dispatchController = new DispatchController()
            const disRes: Dispatch[] = await dispatchController.getAll(query)
            if (query.page === 0) {
                setDispatches(disRes)
            } else {
                setDispatches([...dispatches, ...disRes])
            }
            setEnablePaginate(disRes.length === query.limit)
        }
        fetchDispatches()
    }, [query])

    useEffect(() => {
        async function fetchCustomers() {
            const customerList = await AuthController.getCustomers()
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

    console.log(filterCustomers)
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
                        navigateToTicket={ticketId => console.log("HELLO WORLD", ticketId)} />
                </TabScreen>
            </Tabs>
        </HomeContainer>
    )
}

export default Home
