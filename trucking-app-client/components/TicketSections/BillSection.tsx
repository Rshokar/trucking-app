import React, { FC, useState, useEffect } from 'react';
import { FAB, Modal, Snackbar, TextInput, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';
import { Bill, BillQuery } from '../../models/Bill';
import { BillController } from '../../controllers/BillController';
import TicketItem from '../Tickets/TicketItem';
import TicketSection from '../Tickets/TicketSection';
import { StyledHeader, StyledSection } from './styles';
import MyModal from '../Modal/MyModal';
import BillForm from '../Forms/BillForm';
import { BillFormResult } from '../Forms/BillForm';

const StyledInput = styled(TextInput)`
    width: 90%;
`;

type Props = {
    navigateToTicket: (bill: Bill) => void;
    rfoId: number;
};

const BillSection: FC<Props> = ({ navigateToTicket, rfoId }) => {
    const [bills, setBills] = useState<Bill[]>([]);
    const [query, setQuery] = useState<BillQuery>(() => {
        const bQ = new BillQuery();
        bQ.rfo_id = rfoId + "";
        return bQ;
    });
    const [enablePaginate, setEnablePaginate] = useState<boolean>(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const [focusedBill, setFocusedBill] = useState<Bill>();
    const [search, setSearch] = useState<string>("");
    const theme = useTheme();

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    useEffect(() => {
        getBills();
    }, [query]);

    const getBills = async () => {
        const billController = new BillController();
        const billRes: Bill[] = await billController.getAll(query);
        console.log(billRes);

        if (query.page === 0) {
            setBills(billRes);
        } else {
            setBills([...bills, ...billRes]);
        }

        setEnablePaginate(billRes.length === query.limit);
    };

    const paginate = () => {
        if (enablePaginate) {
            setQuery({ ...query, page: query.page + 1 });
            setEnablePaginate(false);
        }
    };

    const handleAddBill = async (data: Bill): Promise<boolean> => {
        try {
            const bC = new BillController();
            const res: Bill = await bC.create(data);
            setBills([...bills, res]);
            hideModal();
            return true;
        } catch (err: any) {
            console.log(err);
            setSnackbarMessage(err.message);
            setSnackbarVisible(true);
            return false;
        }
    };

    const handleEditBill = async (data: Bill, id: string): Promise<boolean> => {
        try {
            const bC = new BillController();
            const res: Bill = await bC.update<Bill>(id, data);
            const index = bills.findIndex(bill => (bill.bill_id + "") === id);
            bills[index] = res;
            setBills([...bills]);
            setFocusedBill(undefined);
            hideModal();
            return true;
        } catch (err: any) {
            console.log(err);
            setSnackbarMessage(err.message);
            setSnackbarVisible(true);
            return false;
        }
    };

    const handleFormSubmit = async (formData: BillFormResult, id?: string): Promise<boolean> => {
        const bill = { ...formData, rfo_id: rfoId + "" } as unknown as Bill; // Adjust this based on how your form data is structured

        if (focusedBill) {
            return await handleEditBill(bill, focusedBill.bill_id + "");
        } else {
            return await handleAddBill(bill);
        }
    };

    const handleDelete = async (id: string): Promise<boolean> => {
        try {
            const bC = new BillController();
            await bC.delete(id);
            setBills([...bills.filter(b => (b.bill_id + "") !== id)]);
            setSnackbarMessage('Bill deleted successfully');
            setSnackbarVisible(true);
            return true;
        } catch (err: any) {
            console.log(err);
            setSnackbarMessage(err.message);
            setSnackbarVisible(true);
            return false;
        }
    };

    console.log("FOCUSED BILL", focusedBill);
    return (
        <StyledSection>
            <StyledHeader>
                <StyledInput
                    label={'Search By Ticket Number'}
                    onChangeText={(text) => setSearch(text)}
                />
            </StyledHeader>
            <TicketSection
                title={'Bills'}
                more={enablePaginate}
                data={bills}
                render={({ item }: { item: Bill }) => {
                    if (item.ticket_number?.toString().includes(search)) {
                        return (
                            <TicketItem
                                aviColor={theme.colors.tertiary}
                                title={item.ticket_number.toString()}
                                subtitle={`RFO: ${item.rfo_id}`}
                                avatar={'$'} // Placeholder avatar
                                onButtonClick={() => {
                                    setFocusedBill(item);
                                    setVisible(true);
                                }}
                                onClick={() => navigateToTicket(item)}
                                buttonClickIcon={"pencil"}
                                onDelete={async (): Promise<boolean> => await handleDelete(item.bill_id + "")}
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
                    setFocusedBill(undefined)
                }}
                title={'Add Bill'}
            >
                <BillForm
                    onSubmit={handleFormSubmit}
                    defaultValues={focusedBill}
                />
            </MyModal>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
            >
                {snackbarMessage}
            </Snackbar>
            <FAB
                style={{
                    position: 'absolute',
                    margin: 16,
                    right: 0,
                    bottom: 0,
                }}
                icon="plus"
                onPress={() => {
                    setFocusedBill(undefined);
                    showModal();
                }}
            />
        </StyledSection>

    );
};

export default BillSection;
