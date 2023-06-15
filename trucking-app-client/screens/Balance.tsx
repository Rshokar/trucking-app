import React, { FunctionComponent } from 'react'
import { StatusBar } from 'expo-status-bar'
import styled from 'styled-components/native'

import { colors } from '../components/colors'
import { Container } from '../components/shared'
import AmountSection from '../components/Balance/AmmountSection'
import BalanceCardSection from '../components/Balance/BalanceCardSection'


const BalanceContainer = styled(Container)`
    background-color: ${colors.graylight}; 
    width: 100%;
    padding: 25px;
    flex: 1;
`
import { RoofStackParamList } from '../navigators/RoofStack'
import { StackScreenProps } from '@react-navigation/stack'
import ButtonSection from '../components/Balance/ButtonSection'
type Props = StackScreenProps<RoofStackParamList, 'Balance'>;

const Balance: FunctionComponent<Props> = ({ route }) => {
    return (
        <BalanceContainer>
            <StatusBar style='dark' />
            <AmountSection balance={route?.params?.balance} />
            <BalanceCardSection {...route?.params} />
            <ButtonSection />
        </BalanceContainer>
    )
}

export default Balance