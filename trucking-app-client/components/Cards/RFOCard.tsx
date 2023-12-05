import * as React from 'react';
import { View } from 'react-native'
import { Avatar, Button, Card, IconButton, Text, useTheme } from 'react-native-paper';
import moment from 'moment';
import { RFO } from '../../models/RFO';
import { Line } from './styles';


const LeftContent = (props: any) => <Avatar.Icon {...props} icon="ticket" />


export interface RFOCardProps extends RFO {
    onClick: () => any;
    onLongPress: () => any;
    sendRFOEmail?: () => Promise<any>
}


const RFOCard: React.FC<RFOCardProps> = (props) => {
    const [sending, setSending] = React.useState<boolean>(false);
    const theme = useTheme();

    const resendRFOEmail = async () => {
        if (!props.sendRFOEmail) return;
        setSending(true);
        await props.sendRFOEmail();
        setSending(false)
    }

    return <Card style={{ width: '90%' }} onLongPress={props.onLongPress} >
        <Card.Title title={<Text style={{ fontWeight: 'bold' }} variant='titleLarge'>
            {props.operator?.operator_name}
        </Text>} subtitle={`${props.truck} ${props.trailer}`} left={LeftContent} right={() => <IconButton iconColor={'red'} onPress={props.onClick} icon={"cancel"} />}
        />
        <Card.Content style={{ gap: 30 }}>
            <View>
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

                <Line>
                    <Text variant='bodyMedium'>Start Time: </Text>
                    <Text variant='bodyMedium'>{moment(props.start_time).format("YYYY-MM-DD h:mm a")}</Text>
                </Line>
            </View>
            {
                props.sendRFOEmail &&
                <Button
                    mode="contained"
                    onPress={() => resendRFOEmail()}
                    disabled={sending}
                    style={{ backgroundColor: sending ? theme.colors.onSurfaceDisabled : theme.colors.primary, width: '100%' }}>
                    {sending ? "Sendig...." : "Re-Send RFO notification"}
                </Button>
            }
        </Card.Content>
    </Card>
};


export default RFOCard;