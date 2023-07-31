import React, { FunctionComponent, useEffect, useState, useCallback } from 'react'
import { View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useTheme, TextInput, FAB } from 'react-native-paper'
import { DatePickerModal } from 'react-native-paper-dates'
import styled from 'styled-components/native'

import { colors } from '../../components/colors'
import { Container } from '../../components/shared'
import { Tabs, TabScreen, useTabIndex, useTabNavigation } from 'react-native-paper-tabs'

import DispatchSection from './Components/DispatchSection'
import { AuthController } from '../../controllers/AuthController'
import { DispatchController } from '../../controllers/DispatchController'
import { RoofStackParamList } from '../../navigators/RoofStack'
import { Customer } from '../../models/Customer'
import { Dispatch, DispatchQuery } from '../../models/Dispatch'
import moment from 'moment'
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
    const [query, setQuery] = useState<DispatchQuery>(new DispatchQuery())
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
                <TabScreen label="Dispatch" icon="book">
                    <DispatchSection
                        customers={customers}
                        navigateToTicket={dispId => navigation.navigate("Tickets", { dispId: parseFloat(dispId + "") })}
                    />
                </TabScreen>
                <TabScreen label="Customer" icon="account">
                    <CustomerSection navigateToTicket={function (customerId: number): void {
                        console.log(customerId);
                    }} />
                </TabScreen>
                <TabScreen label="Operator" icon="truck">
                    <OperatorSection
                        navigateToTicket={ticketId => console.log("HELLO WORLD", ticketId)} />
                </TabScreen>
            </Tabs>
        </HomeContainer>
    )
}

export default Home
