import { ViewStyle } from "react-native";

export interface TicketProps {
    id: number;
    title: string;
    subTitle: string;
    data: string;
    style?: ViewStyle;
}