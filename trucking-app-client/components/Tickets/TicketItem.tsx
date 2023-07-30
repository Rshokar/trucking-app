import React, { FunctionComponent } from 'react'
import { TouchableOpacity, View, Button } from 'react-native'
import styled from 'styled-components/native'
import TransactionAvi from './TicketAvi'
import RegularText from '../Texts/RegularText'
import { colors } from '../colors'
import SmallText from '../Texts/SmallText'
import { AntDesign } from '@expo/vector-icons';
import { TicketItemProps } from './types'

const TicketRow = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 25px;
`

const LeftView = styled.View`
    flex-direction: row;
    justify-content: flex-start;
    height: 100%;
    align-items: center;
    flex:2;
`

const RightView = styled.View`
    flex: 1; 
`

const TicketItem: FunctionComponent<TicketItemProps> = (props) => {
    return (
        <TicketRow onPress={props.onClick} onLongPress={props.onLongClick}>
            <LeftView>
                <TransactionAvi
                    background={props.aviColor || colors.tertiary}
                    icon={props.avatar}
                />
                <View style={{ marginLeft: 10 }}>
                    <RegularText textStyle={{
                        color: colors.secondary,
                        textAlign: "left"
                    }}>
                        {props.title}
                    </RegularText>
                    {
                        props.subtitle &&
                        <SmallText textStyle={{
                            textAlign: 'left',
                            color: colors.graydark,
                        }}>
                            {props.subtitle}
                        </SmallText>
                    }
                </View>
            </LeftView>
            <RightView>
                {props.button1Label && <Button title={props.button1Label} onPress={props.onButton1Click} />}
                {props.button2Label && <Button title={props.button2Label} onPress={props.onButton2Click} />}
                <RegularText textStyle={{
                    color: colors.secondary,
                    textAlign: "right"
                }}>
                    <AntDesign name="caretright" size={15} color="black" />
                </RegularText>
            </RightView>
        </TicketRow>
    )
}

export default TicketItem
