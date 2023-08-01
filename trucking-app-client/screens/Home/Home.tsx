import React, { FunctionComponent, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import styled from 'styled-components/native'

import { Tabs, TabScreen } from 'react-native-paper-tabs'

import DispatchSection from './Components/DispatchSection'
import { AuthController } from '../../controllers/AuthController'
import { DispatchController } from '../../controllers/DispatchController'
import { RoofStackParamList } from '../../navigators/RoofStack'
import { Customer } from '../../models/Customer'
import { Dispatch, DispatchQuery } from '../../models/Dispatch'
import OperatorSection from './Components/OperatorSection'
import CustomerSection from './Components/CustomerSection'

const HomeContainer = styled.View`
    width: 100%; 
    flex: 1;
`

export type Props = StackScreenProps<RoofStackParamList, "Home">

const Home: FunctionComponent<Props> = ({ navigation }) => {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [dispatches, setDispatches] = useState<Dispatch[]>([])
    const [query] = useState<DispatchQuery>(new DispatchQuery())
    const [, setEnablePaginate] = useState<boolean>(false)


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

    return (
        <HomeContainer>
            <Tabs>
                <TabScreen label="Dispatches">
                    <DispatchSection
                        customers={customers}
                        navigateToTickets={(dispId: string): void => navigation.navigate("Tickets", { dispId: parseFloat(dispId) })}
                    />

                </TabScreen>
                <TabScreen label="Customers">
                    <CustomerSection navigateToTicket={function (customerId: number): void {
                        console.log(customerId);
                    }} />
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
