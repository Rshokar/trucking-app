import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator } from 'react-native';

import SmallText from '../Texts/SmallText'
import { colors } from '../colors'
import { TicketSectionProps } from './types'
import RegularText from '../Texts/RegularText'
import { View } from 'react-native';
import { Button } from 'react-native-paper';

const TicketSectionBackground = styled.View`
    padding-horizontal: 25px;
    padding-bottom: 10px;
    z-index: -1; 
    flex:1; 
`

const TicketRow = styled.View`
    flex-direction: row;
    justify-content: space-between; 
    align-items: center;
`

const TicketList = styled.FlatList`
`

const LoadingIndicator = styled(ActivityIndicator)`
    margin-vertical: 20px;
`

const LoadingText = styled(SmallText)`
    margin-vertical: 20px;
`

const TicketSection: FunctionComponent<TicketSectionProps> = (props) => {
    const [paginating, setPaginating] = useState<boolean>(false);

    useEffect(() => {
        setPaginating(false);
    }, [props.data])

    return (
        <TicketSectionBackground style={props.style}>
            <TicketRow style={{ marginBottom: 25 }}>
                <RegularText textStyle={{ fontSize: 19, color: colors.secondary }}>
                    {props.title ?? "Dispatches"}
                </RegularText>
                <SmallText textStyle={{ color: colors.secondary }}>
                    Recent
                    <Ionicons name="caret-down" size={13} color={colors.graydark} />
                </SmallText>
            </TicketRow>
            {props.data.length === 0 ? (
                <ActivityIndicator size="large" color={colors.tertiary} />
            ) : (
                <>
                    <TicketList
                        data={props.data}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item: unknown, index: number) => index + ""}
                        renderItem={props.render}
                        ListFooterComponent={props.more ? <Button mode="contained" onPress={() => {
                            if (props.paginate) {
                                props.paginate();
                                setPaginating(true);
                            }
                        }}>
                            Load More
                        </Button> : undefined}
                    />
                    {paginating && <LoadingIndicator size="large" color={colors.primary} />}
                </>
            )}
        </TicketSectionBackground>
    );
}

export default TicketSection;
