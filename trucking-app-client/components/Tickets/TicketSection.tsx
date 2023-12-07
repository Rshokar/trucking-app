import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, RefreshControl, View } from 'react-native';
import DumpTruck from '../../assets/svgs/DumpTruck'

import SmallText from '../Texts/SmallText'
import { colors } from '../colors'
import { TicketSectionProps } from './types'
import RegularText from '../Texts/RegularText'
import { Button, useTheme, Text } from 'react-native-paper';

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
    margin-bottom: 15;
    margin-top: 15;
`

const TicketList = styled.FlatList`
`

const LoadingIndicator = styled(ActivityIndicator)`
`

const NoTicketsContainer = styled.View`
    height: 90%; 
    justify-content: center; 
    align-items: center; 
    gap: 20px; 
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
            <TicketRow>
                <RegularText textStyle={{ fontSize: 19, color: colors.secondary }}>
                    {props.title ?? "Dispatches"}
                </RegularText>
                <SmallText textStyle={{ color: colors.secondary }}>
                    <Ionicons name="refresh-outline" size={20} color={colors.graydark} onPress={handleRefresh} />
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

            {(!props.loading && props.data.length === 0) && <NoTicketsContainer>

                {props.noTicketFoundSVG ? props.noTicketFoundSVG : <DumpTruck width={125} height={125} stroke={'black'} fill={'black'} />}
                <Text variant='titleLarge' style={{ textAlign: 'center' }}>{props.noTicketFoundMessage}</Text>
                {
                    props.onNoTicketsFound &&
                    <Button style={{ backgroundColor: theme.colors.secondary, width: 150 }} onPress={props.onNoTicketsFound}>
                        <Text style={{ color: 'white' }}>
                            Add
                        </Text>
                    </Button>
                }
            </NoTicketsContainer>}

        </TicketSectionBackground>
    );
}

export default TicketSection;
