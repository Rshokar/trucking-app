import React, { FunctionComponent, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import TransactionAvi from './TicketAvi'
import RegularText from '../Texts/RegularText'
import { colors } from '../colors'
import SmallText from '../Texts/SmallText'
import { IconButton, useTheme } from 'react-native-paper';
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
    flex:3;
`

const RightView = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
`



const TicketItem: FunctionComponent<TicketItemProps> = (props) => {

    const [deleting, setDeleting] = useState(false);
    const theme = useTheme();

    const handleDelete = async () => {
        props.onDelete && setDeleting(await props.onDelete())
        setDeleting(false);
    }

    return (
        <TicketRow onPress={props.onClick} onLongPress={() => setDeleting(true)} pressRetentionOffset={{ top: 10, left: 10, bottom: 10, right: 10 }}>
            <LeftView>
                <TransactionAvi
                    background={props.aviColor || colors.tertiary}
                    icon={props.avatar}
                    onClick={props.onAVIClick}
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
                {(deleting && props.onDelete) && <>
                    <IconButton icon={'cancel'} iconColor={theme.colors.primary} size={20} onPress={() => setDeleting(false)} />
                    <IconButton icon={'delete'} iconColor={theme.colors.error} size={20} onPress={handleDelete} />
                </>}
                {(!deleting && props.buttonClickIcon && props.onButtonClick) && <IconButton icon={props.buttonClickIcon} size={20} onPress={props.onButtonClick} />}
            </RightView>
        </TicketRow>
    )
}

export default TicketItem
