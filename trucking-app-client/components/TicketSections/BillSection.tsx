import React, { FC, useState, useEffect } from 'react';
import { FAB, Modal, Portal, Text, TextInput, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';
import { Bill, BillQuery } from '../../models/Bill';
import { BillController } from '../../controllers/BillController';
import TicketItem from '../Tickets/TicketItem';
import TicketSection from '../Tickets/TicketSection';
import { StyledHeader, StyledSection } from './styles';
import MyModal from '../Modal/MyModal';
import BillForm from '../Forms/BillForm';
import { BillFormResult } from '../Forms/BillForm';
import BillCard from '../Cards/BillCard';
import BillSVG from '../../assets/svgs/BillSVG';
import useSnackbar from '../../hooks/useSnackbar';

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
        bQ.limit = 500;
        bQ.rfo_id = rfoId + "";
        return bQ;
    });
    const [enablePaginate, setEnablePaginate] = useState<boolean>(false);

    const [visible, setVisible] = useState(false);
    const [focusedBill, setFocusedBill] = useState<Bill>();
    const [search, setSearch] = useState<string>("");
    const theme = useTheme();
    const [showBill, setShowBill] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        getBills();
    }, [query]);

    const getBills = async () => {
        const billController = new BillController();
        if (query.page === 0) setLoading(true);
        const billRes: Bill[] = await billController.getAll(query);

        if (query.page === 0) {
            setBills(billRes);
        } else {
            setBills([...bills, ...billRes]);
        }
        setLoading(false)
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
            showSnackbar({
                message: 'Bill created successfully',
                color: theme.colors.primary,
                onClickText: 'Ok'
            })
            return true;
        } catch (err: any) {
            showSnackbar({
                message: err.message,
                color: theme.colors.error,
                onClickText: 'Ok'
            })
            return false;
        }
    };

    const handleEditBill = async (data: Bill, id: string): Promise<boolean> => {
        try {
            const bC = new BillController();
            const res: Bill = await bC.update(id, data);
            const index = bills.findIndex(bill => (bill.bill_id + "") === id);
            bills[index] = res;
            setBills([...bills]);
            setFocusedBill(undefined);
            hideModal();
            showSnackbar({
                message: 'Bill successfully edited',
                color: theme.colors.primary,
                onClickText: 'Ok'
            })
            return true;
        } catch (err: any) {
            showSnackbar({
                message: err.message,
                color: theme.colors.error,
                onClickText: 'Ok'
            })
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
            showSnackbar({
                message: 'Bill successfully deleted',
                color: theme.colors.primary,
                onClickText: 'Ok'
            })
            return true;
        } catch (err: any) {
            showSnackbar({
                message: err.message,
                color: theme.colors.error,
                onClickText: 'Ok'
            })
            return false;
        }
    };

    const toggleBilled = async (bill: Bill): Promise<void> => {
        try {
            await BillController.toggleBilled(bill)
        } catch (err: any) {
            showSnackbar({
                message: err.message,
                color: theme.colors.error,
                onClickText: 'Ok'
            })
        }
    }


    const handleShowBill = (bill: Bill) => {
        setFocusedBill(bill)
        setShowBill(true);
    }

    const handleRefresh = async () => {
        const bQ = new BillQuery();
        bQ.limit = 500;
        bQ.rfo_id = rfoId + "";
        setQuery(bQ);
    }

    return (
        <StyledSection>
            <StyledHeader style={{
                paddingTop: 5
            }}>
                <StyledInput
                    label={'Search By Ticket Number'}
                    onChangeText={(text) => setSearch(text)}
                />
            </StyledHeader>
            <TicketSection
                title={'Bills'}
                more={enablePaginate}
                data={bills}
                loading={loading}
                onRefresh={handleRefresh}
                onNoTicketsFound={() => {
                    setFocusedBill(undefined);
                    showModal();
                }}
                noTicketFoundSVG={<BillSVG width={75} height={75} stroke={'black'} />}
                noTicketFoundMessage={"No Billing Tickets Found!"}
                render={({ item }: { item: Bill }) => {
                    if (item.ticket_number?.toString().includes(search)) {
                        return (
                            <TicketItem
                                aviColor={theme.colors.tertiary}
                                title={item.ticket_number.toString()}
                                subtitle={<Text style={{ color: item.billed ? '' : theme.colors.error }}>
                                    {
                                        item.billed ? 'Billed' : 'Not Billed'
                                    }
                                </Text>
                                }
                                avatar={'$'} // Placeholder avatar
                                onButtonClick={() => {
                                    setFocusedBill(item);
                                    setVisible(true);
                                }}
                                onLongpress={() => toggleBilled(item)}
                                onClick={() => handleShowBill(item)}
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
                title={focusedBill ? "Edit Bill" : "Add Bill"}
            >
                <BillForm
                    onSubmit={handleFormSubmit}
                    defaultValues={focusedBill}
                />
            </MyModal>
            <Portal>
                <Modal

                    visible={showBill}
                    onDismiss={() => { }}
                    contentContainerStyle={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'black',
                        height: '100%'
                    }}
                >
                    <BillCard
                        onClose={() => {
                            setFocusedBill(undefined);
                            setShowBill(false)
                        }}
                        getId={() => focusedBill?.bill_id ?? 0}
                        {...focusedBill}
                    />
                </Modal>
            </Portal>
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
