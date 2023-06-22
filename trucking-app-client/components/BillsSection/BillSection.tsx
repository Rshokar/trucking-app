import { useState, useEffect, FC } from 'react'
import { RFO, RFOQuery } from '../../models/RFO'
import { View } from 'react-native'
import Ticket from '../Ticket/Ticket'
import moment from 'moment'
import { RFOController } from '../../controllers/RfoController'
import TicketSection from '../Tickets/TicketSection'
import RfoItem from '../Tickets/RfoItem'
import { colors } from '../colors'
import { Bill, BillQuery } from '../../models/Bill'
import { BillController } from '../../controllers/BillController'
interface BillSectionProps extends RFO {
    rfo_id: number,
}



const BillSection: FC<BillSectionProps> = (props) => {

    const [bills, setBills] = useState<Bill[]>([]);
    const [rfoQ] = useState<BillQuery>(() => {
        const query = new BillQuery();
        query.limit = 99999;
        query.rfo_id = props.rfo_id + ""
        return query;
    });

    // When the RFO id is changed, then update bill tickets
    useEffect(() => {
        const run = async () => {
            const bC = new BillController();
            const res = await bC.getAll(rfoQ)
        }
        run();
    }, [props.rfo_id])

    return (
        <View>
            {
                <TicketSection
                    title={"Request For Operators"}
                    data={bills}
                    render={({ item }) => <RfoItem {...item} />}
                    more={false}
                />
            }
        </View>
    );
}

export default BillSection
