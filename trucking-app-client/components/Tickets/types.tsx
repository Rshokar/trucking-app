import { Model } from "../../models/Model";
import { StyleProps } from "react-native-reanimated";
import { ViewStyle, TextStyle, GestureResponderEvent } from 'react-native';


export interface TicketSectionProps {
    data: Array<Model>
    render: ({ item }: any) => any
    style?: StyleProps
    paginate?: () => void;
    more: boolean;
    title?: string;
}

export interface TicketAviProps {
    icon: any;
    background: string;
}


export interface TicketItemProps {
    title: string;
    subtitle?: string;
    avatar: string;
    button1Label?: string;
    button2Label?: string;
    onClick?: (event: GestureResponderEvent) => void;
    onLongClick?: (event: GestureResponderEvent) => void;
    onButton1Click?: (event: GestureResponderEvent) => void;
    onButton2Click?: (event: GestureResponderEvent) => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    aviColor?: string;
}
