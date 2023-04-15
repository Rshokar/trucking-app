import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'


const CardList = styled.FlatList`
width: 100%;
flex: 1;
passing-left: 25px; 
padding-bottom: 15px;
`

import { CardSelectionProps } from './types'
import { FlatList } from 'react-native'
import CardItem from './CardItem'

const CardSection: FunctionComponent<CardSelectionProps> = (props) => {
    return (
        <CardList
            data={props.data}
            horizontal={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                padding: 25,
                alignContent: "center"
            }}
            keyExtractor={({ id }: any) => id.toString()}
            renderItem={({ item }: any) => <CardItem {...item} />}
        />
    )
}

export default CardSection