import React, { FunctionComponent, useRef, useEffect, useState } from 'react';
import {
    PanResponder,
    Animated,
    StyleSheet,
    Dimensions,
    findNodeHandle,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { colors } from '../colors';
import { AnimationProps } from './types';

const DEFAULT_VH: number = .85;
const { height: screenHeight } = Dimensions.get('window');

export interface SwipeDownViewAnimationProps extends AnimationProps {
    close: () => any
}

const SwipeDownViewAnimation: FunctionComponent<SwipeDownViewAnimationProps> = (props) => {

    const [viewHeight, setViewHeight] = useState<number>(() => screenHeight * (props.VH ? props.VH : DEFAULT_VH));
    const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

    const breakRef = useRef(null)

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (event, gesture) => {
                return event.nativeEvent.target == findNodeHandle(breakRef.current)?.toString();
            },
            onPanResponderGrant: (event, gesture) => {
                // Save the initial position of the touch
                position.setOffset({
                    x: 0,
                    y: 0,
                });
                position.setValue({ x: 0, y: screenHeight - viewHeight });
            },
            onPanResponderMove: (event, gesture) => {
                // Calculate the change in gesture position from the initial position of the touch
                position.setValue({ x: 0, y: screenHeight - viewHeight + gesture.dy });
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dy > 0.5 * screenHeight) {
                    props.close();
                } else {
                    Animated.spring(position, {
                        toValue: { x: 0, y: screenHeight - viewHeight },
                        useNativeDriver: true,
                    }).start();
                }
            },
        }),
    ).current;


    useEffect(() => {
        if (props.show) {
            return Animated.timing(position, {
                toValue: { x: 0, y: screenHeight - viewHeight },
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
        return Animated.timing(position, {
            toValue: { x: 0, y: screenHeight },
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [props.show, viewHeight]);

    useEffect(() => {
        setViewHeight(screenHeight * (props.VH ? props.VH : DEFAULT_VH))
    }, [props.VH])

    return (
        <Animated.View
            style={[
                styles.container,
                { transform: [{ translateY: position.y }] },
                { height: '100%' },
            ]}
            {...panResponder.panHandlers}
        >
            <Ionicons name="caret-down-outline" size={20} color={colors.secondary} />

            {props.children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        top: 0,
        left: 0,
        backgroundColor: colors.graylight,
        zIndex: 100,
        elevation: 5,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SwipeDownViewAnimation;
