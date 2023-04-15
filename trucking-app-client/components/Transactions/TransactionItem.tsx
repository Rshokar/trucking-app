import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import TransactionAvi from './TransactionAvi'


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

import { TransactionProps } from './types'
import { View } from 'react-native'
import RegularText from '../Texts/RegularText'
import { colors } from '../colors'
import SmallText from '../Texts/SmallText'

const TransactionItem: FunctionComponent<TransactionProps> = (props) => {
    return (
        <TransactionRow>
            <LeftView>
                <TransactionAvi
                    background={props.art.background}
                    icon={props.art.icon}
                />
                <View style={{ marginLeft: 10 }}>
                    <RegularText textStyle={{
                        color: colors.secondary,
                        textAlign: "left"
                    }}>
                        {props.title}
                    </RegularText>
                    <SmallText textStyle={{
                        textAlign: 'left',
                        color: colors.graydark,
                    }}>
                        {props.subtitle}

                    </SmallText>
                </View>
            </LeftView>
            <RightView>
                <RegularText textStyle={{
                    color: colors.secondary,
                    textAlign: "right"
                }}>
                    {props.amount}
                </RegularText>
                <SmallText textStyle={{
                    textAlign: 'right',
                    color: colors.graydark,
                }}>
                    {props.date}
                </SmallText>
            </RightView>

        </TransactionRow>
    )
}

export default TransactionItem