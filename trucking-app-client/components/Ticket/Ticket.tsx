import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { View } from 'react-native'


// Components
import { ScreenWidth } from '../shared'
import { colors } from '../colors'

const CardBackground = styled.View`
    max-height: 170px;
    width: ${Math.floor(ScreenWidth * .90)}px;
    reasize-mode: cover;
    background-color: ${colors.secondary};
    border-radius: 25px; 
    overflow: hidden;
`

const CardTouchable = styled.TouchableHighlight`
    height: 100%;
    border-radius: 25px
`

const TouchableView = styled.View`
    justify-content: flex-start;
    align-items: center; 
    padding: 15px;
    flex: 1;
    gap: 10px;
`

const CardRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%
`

import { TicketProps } from './types'
import RegularText from '../Texts/RegularText'
import SmallText from '../Texts/SmallText'
import BigText from '../Texts/BigText'

const Ticket: FunctionComponent<TicketProps> = (props) => {

    return (
        <CardBackground style={props.style}>
            <CardTouchable underlayColor={colors.secondary}>
                <TouchableView>
                    <CardRow style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <BigText textStyle={{ color: "white", fontSize: 25 }}>
                            {props.title}
                        </BigText>
                        <RegularText textStyle={{ color: "white" }}>
                            {props.data}
                        </RegularText>
                    </CardRow>
                    <CardRow>
                        <View style={{ flex: 3 }}>
                            <SmallText textStyle={{ color: "white" }}>
                                {props.subTitle}
                            </SmallText>
                        </View>
                    </CardRow>
                </TouchableView>
            </CardTouchable>
        </CardBackground>
    )
}

export default Ticket