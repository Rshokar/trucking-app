import React, { FC, useState, useEffect } from 'react';
import { FAB, Modal, Text, TextInput, useTheme, Snackbar } from 'react-native-paper';
import styled from 'styled-components/native';
import { RFO, RFOQuery } from '../../models/RFO';
import { RFOController } from '../../controllers/RfoController';
import TicketItem from '../Tickets/TicketItem';
import TicketSection from '../Tickets/TicketSection';
import { StyledHeader, StyledSection } from './styles';
import MyModal from '../Modal/MyModal';
import RFOForm from '../Forms/RFOForm';
import { RFOFormResult } from '../Forms/RFOForm';
import { Operator } from '../../models/Operator';
import moment from 'moment';

const StyledInput = styled(TextInput)`
    width: 90%;
`;

type Props = {
    navigateToTicket: (rfo: RFO) => void;
    operators: Operator[];
    dispId: number;
};

const RFOSection: FC<Props> = ({ navigateToTicket, dispId, operators, }) => {
    const [rfos, setRFOs] = useState<RFO[]>([]);
    const [query, setQuery] = useState<RFOQuery>(() => {
        const rQ = new RFOQuery();
        rQ.dispatch_id = dispId;
        return rQ;
    });
    const [enablePaginate, setEnablePaginate] = useState<boolean>(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const [focusedRFO, setFocusedRFO] = useState<RFO>();
    const [search, setSearch] = useState<string>("");
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const theme = useTheme();

    useEffect(() => {
        getRFOs();
    }, [query]);

    const getRFOs = async () => {
        const rfoController = new RFOController();
        const rfoRes: RFO[] = await rfoController.getAll(query);

        if (query.page === 0) {
            setRFOs(rfoRes);
        } else {
            setRFOs([...rfos, ...rfoRes]);
        }

        setEnablePaginate(rfoRes.length === query.limit);
    };

    const paginate = () => {
        if (enablePaginate) {
            setQuery({ ...query, page: query.page + 1 });
            setEnablePaginate(false);
        }
    };

    const handleAddRFO = async (data: RFO): Promise<boolean> => {
        try {
            const rC = new RFOController();
            const res: RFO = await rC.create<RFO>(data as RFO);
            setRFOs([...rfos, res]);
            hideModal();
            return true;
        } catch (err: any) {
            console.log(err);
            setSnackbarMessage(err.message);
            setSnackbarVisible(true);
            return false;
        }
    };

    const handleEditRFO = async (data: RFO, id: string): Promise<boolean> => {
        try {
            const rC = new RFOController();
            const q = new RFOQuery();
            q.rfo_id = parseFloat(id);
            const res: RFO = await rC.update<RFO>(id, data as RFO);
            res.operator = focusedRFO?.operator;
            const index = rfos.findIndex(rfo => (rfo.rfo_id + "") === id);
            rfos[index] = res;
            setRFOs([...rfos]);
            setFocusedRFO(undefined);
            hideModal();
            return true;
        } catch (err: any) {
            console.log(err);
            setSnackbarMessage(err.message);
            setSnackbarVisible(true);
            return false;
        }
    };

    const handleFormSubmit = async (formData: RFOFormResult, id?: string): Promise<boolean> => {
        const rfo: RFO = {};
        rfo.dump_location = formData.dump_location;
        rfo.load_location = formData.load_location;
        rfo.start_location = formData.start_location;
        rfo.trailer = formData.trailer;
        rfo.truck = formData.truck;
        rfo.dispatch_id = dispId;
        rfo.operator_id = formData.operator_id;
        rfo.start_time = moment(formData.start_date + " " + formData.start_time).format('YYYY-MM-DD HH:mm:ss'); // Add this to match validation on API


        if (focusedRFO) {
            return await handleEditRFO(rfo, focusedRFO.rfo_id + "");
        } else {
            return await handleAddRFO(rfo);
        }
    };

    const handleDelete = async (id: string): Promise<boolean> => {
        try {
            const rC = new RFOController();
            await rC.delete(id);
            setRFOs([...rfos.filter(r => (r.rfo_id + "") !== id)])
            setSnackbarMessage('RFO deleted successfully');
            setSnackbarVisible(true);
            return true;
        } catch (err: any) {
            console.log(err);
            setSnackbarMessage(err.message);
            setSnackbarVisible(true);
            return false;
        }
    };

    return (
        <StyledSection>
            <TicketSection
                title={'RFOs'}
                more={enablePaginate}
                data={rfos}
                render={({ item }: { item: RFO }) => {
                    if (item.operator?.operator_name?.match(search || '')) {
                        return (
                            <TicketItem
                                aviColor={theme.colors.tertiary}
                                title={item.operator?.operator_name || ''}
                                subtitle={moment(item.start_time).format("h:mm a") + ` ${item.truck} ${item.trailer}`}
                                avatar={item.operator?.operator_name?.charAt(0).toLocaleUpperCase() || 'A'}
                                onButtonClick={() => {
                                    setFocusedRFO(item);
                                    setVisible(true);
                                }}
                                onClick={() => navigateToTicket(item)}
                                buttonClickIcon={"pencil"}
                                onDelete={async (): Promise<boolean> => await handleDelete(item.rfo_id + "")}
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
                    setFocusedRFO(undefined)
                }}
                title={'Add RFO'}
            >
                <RFOForm
                    onSubmit={handleFormSubmit}
                    defaultValues={(!focusedRFO && rfos.length > 0 ? rfos[rfos.length - 1] : focusedRFO) as RFOFormResult}
                    operators={operators} />
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
                <FAB
                    icon="plus"
                    onPress={showModal}
                    style={{
                        position: 'absolute',
                        margin: 16,
                        right: 0,
                        bottom: 0,
                    }}
                />
            }
        </StyledSection>
    );
};

export default RFOSection;
