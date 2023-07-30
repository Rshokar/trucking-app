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
    const theme = useTheme()
    const index = useTabIndex()
    const [customers, setCustomers] = useState<Customer[]>([])
    const [dispatches, setDispatches] = useState<Dispatch[]>([])
    const [query, setQuery] = useState<DispatchQuery>(new DispatchQuery())
    const [enablePaginate, setEnablePaginate] = useState<boolean>(false)
    const [showDateModal, setShowDateModal] = useState<boolean>(false)

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

    const handleFABPress = () => {
        if (index === 0) {
            // Open dispatch form
        } else if (index === 1) {
            // Open customer form
        } else if (index === 2) {
            // Open operator form
        }
    }

    const paginate = () => {
        if (enablePaginate) {
            query.page = query.page + 1
            setQuery({ ...query })
            setEnablePaginate(false)
        }
    }

    const handleAddCustomer = (id: number) => {
        query.page = 0
        if (!query.customers) {
            query.customers = new Set<number>()
        }
        if (query.customers.has(id))
            query.customers.delete(id)
        else
            query.customers.add(id)
        setQuery({ ...query })
    }

    const logout = async () => {
        await AuthController.logOut()
        navigation.navigate("Welcome")
    }

    const onConfirm = useCallback(({ startDate, endDate }: any) => {
        setShowDateModal(false)
        query.startDate = moment(startDate).format("YYYY-MM-DD")
        query.endDate = moment(endDate).format("YYYY-MM-DD")
        setQuery({ ...query })
    }, [setShowDateModal, setQuery])

    return (
        <HomeContainer>
            <Tabs>
                <TabScreen label="Dispatch" icon="book">
                    <DispatchSection
                        navigateToTickets={dispId => navigation.navigate("Tickets", { dispId: parseFloat(dispId) })}
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
            <FAB
                style={{
                    position: 'absolute',
                    margin: 16,
                    right: 0,
                    bottom: 0,
                }}
                icon="plus"
                onPress={handleFABPress}
            />
        </HomeContainer>
    )
}

export default Home
