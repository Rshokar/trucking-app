import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'


// Components
import SmallText from '../Texts/SmallText'
import RegularText from '../Texts/RegularText'
import { ScreenWidth } from '../shared'
import { colors } from '../colors'


const CardBackground = styled.ImageBackground`
    height: 75%;
    width: 100%; 
    width: ${Math.floor(ScreenWidth * 0.67)}px;
    reasize-mode: cover;
    background-color: ${colors.secondary};
    border-radius: 25px; 
    overflow: hidden;
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

import bg from '../../assets/card_background.jpg'
import { BalanceCardProps } from './types'
import { color } from 'react-native-reanimated'

const BalanceCard: FunctionComponent<BalanceCardProps> = (props) => {

    return (
        <CardBackground source={bg}>
            <TouchableView>
                <CardRow>
                    <RegularText textStyle={{ color: "white" }}>
                        ****** {props?.accountNo?.slice(6, 10)}
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
        </CardBackground>
    )
}

export default BalanceCard