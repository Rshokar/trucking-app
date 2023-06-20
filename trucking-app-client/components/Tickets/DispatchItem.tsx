import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { View } from 'react-native'

import TransactionAvi from './TicketAvi'
import RegularText from '../Texts/RegularText'
import { colors } from '../colors'
import SmallText from '../Texts/SmallText'
import { AntDesign } from '@expo/vector-icons';

const TicketRow = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 25px;
`

const LeftView = styled.View`
    flex-direction: row;
    justify-content: flex-start;
    height: 100%;
    align-items: center;
    flex:2;
    `

const RightView = styled.View`
    flex: 1; 
    `



import { Dispatch } from '../../models/Dispatch'
import moment from 'moment'


interface DispatchItemProps extends Dispatch {
    onClick: () => any,
}


const DispatchItem: FunctionComponent<DispatchItemProps> = (props) => {

    console.log(props.date, props.dispatch_id);

    return (
        <TicketRow onPress={props.onClick}>
            <LeftView>
                <TransactionAvi
                    background={colors.tertiary}
                    icon={props.rfo_count}
                />
                <View style={{ marginLeft: 10 }}>
                    <RegularText textStyle={{
                        color: colors.secondary,
                        textAlign: "left"
                    }}>
                        {props.customer?.customer_name}
                    </RegularText>
                    <SmallText textStyle={{
                        textAlign: 'left',
                        color: colors.graydark,
                    }}>
                        {moment(props.date).format('YYYY-MM-DD h:mm a')}

                    </SmallText>
                </View>
            </LeftView>
            <RightView>
                <RegularText textStyle={{
                    color: colors.secondary,
                    textAlign: "right"
                }}>
                    <AntDesign name="caretright" size={15} color="black" />
                </RegularText>
            </RightView>

        </TicketRow>
    )
}

export default DispatchItem