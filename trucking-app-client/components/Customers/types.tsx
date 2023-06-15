import { Customer } from '../../models/Customer'


export interface CustomerSectionProps {
    data: Array<Customer>
    onClick: (id: number) => any
}