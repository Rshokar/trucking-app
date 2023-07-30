import React, { FC, useState, useEffect } from 'react';
import { TextInput, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';
import { Customer, CustomerQuery } from '../../../models/Customer';
import { CustomerController } from '../../../controllers/CustomerController';
import TicketItem from '../../../components/Tickets/TicketItem';
import { StyledHeader, StyledSection } from './styles';
import TicketSection from '../../../components/Tickets/TicketSection';

const StyledInput = styled(TextInput)`
    width: 90%;
`;

type Props = {
    navigateToTicket: (customerId: number) => void;
};

const CustomerSection: FC<Props> = ({ navigateToTicket }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [query, setQuery] = useState<CustomerQuery>(new CustomerQuery());
    const [enablePaginate, setEnablePaginate] = useState<boolean>(false);
    const theme = useTheme();

    useEffect(() => {
        getCustomers();
    }, [query]);

    const getCustomers = async () => {
        const customerController = new CustomerController();
        const cusRes: Customer[] = await customerController.getAll(query);

        if (query.page === 0) {
            setCustomers(cusRes);
        } else {
            setCustomers([...customers, ...cusRes]);
        }

        setEnablePaginate(cusRes.length === query.limit);
    };

    const paginate = () => {
        if (enablePaginate) {
            setQuery({ ...query, page: query.page + 1 });
            setEnablePaginate(false);
        }
    };

    return (
        <StyledSection>
            <StyledHeader>
                <StyledInput
                    label={'Customers'}
                    value={query.customer_name}
                    onChangeText={(text) => {
                        setQuery({ ...query, customer_name: text });
                    }}
                />
            </StyledHeader>
            <TicketSection
                title={'Customers'}
                more={enablePaginate}
                data={customers}
                render={({ item }: { item: Customer }) => {
                    if (item.customer_name?.match(query.customer_name || '')) {
                        return (
                            <TicketItem
                                aviColor={theme.colors.error}
                                title={item.customer_name || ''}
                                avatar={item.customer_name?.charAt(0).toLocaleUpperCase() || 'A'}
                                onClick={() => navigateToTicket(item.customer_id)}
                            />
                        );
                    }
                }}
                paginate={paginate}
            />
        </StyledSection>
    );
};

export default CustomerSection;
