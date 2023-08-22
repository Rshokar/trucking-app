import React, { FunctionComponent, useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import styled from 'styled-components/native'

import { colors } from '../../components/colors'
import { Container } from '../../components/shared'
import { RoofStackParamList } from '../../navigators/RoofStack'
import { StackScreenProps } from '@react-navigation/stack'
import { Dispatch, DispatchQuery } from '../../models/Dispatch'
import { DispatchController } from '../../controllers/DispatchController'
import { AuthController } from '../../controllers/AuthController'
import { Company } from '../../models/Company'
import { Customer } from '../../models/Customer'
import RfoSection from '../../components/TicketSections/RfoSection'
import { OperatorController } from '../../controllers/OperatorController'
import { Operator, OperatorQuery } from '../../models/Operator'
import { Snackbar } from 'react-native-paper'
import { RFO, RFOQuery } from '../../models/RFO'
import { Bill } from '../../models/Bill'
import DispatchCard from '../../components/Cards/DIspatchCard'
import RFOCard from '../../components/Cards/RFOCard'
import BillSection from '../../components/TicketSections/BillSection'
import { RFOController } from '../../controllers/RfoController'
import Cache from '../../utils/Cache'
import uuid from 'react-native-uuid'

const BalanceContainer = styled(Container)`
    background-color: ${colors.graylight}; 
    width: 100%;
    gap: 10px; 
    flex: 1;
`

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
    const [rfo, setRFO] = useState<RFO>();
    const [operators, setOperators] = useState<Operator[]>(Cache.getInstance(Operator).getData());
    const [operatorCacheId] = useState<string>(uuid.v4() as string)

    // Gets dispatch and updates companies and customers saved in local storage
    useEffect(() => {
        const run = async () => {
            const dC = new DispatchController();
            const dQ = new DispatchQuery();
            dQ.dispatch_id = tickets.dispId


            // Get promises
            const dCPromise = dC.get(dQ);
            const compPromise = AuthController.getCompany();

            // Await all of them
            let [dispRes, compRes]: any[] = await Promise.all([dCPromise, compPromise]);

            compRes = compRes as Company;
            dispRes = dispRes as Dispatch;

            // Set customers nad company
            dispRes.company = compRes

            // Set Dispatch
            setDispatch(dispRes as Dispatch);
        };
        run();
    }, [tickets.dispId])


    // If rfo_id exist then we want to load and set the rfo
    useEffect(() => {
        const run = async () => {
            if (!tickets.rfoId) return;
            const rC = new RFOController();
            try {
                const rfoQ = new RFOQuery();
                rfoQ.rfo_id = tickets.rfoId;
                const res: RFO = await rC.get(rfoQ);
                res.operator = operators.find(o => o.operator_id === rfo?.operator_id);
                setRFO(res);
            } catch (err: any) {
                console.log(err)
            }
        }
        run()
    }, [tickets.rfoId, operators])

    // Set Operator subscriber
    useEffect(() => {
        const cache = Cache.getInstance(Operator);
        cache.subscribe({
            id: operatorCacheId,
            onChange: setOperators
        })
    }, [])

    return (
        <BalanceContainer>
            <DispatchCard {...dispatch} />
            {
                rfo ?
                    <RFOCard {...rfo} onClick={() => setRFO(undefined)} onLongPress={() => console.log("ON LONG PRESS")} />
                    :
                    <RfoSection
                        dispId={tickets.dispId}
                        operators={operators}
                        navigateToTicket={(rfo: RFO): any => {
                            tickets.rfoId = rfo.rfo_id;
                            setTickets({ ...tickets });
                            setRFO(rfo);
                        }}
                    />
            }
            {
                rfo &&
                <BillSection rfoId={rfo.rfo_id ?? 0} navigateToTicket={function (bill: Bill): void {
                    console.log('SHOW BILL IMAGE')
                }} />
            }
        </BalanceContainer>
    )
}

export default Tickets
