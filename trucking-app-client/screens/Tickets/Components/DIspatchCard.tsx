import * as React from 'react';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { Dispatch } from '../../../models/Dispatch';
import moment from 'moment';

const LeftContent = (props: any) => <Avatar.Icon {...props} icon="folder" />



const DispatchCard: React.FC<Dispatch> = (props) => (
    <Card style={{ width: '90%' }}>
        <Card.Title title={<Text style={{ fontWeight: 'bold' }} variant='titleMedium'>
            {props.customer?.customer_name}
        </Text>} subtitle={moment(props.date).format("YYYY-MM-DD")} left={LeftContent} />
        <Card.Content>
            <Text variant="bodySmall">{props.notes}</Text>
        </Card.Content>
    </Card>
);

export default DispatchCard;