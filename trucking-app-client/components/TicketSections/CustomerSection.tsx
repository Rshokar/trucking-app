import React, { FC, useState, useEffect } from 'react';
import { FAB, TextInput, useTheme, Snackbar } from 'react-native-paper';
import { useTabNavigation } from 'react-native-paper-tabs';
import styled from 'styled-components/native';
import { Customer, CustomerQuery } from '../../models/Customer';
import { CustomerController } from '../../controllers/CustomerController';
import TicketItem from '../Tickets/TicketItem';
import { StyledHeader, StyledSection } from './styles';
import TicketSection from '../Tickets/TicketSection';
import CustomerForm from '../Forms/CustomerForm';
import { CustomerFormResult } from '../Forms/types';
import MyModal from '../Modal/MyModal';

const StyledInput = styled(TextInput)`
    width: 90%;
`;

const FabContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: flex-end;
  margin-bottom: 20px;
  margin-right: 20px;
`;

type Props = {
    navigateToTicket: (cus: Customer) => void;
};

const CustomerSection: FC<Props> = ({ navigateToTicket }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [query, setQuery] = useState<CustomerQuery>(new CustomerQuery());
    const [enablePaginate, setEnablePaginate] = useState<boolean>(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const [focusedCustomers, setFocusedCustomer] = useState<Customer>();
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const [loading, setLoading] = useState<boolean>(false)
    const theme = useTheme();
    const tabNav = useTabNavigation();
    useEffect(() => {
        getCustomers();
    }, [query]);

    const getCustomers = async () => {
        const customerController = new CustomerController();
        if (query.page === 0) setLoading(true);

        const cusRes: Customer[] = await customerController.getAll(query);

        if (query.page === 0) {
            setCustomers(cusRes);
        } else {
            setCustomers([...customers, ...cusRes]);
        }
        setLoading(false);
        setEnablePaginate(cusRes.length === query.limit);
    };

    const paginate = () => {
        if (enablePaginate) {
            setQuery({ ...query, page: query.page + 1 });
            setEnablePaginate(false);
        }
    };

    const handleAddCustomer = async (data: Customer): Promise<boolean> => {
        try {
            const cC = new CustomerController();
            const res: Customer = await cC.create(data as Customer);
            setCustomers([...customers, res]);
            hideModal();
            return true;
        } catch (err: any) {
            console.log(err);
            setSnackbarMessage(err.message);
            setSnackbarVisible(true);
            return false;
        }
    }

    const handleEditCustomer = async (data: Customer, id: string): Promise<boolean> => {
        try {
            const cC = new CustomerController();
            const q = new CustomerQuery();
            q.customer_id = parseFloat(id);
            const res: Customer = await cC.update(id, data as Customer);
            const index = customers.findIndex(cus => (cus.customer_id + "") === id);
            customers[index] = res;
            setCustomers([...customers]);
            setFocusedCustomer(undefined);
            hideModal();
            return true;
        } catch (err: any) {
            console.log(err);
            setSnackbarMessage(err.message);
            setSnackbarVisible(true);
            return false;
        }
    }
    const handleFormSubmit = async (formData: CustomerFormResult, id?: string): Promise<boolean> => {
        if (id) {
            return await handleEditCustomer(formData as Customer, focusedCustomers?.customer_id + "")
        } else {
            return await handleAddCustomer(formData as Customer);
        }
    };

    const handleDelete = async (id: string): Promise<boolean> => {
        try {
            const cC = new CustomerController();
            const res = await cC.delete(id);

            // if true customer was deleted otherwise flagged deleted
            if (res) {
                setCustomers([...customers.filter(c => (c.customer_id + "") !== id)])
            } else {
                let index = customers.findIndex(c => c.customer_id.toString() === id);
                customers[index].deleted = true;
                setCustomers([...customers]);
            }
            setSnackbarMessage('Customer deleted successfully');
            setSnackbarVisible(true);
            return true;
        } catch (err: any) {
            console.log(err);
            setSnackbarMessage(err.message);
            setSnackbarVisible(true);
            return false;
        }
    }


    const handleRefresh = async () => {
        const q = new CustomerQuery();
        setQuery(q);
    }

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
                loading={loading}
                title={'Customers'}
                more={enablePaginate}
                data={customers}
                onRefresh={handleRefresh}
                render={({ item }: { item: Customer }) => {
                    if (item.customer_name?.match(query.customer_name || '')) {
                        return (
                            <TicketItem
                                aviColor={theme.colors.tertiary}
                                title={item.customer_name || ''}
                                avatar={item.customer_name?.charAt(0).toLocaleUpperCase() || 'A'}
                                onButtonClick={() => {
                                    setFocusedCustomer(item);
                                    setVisible(true);
                                }}
                                buttonClickIcon={"pencil"}
                                onDelete={async (): Promise<boolean> => await handleDelete(item.customer_id + "")}
                                onClick={function () {
                                    tabNav(0);
                                    navigateToTicket(item);
                                }}
                            />
                        );
                    }
                }}
                paginate={paginate}
            />
            <MyModal
                visible={visible}
                onDismiss={function (): void {
                    setVisible(false);
                }}
                title={'Add Customer'}
            >
                <CustomerForm
                    onSubmit={handleFormSubmit}
                    defaultValues={focusedCustomers as CustomerFormResult} />
            </MyModal>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                action={{
                    label: 'Dismiss',
                    onPress: () => {
                        setSnackbarVisible(false);
                    },
                }}
            >
                {snackbarMessage}
            </Snackbar>

            {
                !visible &&
                <FAB icon="plus"
                    onPress={() => {
                        setFocusedCustomer(undefined)
                        showModal();
                    }}
                    style={{
                        position: 'absolute',
                        margin: 16,
                        right: 0,
                        bottom: 0,
                    }} />
            }
        </StyledSection>
    );
};

export default CustomerSection;
