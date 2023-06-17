import { CSSProperties } from "styled-components";
import { Model } from "../../models/Model";
import { StyleProps } from "react-native-reanimated";


export interface TicketSectionProps {
    data: Array<Model>
    render: ({ item }: any) => any
    style?: StyleProps
    paginate?: () => void;
}

export interface TicketAviProps {
    icon: any;
    background: string;
}