import * as React from 'react';
import { Avatar, Button, Card, IconButton, Text } from 'react-native-paper';
import { View } from 'react-native';
import moment from 'moment';
import { RFO } from '../../../models/RFO';
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
    <Card style={{ width: '90%' }} onPress={props.onClick} onLongPress={props.onLongPress} >
        <Card.Title title={<Text style={{ fontWeight: 'bold' }} variant='headlineSmall'>
            {props.operator?.operator_name} {moment(props.start_time).format("h:mm a")}
        </Text>} subtitle={`${props.truck} ${props.trailer}`} left={LeftContent} right={() => <IconButton onPress={() => console.log('EDIT')} icon={"pencil"} />} />
        <Card.Content>
            <Line>
                <Text variant='bodyMedium'>Start Location: </Text>
                <Text variant='bodyMedium'>{props.start_location}</Text>
            </Line>
            <Line>
                <Text variant='bodyMedium'>Load Location: </Text>
                <Text variant='bodyMedium'>{props.load_location}</Text>
            </Line>
            <Line>
                <Text variant='bodyMedium'>Dump Location: </Text>
                <Text variant='bodyMedium'>{props.dump_location}</Text>
            </Line>
        </Card.Content>
    </Card>
);

export default RFOCard;