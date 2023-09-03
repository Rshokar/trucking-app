import * as React from 'react';
import { Avatar, Button, Card, Text, useTheme } from 'react-native-paper';
import { Operator } from '../../models/Operator';
import styled from 'styled-components/native';

const LeftContent = (props: any) => <Avatar.Icon {...props} icon="mail" />


const Line = styled.View`
    flex-direction: row; 
    justify-content: space-between; 
`

export interface OperatorCardProps extends Operator {
    sendVerifcationEmail: (item: Operator) => Promise<void>
}

const OperatorCard: React.FC<OperatorCardProps> = (props) => {
    const [sending, setSending] = React.useState<boolean>(false);
    const theme = useTheme();

    const resendVerificationEmail = async () => {
        setSending(true);
        props.sendVerifcationEmail(props);
        setSending(false);
    }

    return (
        <Card style={{ width: '90%' }} >
            <Card.Title title={<Text style={{ fontWeight: 'bold' }} variant='titleLarge'>
                {props.operator_name}
            </Text>}
                subtitle={props.operator_email}
                left={LeftContent}
            />
            <Card.Content style={{ gap: 20 }}>
                <Line>
                    <Text variant='bodyLarge'>The operator need to validate their email. Click the button bellow and an email will be sent containing a validation url</Text>
                </Line>
                <Button
                    mode="contained"
                    onPress={() => resendVerificationEmail()}
                    disabled={sending}
                    style={{ backgroundColor: sending ? theme.colors.onSurfaceDisabled : theme.colors.primary, width: '100%' }}>
                    {sending ? "Sendig...." : "Send validation email"}
                </Button>
            </Card.Content>
        </Card>
    )
};


export default OperatorCard;