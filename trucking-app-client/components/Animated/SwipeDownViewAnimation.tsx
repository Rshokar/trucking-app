import React, { FunctionComponent, useRef, useEffect } from 'react';
import {
    PanResponder,
    Animated,
    StyleSheet,
    Dimensions,
} from 'react-native';

import { colors } from '../colors';
import { AnimationProps } from './types';
import Break from '../Break/Break';

const { height: screenHeight } = Dimensions.get('window');
const viewHeight = screenHeight * 0.95;

const SwipeDownViewAnimation: FunctionComponent<AnimationProps> = (props) => {
    const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
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
    }, [props.show]);

    return (
        <Animated.View
            style={[
                styles.container,
                { transform: [{ translateY: position.y }] },
                { height: viewHeight },
            ]}
            {...panResponder.panHandlers}
        >
            <Break />
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
