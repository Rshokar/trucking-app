import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { colors } from '../colors'

import RegularText from '../Texts/RegularText'
import SmallText from '../Texts/SmallText'
import Profile from '../Header/Profile'
import { ScreenWidth } from '../shared'

const SendMoneyItemContainer = styled.TouchableHighlight`
    height: 130px; 
    width: ${ScreenWidth * 0.27}px;
    padding: 10px;
    border-radius: 15px; 
    justify-content: space-around;
    margin: 0px 10px 10px 0px;
`
import { SendMoneyProps } from './types'

const SendMoneyItem: FunctionComponent<SendMoneyProps> = ({ background, name, amount }) => {

    console.log("Send Mondey Item", background, name, amount)
    return (
        <SendMoneyItemContainer
            underlayColor={colors.secondary}
            style={{ backgroundColor: background }}
            onPress={() => {
                alert("Send Money!")
            }}
        >
            <>
                <Profile imageContainerStyle={{ marginBottom: 10 }} />
                <SmallText
                    textStyle={{
                        textAlign: 'left',
                        color: colors.white,
                        fontSize: 12,
                    }}
                >
                    {name}
                </SmallText>
                <RegularText textStyle={{
                    color: colors.white,
                    textAlign: "left",
                    fontSize: 13
                }}>
                    {amount}
                </RegularText>
            </>
        </SendMoneyItemContainer>
    )
}

export default SendMoneyItem