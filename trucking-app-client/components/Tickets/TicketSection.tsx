import React, { FunctionComponent } from 'react';
import styled from 'styled-components/native';
import { Ionicons } from "@expo/vector-icons";

import SmallText from '../Texts/SmallText'
import { colors } from '../colors'


const TicketSectionBackground = styled.View`
    width: 100%; 
    padding-horizontal: 25px;
    padding-top: 5px; 
`

const TicketRow = styled.View`
    flex-direction: row;
    justify-content: space-between; 
    align-items: center;
`

const TicketList = styled.FlatList`
`

import { TicketSectionProps } from './types'
import RegularText from '../Texts/RegularText'


const TicketSection: FunctionComponent<TicketSectionProps> = (props) => {
    return (
        <TicketSectionBackground>
            <TicketRow style={{ marginBottom: 25 }}>
                <RegularText textStyle={{ fontSize: 19, color: colors.secondary }}>
                    Dispatches
                </RegularText>
                <SmallText textStyle={{ color: colors.secondary }}>
                    Recent
                    <Ionicons name="caret-down" size={13} color={colors.graydark} />
                </SmallText>
            </TicketRow>
            <TicketList
                data={props.data}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 25,
                }}
                keyExtractor={({ id }: any) => id + ""}
                renderItem={props.render}

            />
        </TicketSectionBackground>
    )
}

export default TicketSection