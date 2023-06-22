import { useState, useEffect, FC, useRef } from 'react'
import { RFO, RFOQuery } from '../../models/RFO'
import { View, Animated } from 'react-native'
import Ticket from '../Ticket/Ticket'
import moment from 'moment'
import { RFOController } from '../../controllers/RfoController'
import TicketSection from '../Tickets/TicketSection'
import RfoItem from '../Tickets/RfoItem'
import { color } from 'react-native-reanimated'
import { colors } from '../colors'
interface RfoSectionProps extends RFO {
    focusedRFO?: number,
    setFocusedRfo: (id: number) => any
}



const RfoSection: FC<RfoSectionProps> = (props) => {

    const [rfos, setRfos] = useState<RFO[]>([]);
    const [rfo, setRfo] = useState<RFO>();
    const [rfoQ] = useState<RFOQuery>(new RFOQuery());
    const heightFocus = useRef(new Animated.Value(0)).current;
    const heightList = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const run = async () => {
            rfoQ.dispatch_id = props.dispatch_id;
            rfoQ.limit = 9999;

            const rC: RFOController = new RFOController();
            const rfoRes = await rC.getAll<RFO>(rfoQ);
            setRfos(rfoRes);
        }
        run();
    }, [props.dispatch_id])

    // Filter for rfo
    useEffect(() => {
        const focusRFO: RFO | undefined = rfos.find((r) => r.rfo_id === props.focusedRFO);
        console.log("FOUND RFO", focusRFO);
        if (focusRFO) {
            setRfo(focusRFO);
            animateFocus(true);
            animateList(true);
        } else {
            setRfo(undefined);
            animateFocus(false);
            animateList(true);
        }
    }, [props.focusedRFO]);

    const animateFocus = (expand: boolean) => {
        Animated.timing(heightFocus, {
            toValue: expand ? 1 : 0,
            duration: 300,
            useNativeDriver: true
        }).start();
    };



    const animateList = (expand: boolean) => {
        Animated.timing(heightList, {
            toValue: expand ? 1 : 0,
            duration: 300,
            useNativeDriver: true
        }).start();
    };

    const focusH = heightFocus.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 400]
    });

    const listH = heightList.interpolate({
        inputRange: [0, 1],
        outputRange: [400, 0]
    })

    console.log("FOCUSED RFO", rfo, focusH, listH)

    return (
        <View>
            {
                !rfo &&
                <TicketSection
                    title={"Request For Operators"}
                    data={rfos}
                    render={({ item }) => <RfoItem {...item} onClick={() => props.setFocusedRfo(item.rfo_id)} />}
                    more={false}
                />
            }

            {rfo && <Ticket
                style={{
                    height: 110,
                    backgroundColor: colors.primary
                }}
                id={rfo.rfo_id ?? 0}
                title={(rfo.operator && rfo.operator.operator_name) ?? "Operator not found"}
                subTitle={rfo.start_location ?? "Start location not found"}
                data={rfo.start_time ? moment(rfo.start_time).format('YYYY-MM-DD h:mm a') : 'Date not found'}
            />
            }
        </View>
    );
}

export default RfoSection
