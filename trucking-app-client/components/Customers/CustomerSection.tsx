import React, { FunctionComponent, useRef } from 'react'
import styled from 'styled-components/native'
import BottomSheet from 'reanimated-bottom-sheet'


import { colors } from '../colors'
import RegularText from '../Texts/RegularText'
import SmallText from '../Texts/SmallText'
import CustomerItem from './CustomerItem'

const CustomerSectionBackground = styled.View`
    width: 100%;
    padding-top: 15px;
    background-color: ${colors.white}
`

const CustomerRow = styled.View`
    flex-direction: row;
    justify-content: space-between; 
    align-items: center;
    width: 100%
    padding-horizontal: 25px
`

const CustomerList = styled.FlatList`
    width: 100%; 
    flex: auto;
    min-height: 80%;
    padding-horizontal: 25px;
`

const TextButton = styled.TouchableOpacity`

`

import { CustomerSectionProps } from './types'


const CustomerSection: FunctionComponent<CustomerSectionProps> = (props) => {

    const sheetRef = useRef<BottomSheet>(null)

    const renderContent = () => {
        return <CustomerSectionBackground>
            <CustomerRow style={{ marginBottom: 25 }}>
                <RegularText textStyle={{ fontSize: 19, color: colors.secondary }}>
                    Customers
                </RegularText>
                <TextButton onPress={() => alert("Hello")}>
                    <SmallText textStyle={{
                        fontWeight: "bold", color: colors.secondary
                    }}>
                        + Add
                    </SmallText>
                </TextButton>
            </CustomerRow>
            <CustomerList
                data={props.data}
                contentContainerStyle={{
                    alignItems: "flex-start"
                }}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                numColumns={3}
                keyExtractor={({ id }: any) => id + ""}
                renderItem={(item: any) => {
                    return <CustomerItem
                        {...item.item}
                        color={colors.tertiary}
                        onClick={props.onClick}
                    />
                }
                }
            />
        </CustomerSectionBackground>
    }

    return (
        <BottomSheet
            ref={sheetRef}
            snapPoints={[240, 85]}
            borderRadius={25}
            initialSnap={1}
            enabledContentTapInteraction={true}
            renderContent={renderContent}
        />
    )
}

export default CustomerSection