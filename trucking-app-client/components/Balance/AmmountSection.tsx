import React, { FunctionComponent } from 'react';
import styled from 'styled-components/native'

import { colors } from '../colors';
import SmallText from '../Texts/SmallText';
import RegularText from '../Texts/RegularText';


const AmountSectionBackground = styled.View`
    widthL 100%
    padding-top: 5p; 
    align-items: center; 
    flex: 1;
`

import { AmountProps } from './types';

const AmountSection: FunctionComponent<AmountProps> = (props) => {
    return (
        <AmountSectionBackground>
            <SmallText textStyle={{ color: colors.secondary, marginBottom: 15 }}>
                Total Balance
            </SmallText>
            <RegularText textStyle={{ color: colors.secondary, fontSize: 28 }}>
                {props.balance}
            </RegularText>
        </AmountSectionBackground>
    );
}

export default AmountSection;