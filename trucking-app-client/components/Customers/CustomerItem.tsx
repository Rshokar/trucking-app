import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { colors } from '../colors'

import RegularText from '../Texts/RegularText'
import SmallText from '../Texts/SmallText'
import Profile from '../Header/Profile'
import { ScreenWidth } from '../shared'

const CustomerItemContainer = styled.TouchableHighlight`
    height: 50px; 
    width: ${Math.floor(ScreenWidth * 0.27)}px;
    padding: 10px;
    border-radius: 15px; 
    justify-content: space-around;
    margin: 0px 10px 10px 0px;
`
import { Customer } from '../../models/Customer'
interface CustomerItemProps extends Customer {
    color: string
}

const CustomerItem: FunctionComponent<CustomerItemProps> = (props) => {

    console.log("CUSTOMER ITEM PROPS", props)

    // <Profile imageContainerStyle={{ marginBottom: 10 }} />
    return (
        <CustomerItemContainer
            underlayColor={colors.secondary}
            style={{ backgroundColor: props.color }}
            onPress={() => {
                alert("Send Money!")
            }}
        >
            <>
                <RegularText
                    textStyle={{
                        textAlign: 'center',
                        color: colors.white,
                        fontSize: 12,
                    }}
                >
                    {props.customerName}
                </RegularText>
            </>
        </CustomerItemContainer>
    )
}

export default CustomerItem