import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { StyleProp, TextStyle } from 'react-native'


// Custom components
import RegularText from '../Texts/RegularText'
import SmallText from '../Texts/SmallText'
import { colors } from '../colors'

const StyledView = styled.View`
    flex-direction: column; 
    justify-content: center;
`

interface GreetingProps {
    mainText: string;
    subText: string;
    mainTextSubStyles?: StyleProp<TextStyle>;
    subTextStyles?: StyleProp<TextStyle>;
}
const Greeting: FunctionComponent<GreetingProps> = (props) => {
    return (
        <StyledView>
            <RegularText
                textStyle={[
                    {
                        color: colors.secondary,
                        fontSize: 22
                    },
                    props.mainTextSubStyles
                ]}>
                {props.mainText}
            </RegularText>
            <SmallText
                textStyle={[
                    {
                        color: colors.graydark
                    },
                    props.subTextStyles,
                ]}
            >
                {props.subText}
            </SmallText>
        </StyledView>
    )
}

export default Greeting