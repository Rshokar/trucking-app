import React, { FunctionComponent, useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import styled from 'styled-components/native'

import { colors } from '../components/colors'
import { Container } from '../components/shared'
import DispatchSection from '../components/DispatchSection/DispatchSection'

const BalanceContainer = styled(Container)`
    background-color: ${colors.graylight}; 
    width: 100%;
    flex: 1;
`
import { RoofStackParamList } from '../navigators/RoofStack'
import { StackScreenProps } from '@react-navigation/stack'
import ButtonSection from '../components/Balance/ButtonSection'
import { Dispatch, DispatchQuery } from '../models/Dispatch'
import { DispatchController } from '../controllers/DispatchController'
import { AuthController } from '../controllers/AuthController'
import { Company } from '../models/Company'
import { Customer } from '../models/Customer'
import RfoSection from '../components/RfoSection/RfoSection'

type Props = StackScreenProps<RoofStackParamList, 'Tickets'>;

export interface TicketIds {
    dispId: number,
    rfoId?: number,
    billId?: number,
}

const Tickets: FunctionComponent<Props> = ({ route }) => {

    const [tickets, setTickets] = useState<TicketIds>({
        dispId: route.params.dispId,
        rfoId: route.params.rfoId,
        billId: route.params.billId,
    });

    const [dispatch, setDispatch] = useState<Dispatch>();
    const [rfoId, setRfoId] = useState<number>();
    const [billId, setBillId] = useState<number>();

    useEffect(() => {
        const run = async () => {
            const dC = new DispatchController();
            const dQ = new DispatchQuery();
            dQ.dispatch_id = tickets.dispId


            // Get promises
            const dCPromise = dC.get(dQ);
            const compPromise = AuthController.getCompany();
            const custPromise = AuthController.getCustomers();

            // Await all of them
            let [dispRes, compRes, custRes]: any[] = await Promise.all([dCPromise, compPromise, custPromise]);

            compRes = compRes as Company;
            custRes = custRes as Customer[];
            dispRes = dispRes as Dispatch;

            // Set customers nad company
            dispRes.company = compRes
            dispRes.customer = custRes.filter((c: Customer) => c.customer_id == dispRes.customer_id)[0];

            // Set Dispatch
            setDispatch(dispRes as Dispatch);
        };
        run();
    }, [tickets.dispId])

    useEffect(() => {

    }, [tickets.dispId])

    return (
        <BalanceContainer>
            <DispatchSection {...dispatch} />
            <RfoSection
                dispatch_id={tickets.dispId}
                setFocusedRfo={(id: number) => setRfoId(id)}
                focusedRFO={rfoId}

            />


            {/* <BalanceCardSection {...route?.params} /> */}
        </BalanceContainer>
    )
}

export default Tickets
