import React, { FunctionComponent, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import styled from 'styled-components/native'
import uuid from 'react-native-uuid';

import { Tabs, TabScreen } from 'react-native-paper-tabs'

import { RoofStackParamList } from '../../navigators/RoofStack'
import { Customer } from '../../models/Customer'

import DispatchSection from '../../components/TicketSections/DispatchSection'
import OperatorSection from '../../components/TicketSections/OperatorSection'
import CustomerSection from '../../components/TicketSections/CustomerSection'
import Cache from '../../utils/Cache'
import { Operator } from '../../models/Operator';

const HomeContainer = styled.View`
    width: 100%; 
    flex: 1;
`

export type Props = StackScreenProps<RoofStackParamList, "Home">

const Home: FunctionComponent<Props> = ({ navigation, route }) => {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [filterCustomers, setFilteredCustomers] = useState<Set<Customer>>(new Set<Customer>());
    const [customerCacheId] = useState<string>(uuid.v4() as string)


    useEffect(() => {
        const customerCache = Cache.getInstance(Customer);
        const operatorCache = Cache.getInstance(Operator);
        setCustomers([...customerCache.getData()])
        customerCache.subscribe({
            id: customerCacheId,
            onChange: setCustomers
        })

        operatorCache.subscribe({
            id: customerCacheId,
            onChange: (data: Operator[]) => {
                console.log("CHANGE", data);
            }
        })
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
                <TabScreen label={""} icon={'book'}>
                    <DispatchSection
                        removeCustomerFilter={handleCustomerFilter}
                        filteringCustomers={filterCustomers}
                        customers={customers}
                        navigateToTickets={(dispId: string): void => navigation.navigate("Tickets", { dispId: parseFloat(dispId) })}
                    />
                </TabScreen>
                <TabScreen label="" icon="excavator">
                    <CustomerSection
                        navigateToTicket={handleCustomerFilter} />
                </TabScreen>
                <TabScreen label="" icon={'account-hard-hat'} >

                    <OperatorSection
                        navigate={navigation.navigate}
                        navigateToTicket={ticketId => console.log("HELLO WORLD", ticketId)} />
                </TabScreen>
            </Tabs>
        </HomeContainer>
    )
}

export default Home
