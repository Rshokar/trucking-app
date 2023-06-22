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



import { RFO } from '../../models/RFO'
import moment from 'moment'


interface RfoItemProps extends RFO {
    onClick: () => any,
}


const RfoItem: FunctionComponent<RfoItemProps> = (props) => {

    return (
        <TicketRow onPress={props.onClick}>
            <LeftView>
                <View style={{ marginLeft: 10 }}>
                    <RegularText textStyle={{
                        color: colors.secondary,
                        textAlign: "left"
                    }}>
                        {props.operator?.operator_name}
                    </RegularText>
                    <SmallText textStyle={{
                        textAlign: 'left',
                        color: colors.graydark,
                    }}>
                        {props.load_location}

                    </SmallText>
                </View>
            </LeftView>
            <RightView>
                <SmallText textStyle={{
                    color: colors.secondary,
                    textAlign: "right"
                }}>
                    {props.start_time ? moment(props.start_time).format("MMM Do YYYY h:MM a") : "Date not found"}
                </SmallText>
            </RightView>

        </TicketRow>
    )
}

export default RfoItem