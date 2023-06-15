import { Model } from "../../models/Model";


export interface TicketSectionProps {
    data: Array<Model>
    render: ({ item }: any) => any
}

export interface TicketAviProps {
    icon: any;
    background: string;
}