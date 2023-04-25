import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { View } from 'react-native'

import TransactionAvi from './TicketAvi'
import RegularText from '../Texts/RegularText'
import { colors } from '../colors'
import SmallText from '../Texts/SmallText'

const TransactionRow = styled.View`
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
export interface DispatchItemProps extends Dispatch {
    numOperators: number
}

const DispatchItem: FunctionComponent<DispatchItemProps> = (props) => {
    <TransactionAvi
        background={colors.tertiary}
        icon={props.customer?.customerName ? props.customer?.customerName[0] : 'T'}
    />
    return (
        <TransactionRow>
            <LeftView>
                <View style={{ marginLeft: 10 }}>
                    <RegularText textStyle={{
                        color: colors.secondary,
                        textAlign: "left"
                    }}>
                        {props.customer_id}
                    </RegularText>
                    <SmallText textStyle={{
                        textAlign: 'left',
                        color: colors.graydark,
                    }}>
                        {props.date}

                    </SmallText>
                </View>
            </LeftView>
            <RightView>
                <RegularText textStyle={{
                    color: colors.secondary,
                    textAlign: "right"
                }}>
                    {props.numOperators}
                </RegularText>
            </RightView>

        </TransactionRow>
    )
}

export default DispatchItem