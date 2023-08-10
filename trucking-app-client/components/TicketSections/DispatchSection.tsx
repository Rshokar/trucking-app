import React, { FunctionComponent, useEffect, useState, useCallback } from 'react';
import { TextInput, Modal, FAB, Snackbar, Portal, Chip, useTheme, Text } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import moment from 'moment';
import { Dispatch, DispatchQuery } from '../../models/Dispatch';
import { DispatchController } from '../../controllers/DispatchController';
import DispatchForm from '../Forms/DispatchForm';
import { StyledSection, StyledHeader } from './styles';
import TicketSection from '../Tickets/TicketSection';
import TicketItem from '../Tickets/TicketItem';
import { DispatchFormResult } from '../Forms/DispatchForm';
import { CustomerQuery, Customer } from '../../models/Customer';
import MyModal from '../Modal/MyModal';
import { CustomerController } from '../../controllers/CustomerController';
import DispatchCard from '../Cards/DIspatchCard';
import { View } from 'react-native';
type Props = {
    navigateToTickets: (dispId: string) => void;
    customers: Customer[];
    filteringCustomers: Set<Customer>
    removeCustomerFilter: (cus: Customer) => any
}

const DispatchSection: FunctionComponent<Props> = ({ navigateToTickets, customers, filteringCustomers, removeCustomerFilter }) => {
    const [dispatches, setDispatches] = useState<Dispatch[]>([]);
    const [query, setQuery] = useState<DispatchQuery>(new DispatchQuery());
    const [focusingDispatch, setFocusingDispatch] = useState<Dispatch>();
    const [enablePaginate, setEnablePaginate] = useState<boolean>(false);
    const [showDateModal, setShowDateModal] = useState<boolean>(false);
    const [showFormModal, setShowFormModal] = useState<boolean>(false);
    const [visibleSnackbar, setVisibleSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarColor, setSnackbarColor] = useState('green');
    const [showDispatchCard, setShowDispatchCard] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true);
    const theme = useTheme();

    useEffect(() => {
        const cusIds = new Set<number>();
        filteringCustomers.forEach(c => cusIds.add(c.customer_id))
        query.customers = cusIds
        setQuery({ ...query });
    }, [filteringCustomers])

    useEffect(() => {
        async function fetchDispatches() {
            if (query.page === 0) setLoading(true);
            const dispatchController = new DispatchController();
            const disRes: Dispatch[] = await dispatchController.getAll(query);
            if (query.page === 0) {
                setDispatches(disRes);
            } else {
                setDispatches([...dispatches, ...disRes]);
            }
            setLoading(false)
            setEnablePaginate(disRes.length === query.limit);
        }
        fetchDispatches();
    }, [query]);

    const paginate = () => {
        if (enablePaginate) {
            query.page = query.page + 1;
            setQuery({ ...query });
            setEnablePaginate(false);
        }
    };

    const onConfirm = useCallback(({ startDate, endDate }: any) => {
        setShowDateModal(false);
        query.startDate = moment(startDate).format("YYYY-MM-DD");
        query.endDate = moment(endDate).format("YYYY-MM-DD");
        setQuery({ ...query });
    }, [setShowDateModal, setQuery]);

    const handleDispatchFormSubmit = async (values: Dispatch): Promise<boolean> => {
        try {
            if (focusingDispatch) {
                return await handleUpdateDispatch(values);
            } else {
                return await handleCreateDispatch(values);
            }
        } catch (err: any) {
            console.error(err);
            setSnackbarColor('red');
            setSnackbarMessage(err.message);
            setVisibleSnackbar(true);
            return false;
        }
    };

    const handleCreateDispatch = async (data: Dispatch): Promise<boolean> => {
        const dC = new DispatchController();
        try {
            const res: Dispatch = await dC.create(data);
            res.customer = customers.find(c => c.customer_id === data.customer_id);
            res.rfo_count = 0;
            setDispatches([res, ...dispatches]);
            setSnackbarColor('green');
            setSnackbarMessage('Dispatch created successfully');
            setVisibleSnackbar(true);
            setShowFormModal(false)
            return true;
        } catch (err: any) {
            setSnackbarColor('red');
            setSnackbarMessage(err.message);
            setVisibleSnackbar(true);
            throw err;
        }
    }

    const handleUpdateDispatch = async (data: Dispatch): Promise<boolean> => {
        const dC = new DispatchController();
        if (!focusingDispatch) return false;
        try {
            const updatedDispatch = await dC.update(focusingDispatch.dispatch_id + "", data);
            if (data.customer_id !== focusingDispatch.customer_id) {
                // Get customer from DB
                const cC = new CustomerController();
                const cQ = new CustomerQuery();
                cQ.customer_id = data.customer_id ?? 0;
                const cus: Customer = await cC.get(cQ)
                updatedDispatch.customer = cus;
            }
            updatedDispatch.rfo_count = focusingDispatch.rfo_count;
            const index = dispatches.findIndex(d => d.dispatch_id === focusingDispatch.dispatch_id);
            dispatches[index] = updatedDispatch;
            setDispatches([...dispatches]);
            setFocusingDispatch(undefined); // Reset focusingDispatch after update
            setSnackbarColor('green');
            setSnackbarMessage('Dispatch updated successfully');
            setVisibleSnackbar(true);
            setShowFormModal(false)
            return true;
        } catch (err: any) {
            setSnackbarColor('red');
            setSnackbarMessage(err.message);
            setVisibleSnackbar(true);
            return false;
        }
    }

    const handleDelete = async (id: string): Promise<boolean> => {
        try {
            const dC = new DispatchController();

            await dC.delete(id);
            setDispatches([...dispatches.filter(d => (d.dispatch_id + "") !== id)])
            setSnackbarMessage("Dispatch deleted successfully");
            setSnackbarColor('green');
            setVisibleSnackbar(true);
            setShowFormModal(false);
            return true;
        } catch (err: any) {
            setSnackbarColor('red');
            setSnackbarMessage(err.message);
            setVisibleSnackbar(true);
            return false
        }
    }

    const handleRefresh = async () => {
        const q = new DispatchQuery();
        q.startDate = query.startDate;
        q.endDate = query.endDate;
        q.customers = query.customers;
        setQuery(q);
    }

    console.log("LOADING", loading)

    return (
        <StyledSection>
            <StyledHeader>
                <TextInput label={"Start Date"} value={query.startDate ?? moment().format("YYYY-MM-DD")} onPressIn={() => setShowDateModal(true)} />
                <TextInput label={"End Date"} value={query.endDate ?? moment().format("YYYY-MM-DD")} onPressIn={() => setShowDateModal(true)} />
                <DatePickerModal
                    locale='en'
                    mode='range'
                    visible={showDateModal}
                    onDismiss={() => setShowDateModal(false)}
                    startDate={query.startDate ? new Date(query.startDate) : new Date()}
                    endDate={query.endDate ? new Date(query.endDate) : new Date()}
                    onConfirm={onConfirm}
                />
            </StyledHeader>
            {
                filteringCustomers.size > 0 &&
                <View style={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 10,
                    padding: 20,
                }}>
                    {Array.from(filteringCustomers).map((customer, index) => (
                        <Chip
                            key={index}
                            style={{ backgroundColor: theme.colors.secondary, height: 40 }}
                            textStyle={{ color: 'white' }}
                            onPress={() => removeCustomerFilter(customer)}
                        >
                            {customer.customer_name}
                        </Chip>
                    ))}
                </View>
            }
            <MyModal visible={showFormModal}
                onDismiss={() => setShowFormModal(false)}
                title={'Add/Edit Dispatch'} >
                <DispatchForm
                    onSubmit={handleDispatchFormSubmit} defaultValues={focusingDispatch as DispatchFormResult}
                    customers={customers}
                />
            </MyModal>
            <TicketSection
                more={enablePaginate}
                data={dispatches}
                onRefresh={handleRefresh}
                loading={loading}
                render={({ item }: { item: Dispatch }) => {
                    return <TicketItem
                        title={item.customer?.customer_name || ''}
                        subtitle={moment(item.date).format('YYYY-MM-DD')}
                        avatar={item.rfo_count + ""}
                        onClick={() => {
                            setFocusingDispatch(item);
                            navigateToTickets(item.dispatch_id + "");
                        }}
                        onButtonClick={() => {
                            setFocusingDispatch(item);
                            setShowFormModal(true);
                        }}
                        onLongpress={() => {
                            setFocusingDispatch(item)
                            setShowDispatchCard(true)
                        }}
                        buttonClickIcon={'pencil'}
                        onDelete={() => handleDelete(item.dispatch_id + "")}
                    />
                }}
                paginate={paginate}
            />
            <FAB
                style={{
                    position: 'absolute',
                    margin: 16,
                    right: 0,
                    bottom: 0,
                }}
                icon="plus"
                onPress={() => {
                    setFocusingDispatch(undefined)
                    setShowFormModal(true)
                }}
            />
            <Portal>
                <Modal
                    visible={showDispatchCard}
                    onDismiss={() => {
                        setShowDispatchCard(false);
                        setFocusingDispatch(undefined);
                    }}
                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                    <DispatchCard {...focusingDispatch} />
                </Modal>
            </Portal>

            <Snackbar
                visible={visibleSnackbar}
                onDismiss={() => setVisibleSnackbar(false)}
                action={{
                    label: 'OK',
                    onPress: () => {
                        setVisibleSnackbar(false);
                    },
                }}
                style={{ backgroundColor: snackbarColor }}
            >
                {snackbarMessage}
            </Snackbar>
        </StyledSection>
    )
}

export default DispatchSection;
