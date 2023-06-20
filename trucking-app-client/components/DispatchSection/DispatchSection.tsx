import { FC } from 'react';
import { Dispatch } from '../../models/Dispatch';
import styled from 'styled-components/native';
import { Container } from '../shared';
import { colors } from '../colors';
import Ticket from '../Ticket/Ticket';
import moment from 'moment';


const DispatchSection: FC<Dispatch> = (props) => {

    return (
        <Ticket
            id={0}
            title={props.customer?.customer_name ?? "No Title Found"}
            subTitle={props.notes ?? "No Notes Found"}
            data={props.date ? moment(props.date).format('YYYY-MM-DD') : "No Date Found"}
        />
    )
}

export default DispatchSection