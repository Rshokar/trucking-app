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
import { View, Text } from 'react-native';
import ValidateEmail from './components/ValidateEmail';

const HomeContainer = styled.View`
    width: 100%; 
    flex: 1;
`

/*
VALIDATED: User has validated there email
NOT_VALIDATED: User haa not valdated there email
LOADING: App is currently in the process of checking if the email is validatedF
*/
enum USER_STATE {
    VALIDATED, NOT_VALIDATED, LOADING
}

export type Props = StackScreenProps<RoofStackParamList, "Home">

const Home: FunctionComponent<Props> = ({ navigation, route }) => {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [filterCustomers, setFilteredCustomers] = useState<Set<Customer>>(new Set<Customer>());
    const [customerCacheId] = useState<string>(uuid.v4() as string)
    const [userState, setUserState] = useState<USER_STATE>(USER_STATE.LOADING);

    useEffect(() => {
        const customerCache = Cache.getInstance(Customer);
        setCustomers([...customerCache.getData()])
        customerCache.subscribe({
            id: customerCacheId,
            onChange: setCustomers
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
            {
                route.params?.user.emailValidated ?

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
                    :
                    <ValidateEmail onCompletion={function (): void {
                        const user = route.params.user;
                        user.emailValidated = true;
                        navigation.navigate('Home', { company: route.params?.company, user: user })
                    }} />
            }
        </HomeContainer>
    )
}

export default Home
