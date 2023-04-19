import React, { FunctionComponent, useRef, useEffect } from 'react'
import { View, PanResponder, Animated, StyleSheet } from 'react-native';

import { ScreenHeight } from '../shared';
const VH = ScreenHeight * 0.75
import { colors } from '../colors';


import { AnimationProps } from './types';

const SwipeDownViewAnimation: FunctionComponent<AnimationProps> = (props) => {
    const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (event, gesture) => {
                // Save the initial position of the touch
                position.setOffset({
                    x: 0,
                    y: 0
                });
                position.setValue({ x: 0, y: ScreenHeight - VH });
            },
            onPanResponderMove: (event, gesture) => {
                // Calculate the change in gesture position from the initial position of the touch
                position.setValue({ x: 0, y: (ScreenHeight - VH) + gesture.dy });
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dy > 0.5 * ScreenHeight) {
                    props.close()
                } else {
                    Animated.spring(position, {
                        toValue: { x: 0, y: ScreenHeight - VH },
                        useNativeDriver: true
                    }).start();
                }

            }
        })
    ).current;

    useEffect(() => {
        console.log("SOLO", position.getLayout())
    })

    useEffect(() => {
        if (props.show) {
            return Animated.timing(position, {
                toValue: { x: 0, y: ScreenHeight - VH },
                duration: 300,
                useNativeDriver: true
            }).start();
        }
        return Animated.timing(position, {
            toValue: { x: 0, y: ScreenHeight },
            duration: 300,
            useNativeDriver: true
        }).start();

    }, [props.show])

    return (
        <Animated.View
            style={[styles.container, { transform: [{ translateY: position.y }] }]}
            {...panResponder.panHandlers}
        >
            <View style={styles.content}>
                {props.children}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: VH,
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
    }
});


export default SwipeDownViewAnimation;
