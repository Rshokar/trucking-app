import { useState, useEffect, FC } from 'react'
import { RFO } from '../../models/RFO'
import { View, Text } from 'react-native'
import Ticket from '../Ticket/Ticket'
import moment from 'moment'

interface RfoSectionProps extends RFO {
    focusedRFO?: number,
    setFocusedRfo: (id: number) => any
}



const RfoSection: FC<RfoSectionProps> = (props) => {

    const [rfos, setRfos] = useState<RFO[]>([]);
    const [rfo, setRfo] = useState<RFO>();
    useEffect(() => {
        const run = () => {

        }
        run();
    }, [props.dispatch_id])

    // Filter for rfo
    useEffect(() => {
        const focusRFO: RFO | undefined = rfos.find(r => r.rfo_id === props.focusedRFO)
        if (!focusRFO) {
            console.log("RFO NOT FOUND")
            return;
        }
        setRfo(focusRFO)
    }, [props.focusedRFO])

    return <View>
        {
            rfo && <Ticket
                id={rfo.rfo_id ?? 0}
                title={rfo.operator?.operator_name ?? "Name not found"}
                subTitle={rfo.start_location ?? ""}
                data={rfo.start_time ? moment(rfo.start_time).format("YYYY-MM-DD h:mm a") : "Date not found"} />
        }
    </View>
}

export default RfoSection