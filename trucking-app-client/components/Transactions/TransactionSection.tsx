import React, { FunctionComponent } from 'react';
import styled from 'styled-components/native';
import { Ionicons } from "@expo/vector-icons";

import SmallText from '../Texts/SmallText'
import { colors } from '../colors'


const TransactionSectionBackground = styled.View`
    width: 100%; 
    padding-horizontal: 25px;
    padding-top: 5px; 
`

const TransactionRow = styled.View`
    flex-direction: row;
    justify-content: space-between; 
    align-items: center;
`

const TransactionList = styled.FlatList`
`

import { TransactionSectionProps } from './types'
import RegularText from '../Texts/RegularText'
import TransactionItem from './TransactionItem';

const TransactionSection: FunctionComponent<TransactionSectionProps> = (props) => {
    return (
        <TransactionSectionBackground>
            <TransactionRow style={{ marginBottom: 25 }}>
                <RegularText textStyle={{ fontSize: 19, color: colors.secondary }}>
                    Transactions
                </RegularText>
                <SmallText textStyle={{ color: colors.secondary }}>
                    Recent
                    <Ionicons name="caret-down" size={13} color={colors.graydark} />
                </SmallText>
            </TransactionRow>
            <TransactionList
                data={props.data}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 25,
                }}
                keyExtractor={({ id }: any) => id.toString()}
                renderItem={({ item }: any) => <TransactionItem {...item} />}

            />
        </TransactionSectionBackground>
    )
}

export default TransactionSection