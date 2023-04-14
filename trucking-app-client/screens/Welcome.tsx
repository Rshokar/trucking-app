import React, { FunctionComponent } from 'react'
import { StatusBar } from 'expo-status-bar'
import styled from 'styled-components/native'

import BigText from '../components/Texts/BigText'
// import RegularText from '../components/Texts/RegularText'
import SmallText from '../components/Texts/SmallText'
import RegularButton from '../components/Buttons/RegularButton'

// Custom Components
import { colors } from '../components/colors'
import { Container } from '../components/shared'

const WelcomContainer = styled(Container)`
    background-color: ${colors.secondary};
    justify-content: space-between;
    width: 100%;
    height: 100%;
`

const TopSection = styled.View`
    width: 100%;
    flex: 1;
    max-height: 55%;
`

const TopImage = styled.Image`
    width: 100%; 
    height: 100%; 
    reasize-mode: stretch;
`

const BottomSection = styled.View`
    width: 100%; 
    padding: 25px;
    flex: 1;
    justify-content: flex-end;
`





const Welcome: FunctionComponent = () => {
    return (
        <>
            <StatusBar style='light' />
            <WelcomContainer>
                <TopSection >
                    <TopImage source={""} />
                </TopSection>
                <BottomSection >
                    <BigText textStyle={{ width: "70%", marginBottom: 25 }}>
                        Paper Less Trucking
                    </BigText>
                    <SmallText textStyle={{ width: "70%", marginBottom: 25 }}>
                        Drop the books and pick up the future
                    </SmallText>
                    <RegularButton onPress={() => { }}>
                        Get Started
                    </RegularButton>
                </BottomSection>
            </WelcomContainer>
        </>
    )
}

export default Welcome