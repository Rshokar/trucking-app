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
import { ScrollView } from 'react-native'
import { RFO } from '../../models/RFO'
import { Bill } from '../../models/Bill'
import DispatchCard from './Components/DIspatchCard'
import RFOCard from './Components/RFOCard'
import BillSection from '../../components/TicketSections/BillSection'


const BalanceContainer = styled(Container)`
    background-color: ${colors.graylight}; 
    width: 100%;
    gap: 20px; 
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
    const [bill, setBill] = useState<Bill>();
    const [operators, setOperators] = useState<Operator[]>([]);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [showSnackBar, setShowSnackBar] = useState<boolean>(false);

    // Gets dispatch and updates companies and customers saved in local storage
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
            dispRes.customer = custRes.find((c: Customer) => c.customer_id === dispRes.customer_id);

            // Set Dispatch
            setDispatch(dispRes as Dispatch);
        };
        run();
    }, [tickets.dispId])

    // Get Operators
    useEffect(() => {
        const run = async () => {
            try {
                // Get company from local storage
                const comp = await AuthController.getCompany();
                const oC = new OperatorController();
                const oQ = new OperatorQuery();
                oQ.company_id = comp.company_id;
                oQ.limit = 100;
                const opers: Operator[] = await oC.getAll(oQ);
                setOperators(opers);
            } catch (err: any) {
                setSnackbarMessage(err.message);
                setShowSnackBar(true)
            }
        }
        run();
    }, [])

    console.log("DISPATCH", dispatch, "\n\n\n", rfo);

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
            <Snackbar
                visible={showSnackBar}
                onDismiss={function (): void {
                    setShowSnackBar(false);
                }}>
                {snackbarMessage}
            </Snackbar>
        </BalanceContainer>
    )
}

export default Tickets
