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

    function selectRandomColor(): string {
        const randomNumber = Math.random();

        if (randomNumber < 0.33) {
            return colors.primary;
        } else if (randomNumber < 0.66) {
            return colors.secondary;
        } else {
            return colors.tertiary;
        }
    }

    const sheetRef = useRef<BottomSheet>(null)

    const renderContent = () => {
        return <CustomerSectionBackground>
            <CustomerRow style={{ marginBottom: 25 }}>
                <RegularText textStyle={{ fontSize: 19, color: colors.secondary }}>
                    Send money to
                </RegularText>
                <TextButton onPress={() => alert("Hello")}>
                    <SmallText textStyle={{
                        fontWeight: "bold", color: colors.tertiary
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
                        color={selectRandomColor()}
                    />
                }
                }
            />
        </CustomerSectionBackground>
    }

    return (
        // <Text>Hello</Text>
        <BottomSheet
            ref={sheetRef}
            snapPoints={[240, 85]}
            borderRadius={25}
            initialSnap={1}
            enabledContentTapInteraction={false}
            renderContent={renderContent}
        />
    )
}

export default CustomerSection