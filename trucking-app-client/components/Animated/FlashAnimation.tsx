import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'
import {
    Animated,
    StyleSheet,
} from 'react-native'


import { colors } from '../colors'
import { ScreenHeight } from '../shared'


const DEFAULT_VH = .2 * ScreenHeight
const DEFAULT_DURATION = 500;


const StyledText = styled.Text`
    color: ${colors.white};  
    text-align: center
`

import { AnimationProps } from './types'
export interface FlashAnimationProps extends AnimationProps {
    color?: string,
    duration?: number
}

const FlashAnimation: FunctionComponent<FlashAnimationProps> = (props) => {

    const [viewHeight, setViewHeight] = useState<number>(() => ScreenHeight * (props.VH ? props.VH : DEFAULT_VH))
    const [duration, setDuration] = useState<number>(DEFAULT_DURATION)
    const height = useRef(new Animated.Value(0)).current

    const styles = StyleSheet.create({
        container: {
            height: 0,
            width: '100%',
            backgroundColor: props.color ? props.color : colors.success,
            borderRadius: 5,
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            overflow: 'hidden',
        },
    })

    if (props.color) styles.container.backgroundColor = props.color
    else styles.container.backgroundColor = colors.success

    const animations = [
        Animated.timing(height, {
            toValue: 30,
            duration: duration,
            useNativeDriver: true,
        }),
        Animated.delay(2000), // add a one-second delay here
        Animated.timing(height, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
        }),
        // add more animations as needed
    ];


    useEffect(() => {
        props.onAnimationBegin && props.onAnimationBegin()
        if (props.children != "")
            Animated.sequence(animations).start(() => {
                props.onAnimationEnd && props.onAnimationEnd()
            })
    }, [props.children])

    useEffect(() => setDuration(props.duration ? props.duration : DEFAULT_DURATION), [props.duration])

    return <Animated.View
        style={[
            styles.container,
            {
                transform: [
                    {
                        scaleY: height.interpolate(
                            {
                                inputRange: [0, 30],
                                outputRange: [0, 1]
                            }
                        )
                    }
                ]
            }
        ]}>
        <StyledText>
            {props.children}
        </StyledText>
    </Animated.View>

}


export default FlashAnimation