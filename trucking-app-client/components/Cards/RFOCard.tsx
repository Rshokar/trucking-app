import * as React from 'react';
import { Avatar, Button, Card, IconButton, Text } from 'react-native-paper';
import { View } from 'react-native';
import moment from 'moment';
import { RFO } from '../../models/RFO';
import styled from 'styled-components/native';

const LeftContent = (props: any) => <Avatar.Icon {...props} icon="ticket" />


export interface RFOCardProps extends RFO {
    onClick: () => any;
    onLongPress: () => any;
}

const Line = styled.View`
    flex-direction: row; 
    justify-content: space-between; 
`

const RFOCard: React.FC<RFOCardProps> = (props) => (
    <Card style={{ width: '90%' }} onLongPress={props.onLongPress} >
        <Card.Title title={<Text style={{ fontWeight: 'bold' }} variant='titleLarge'>
            {props.operator?.operator_name}
        </Text>} subtitle={`${props.truck} ${props.trailer}`} left={LeftContent} right={() => <IconButton iconColor={'red'} onPress={props.onClick} icon={"cancel"} />} />
        <Card.Content>
            <Line>
                <Text variant='bodySmall'>Start Location: </Text>
                <Text variant='bodySmall'>{props.start_location}</Text>
            </Line>
            <Line>
                <Text variant='bodySmall'>Load Location: </Text>
                <Text variant='bodySmall'>{props.load_location}</Text>
            </Line>
            <Line>
                <Text variant='bodySmall'>Dump Location: </Text>
                <Text variant='bodySmall'>{props.dump_location}</Text>
            </Line>

            <Line>
                <Text variant='bodySmall'>Start Time: </Text>
                <Text variant='bodySmall'>{moment(props.start_time).format("YYYY-MM-DD h:mm a")}</Text>
            </Line>

        </Card.Content>
    </Card>
);


export default RFOCard;