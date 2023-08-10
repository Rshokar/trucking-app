import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, RefreshControl, View, Text } from 'react-native';

import SmallText from '../Texts/SmallText'
import { colors } from '../colors'
import { TicketSectionProps } from './types'
import RegularText from '../Texts/RegularText'
import { Button, useTheme } from 'react-native-paper';

const TicketSectionBackground = styled.View`
    padding-horizontal: 25px;
    padding-bottom: 10px;
    z-index: -1; 
    flex:1; 
    max-width: 100%;
`

const TicketRow = styled.View`
    flex-direction: row;
    justify-content: space-between; 
    align-items: center;
    width: 100%;
`

const TicketList = styled.FlatList`
`

const LoadingIndicator = styled(ActivityIndicator)`
`

const LoadingText = styled(SmallText)`
    margin-vertical: 20px;
`

const TicketSection: FunctionComponent<TicketSectionProps> = (props) => {
    const [paginating, setPaginating] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const theme = useTheme();

    useEffect(() => {
        setPaginating(false);
    }, [props.data])

    const handleRefresh = async () => props.onRefresh && await props.onRefresh();

    return (
        <TicketSectionBackground style={props.style}>
            <TicketRow style={{ marginBottom: 10 }}>
                <RegularText textStyle={{ fontSize: 19, color: colors.secondary }}>
                    {props.title ?? "Dispatches"}
                </RegularText>
                <SmallText textStyle={{ color: colors.secondary }}>
                    Recent
                    <Ionicons name="caret-down" size={13} color={colors.graydark} />
                </SmallText>
            </TicketRow>
            {props.loading && <LoadingIndicator size="large" color={colors.tertiary} />}

            {(props.data.length > 0 && !props.loading) && <>
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
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={theme.colors.primary}
                        />
                    }
                />
                {paginating && <LoadingIndicator size="large" color={colors.primary} />}
            </>
            }

            {(!props.loading && props.data.length === 0) && <View><Text>No Tickets Found</Text></View>}

        </TicketSectionBackground>
    );
}

export default TicketSection;
