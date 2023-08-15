import { Model } from "../../models/Model";
import { StyleProps } from "react-native-reanimated";
import { ViewStyle, TextStyle, GestureResponderEvent } from 'react-native';
import { IconSource } from "react-native-paper/lib/typescript/src/components/Icon";
import { ReactNode } from "react";


export interface TicketSectionProps {
    data: Array<Model>
    render: ({ item }: any) => any
    style?: StyleProps
    paginate?: () => void;
    more: boolean;
    loading: boolean
    title?: string;
    onRefresh?: () => Promise<any>;
    onNoTicketsFound: () => any;
    noTicketFoundMessage: string;
    noTicketFoundSVG?: ReactNode
}

export interface TicketAviProps {
    icon: any;
    background: string;
    onClick?: () => any
}


export interface TicketItemProps {
    title: string;
    subtitle?: string;
    avatar: string;
    buttonClickIcon?: IconSource;
    onButtonClick?: () => any;
    onDelete?: () => Promise<boolean>;
    onClick?: (event: GestureResponderEvent) => void;
    onLongpress?: () => any;
    style?: ViewStyle;
    textStyle?: TextStyle;
    aviColor?: string;
}
