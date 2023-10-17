import React from 'react'
import { View } from 'react-native'
import { Button, Text, useTheme } from 'react-native-paper'
import styled from 'styled-components/native'


const ValidateEmailStyledView = styled(View)`
    display: flex; 
    flex-direction: column;
    justify-content: center;
    align-items: center; 
    gap: 20px;
    padding: 20px; 
    height: 50%;
    
`
type Props = {
    onCompletion: () => void;
}

const ValidateEmail = (props: Props) => {

    const theme = useTheme();
    return (
        <ValidateEmailStyledView>
            <Text style={{ textAlign: 'center', color: theme.colors.primary }} variant='headlineLarge'>Validate Email</Text>
            <Text style={{ textAlign: 'center' }}>Sorry, but you need to validate your email before getting access to trucking app</Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
                <Button style={{ flex: 1, backgroundColor: theme.colors.primary }} onPress={() => {
                }}>
                    <Text style={{ color: 'white', }}>
                        Check again
                    </Text>
                </Button>
                <Button style={{ flex: 1, backgroundColor: theme.colors.secondary }} onPress={() => {
                }}>
                    <Text style={{ color: 'white' }}>
                        Send email
                    </Text>
                </Button>
            </View>
        </ValidateEmailStyledView>
    )
}

export default ValidateEmail