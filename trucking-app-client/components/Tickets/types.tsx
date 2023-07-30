import { Model } from "../../models/Model";
import { StyleProps } from "react-native-reanimated";
import { ViewStyle, TextStyle, GestureResponderEvent } from 'react-native';
import { IconSource } from "react-native-paper/lib/typescript/src/components/Icon";


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
    buttonOneIcon?: IconSource;
    buttonTwoIcon?: IconSource;
    onClick?: (event: GestureResponderEvent) => void;
    onLongClick?: (event: GestureResponderEvent) => void;
    onDelete?: () => Promise<boolean>;
    onButton2Click?: (event: GestureResponderEvent) => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    aviColor?: string;
}
