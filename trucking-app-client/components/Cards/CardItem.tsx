import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'


// Components
import { ScreenWidth } from '../shared'
import { colors } from '../colors'


const CardBackground = styled.ImageBackground`
    height: 100%; 
    width: ${Math.floor(ScreenWidth * 0.67)}px;
    reasize-mode: cover;
    background-color: ${colors.secondary};
    border-radius: 25px; 
    margin-right: 25px; 
    overflow: hidden;
`

const CardTouchable = styled.TouchableHighlight`
    height: 100%;
    border-radius: 25px
`

const TouchableView = styled.View`
    justify-content: space-between;
    align-items: center; 
    padding: 30px;
    flex: 1;
`

const CardRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%
`



const Logo = styled.Image`
    width: 100%;
    height: 80%; 
    resize-mode: cover;
    flex: 1;
`

import { CardProps } from './types'
import bg from '../../assets/card_background.jpg'
import RegularText from '../Texts/RegularText'
import { View } from 'react-native'
import SmallText from '../Texts/SmallText'

const CardItem: FunctionComponent<CardProps> = (props) => {
    const handlePress = () => { }


    return (
        <CardBackground source={bg}>
            <CardTouchable underlayColor={colors.secondary} onPress={handlePress}>
                <TouchableView>
                    <CardRow>
                        <RegularText textStyle={{ color: "white" }}>
                            ****** {props.accountNo.slice(6, 10)}
                        </RegularText>
                    </CardRow>
                    <CardRow>
                        <View style={{ flex: 3 }}>
                            <SmallText textStyle={{ marginBottom: 5 }}>
                                Total Balance
                            </SmallText>
                            <RegularText textStyle={{ fontSize: 19 }}>
                                {props.balance}
                            </RegularText>
                        </View>
                        <Logo source={props.logo} />
                    </CardRow>
                </TouchableView>
            </CardTouchable>
        </CardBackground>
    )
}

export default CardItem