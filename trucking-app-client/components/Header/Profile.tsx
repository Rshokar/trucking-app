import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import {
    ImageSourcePropType,
    GestureResponderEvent,
    StyleProp,
    ViewStyle,
    ImageStyle
} from 'react-native'

const StyledImage = styled.Image`
        resize-mode: cover;
        widthL 100%; 
        height: 100%; 
        border-radius: 15px
`

const StyledView = styled.TouchableOpacity`
        flex-direction: column;
        height: 45px; 
        width: 45px;
        border-radius: 15px;
`


import profileImage from '../../assets/favicon.png';

interface ProfileProps {
    imageStyle?: StyleProp<ImageStyle>;
    imageContainerStyle?: StyleProp<ViewStyle>
    onPress?: ((event: GestureResponderEvent) => void) | undefined
}

const Profile: FunctionComponent<ProfileProps> = (props) => {
    return (
        <StyledView onPress={props.onPress} style={props.imageContainerStyle}>
            <StyledImage source={profileImage} style={props.imageStyle} />
        </StyledView>
    )
}

export default Profile