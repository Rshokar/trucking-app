import React, { FunctionComponent, useEffect, useState, useCallback } from 'react';
import { TextInput, Modal, FAB, Snackbar } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import moment from 'moment';
import { Dispatch, DispatchQuery } from '../../../models/Dispatch'
import { DispatchController } from '../../../controllers/DispatchController'
import DispatchForm from '../../../components/Forms/DispatchForm';
import { StyledSection, StyledHeader } from './styles';
import TicketSection from '../../../components/Tickets/TicketSection';
import TicketItem from '../../../components/Tickets/TicketItem';
import { DispatchFormResult } from '../../../components/Forms/DispatchForm';
import { Customer, CustomerQuery } from '../../../models/Customer';
import MyModal from '../../../components/Modal/MyModal';
import { CustomerController } from '../../../controllers/CustomerController';

type Props = {
    navigateToTickets: (dispId: string) => void;
    customers: Customer[]
}

const DispatchSection: FunctionComponent<Props> = ({ navigateToTickets, customers }) => {
    const [dispatches, setDispatches] = useState<Dispatch[]>([]);
    const [query, setQuery] = useState<DispatchQuery>(new DispatchQuery());
    const [focusingDispatch, setFocusingDispatch] = useState<Dispatch | null>(null);
    const [enablePaginate, setEnablePaginate] = useState<boolean>(false);
    const [showDateModal, setShowDateModal] = useState<boolean>(false);
    const [showFormModal, setShowFormModal] = useState<boolean>(false);
    const [visibleSnackbar, setVisibleSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarColor, setSnackbarColor] = useState('green');

    useEffect(() => {
        async function fetchDispatches() {
            const dispatchController = new DispatchController();
            const disRes: Dispatch[] = await dispatchController.getAll(query);
            if (query.page === 0) {
                setDispatches(disRes);
            } else {
                setDispatches([...dispatches, ...disRes]);
            }
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
            console.log("DISPATCH RESULT", res)
            res.customer = customers.find(c => c.customer_id === data.customer_id);
            res.rfo_count = 0;
            dispatches.push(res)
            setDispatches([...dispatches]);
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
            console.log("UPDATED DISPATCH", updatedDispatch);
            updatedDispatch.rfo_count = focusingDispatch.rfo_count;
            const index = dispatches.findIndex(d => d.dispatch_id === focusingDispatch.dispatch_id);
            dispatches[index] = updatedDispatch;
            setDispatches([...dispatches]);
            setFocusingDispatch(null); // Reset focusingDispatch after update
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
                render={({ item }: { item: Dispatch }) => {
                    return <TicketItem
                        title={item.customer?.customer_name || ''}
                        subtitle={moment(item.date).format('YYYY-MM-DD')}
                        avatar={item.rfo_count + ""}
                        onClick={() => {
                            console.log("HELLO WORLD");
                            setFocusingDispatch(item);
                            navigateToTickets(item.dispatch_id + "");
                        }}
                        onButtonClick={() => {
                            setFocusingDispatch(item);
                            setShowFormModal(true);
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
                onPress={() => setShowFormModal(true)}
            />

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
