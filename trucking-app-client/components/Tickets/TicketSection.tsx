import React, { FunctionComponent } from 'react';
import styled from 'styled-components/native';
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator } from 'react-native';

import SmallText from '../Texts/SmallText'
import { colors } from '../colors'
import { TicketSectionProps } from './types'
import RegularText from '../Texts/RegularText'
import { View } from 'react-native';

const TicketSectionBackground = styled.View`
    width: 100%; 
    padding-horizontal: 25px;
    padding-top: 5px; 
    z-index: -1;
    height: 90%
`

const TicketRow = styled.View`
    flex-direction: row;
    justify-content: space-between; 
    align-items: center;
`

const TicketList = styled.FlatList`
`




const TicketSection: FunctionComponent<TicketSectionProps> = (props) => {
    return (
        <TicketSectionBackground style={props.style}>
            <TicketRow style={{ marginBottom: 25 }}>
                <RegularText textStyle={{ fontSize: 19, color: colors.secondary }}>
                    Dispatches
                </RegularText>
                <SmallText textStyle={{ color: colors.secondary }}>
                    Recent
                    <Ionicons name="caret-down" size={13} color={colors.graydark} />
                </SmallText>
            </TicketRow>
            {
                props.data.length === 0 ?
                    <ActivityIndicator size={'large'} color={colors.tertiary} />
                    :
                    <>
                        <TicketList
                            data={props.data}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingBottom: 25,
                            }}
                            keyExtractor={(item: unknown, index: number) => index + ""}
                            renderItem={props.render}
                            onEndReached={props.paginate}
                        />
                        <View style={{ height: 120 }} />
                    </>
            }
        </TicketSectionBackground>
    )
}

export default TicketSection