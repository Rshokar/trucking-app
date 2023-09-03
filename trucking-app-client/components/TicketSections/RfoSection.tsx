import React, { FC, useState, useEffect } from 'react';
import { FAB, Modal, TextInput, useTheme, Snackbar, Portal } from 'react-native-paper';
import { RFO, RFOQuery } from '../../models/RFO';
import { RFOController } from '../../controllers/RfoController';
import TicketItem from '../Tickets/TicketItem';
import TicketSection from '../Tickets/TicketSection';
import { StyledSection } from './styles';
import MyModal from '../Modal/MyModal';
import RFOForm from '../Forms/RFOForm';
import { RFOFormResult } from '../Forms/RFOForm';
import { Operator } from '../../models/Operator';
import moment from 'moment';
import RFOCard from '../Cards/RFOCard';
import Contract from '../../assets/svgs/Contract';
import useSnackbar from '../../hooks/useSnackbar';
import Cache from '../../utils/Cache';

type Props = {
    navigateToTicket: (rfo: RFO) => void;
    operators: Operator[];
    dispId?: number;
    operId?: number
};

const RFOSection: FC<Props> = ({ navigateToTicket, dispId, operId, operators }) => {
    const [rfos, setRFOs] = useState<RFO[]>([]);
    const [query, setQuery] = useState<RFOQuery>(() => {
        const rQ = new RFOQuery();
        rQ.limit = 100;
        if (operId) rQ.operator_id = operId
        if (dispId) rQ.dispatch_id = dispId
        return rQ;
    });

    const [enablePaginate, setEnablePaginate] = useState<boolean>(false);
    const [visible, setVisible] = useState(false);
    const [focusedRFO, setFocusedRFO] = useState<RFO>();
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const [showRFOCard, setShowRFOCards] = useState<boolean>(false)
    const theme = useTheme();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        getRFOs();
    }, [query]);

    const getRFOs = async () => {
        const rfoController = new RFOController();
        if (query.page === 0) setLoading(true);
        const rfoRes: RFO[] = await rfoController.getAll(query);

        if (query.page === 0) {
            setRFOs(rfoRes);
        } else {
            setRFOs([...rfos, ...rfoRes]);
        }

        setLoading(false)
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
            const res: RFO = await rC.create(data as RFO);
            setRFOs([...rfos, res]);
            hideModal();
            showSnackbar({
                message: 'RFO successfuly added',
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

    const handleEditRFO = async (data: RFO, id: string): Promise<boolean> => {
        try {
            const rC = new RFOController();
            const q = new RFOQuery();
            q.rfo_id = parseFloat(id);
            const res: RFO = await rC.update(id, data as RFO);
            res.operator = Cache.getInstance(Operator).getData().find(o => o.operator_id === res.operator_id);
            const index = rfos.findIndex(rfo => (rfo.rfo_id + "") === id);
            rfos[index] = res;
            setRFOs([...rfos]);
            setFocusedRFO(undefined);
            showSnackbar({
                message: 'RFO successfuly edited',
                color: theme.colors.primary,
                onClickText: 'Ok'
            })
            hideModal();
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
            showSnackbar({
                message: 'RFO successfuly deleted.',
                color: theme.colors.primary,
                onClickText: 'Ok'
            })
            return true;
        } catch (err: any) {
            console.log(err);
            showSnackbar({
                message: err.message,
                color: theme.colors.error,
                onClickText: 'Ok'
            })
            return false;
        }
    };

    const handleSendRFOEmail = async (): Promise<boolean> => {
        if (!focusedRFO)
            showSnackbar({
                color: theme.colors.error,
                message: 'No focused RFO!'
            })
        try {
            const rC = new RFOController();
            await rC.sendRFOEmail(focusedRFO?.rfo_id + '');
            showSnackbar({
                message: 'Email sent',
                color: theme.colors.primary,
                onClickText: 'Ok',
            })
            return true
        } catch (err: any) {
            showSnackbar({
                message: err.message,
                color: theme.colors.error,
                onClickText: 'Ok'
            })
            return false;
        }


    }

    const handleRefresh = async () => {
        const rQ = new RFOQuery();
        rQ.limit = 100;
        rQ.dispatch_id = dispId;
        setQuery(rQ);
    }

    console.log('RFO SECTION', dispId, operId)

    return (
        <StyledSection>
            <TicketSection
                title={'RFOs'}
                more={enablePaginate}
                data={rfos}
                onRefresh={handleRefresh}
                loading={loading}
                onNoTicketsFound={dispId ? () => {
                    setFocusedRFO(undefined);
                    showModal();
                } : undefined}
                noTicketFoundMessage={"No RFOs (Request For Operator) Found!"}
                noTicketFoundSVG={<Contract width={125} height={125} stroke={'black'} fill={'black'} />}
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
                                onLongpress={() => {
                                    setFocusedRFO(item)
                                    setShowRFOCards(true)
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
                    setFocusedRFO(undefined)
                }}
                title={focusedRFO ? "Edit Rfo" : "Add Rfo"}
            >
                <RFOForm
                    onSubmit={handleFormSubmit}
                    defaultValues={(rfos.length > 0 && !focusedRFO) ? rfos[rfos.length - 1] : focusedRFO as RFOFormResult}
                    operators={operators} />
            </MyModal>
            <Portal>
                <Modal
                    visible={showRFOCard}
                    onDismiss={() => {
                        setShowRFOCards(false);
                        setFocusedRFO(undefined);
                    }}
                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                    <RFOCard
                        onClick={function () {
                            setFocusedRFO(undefined)
                            setShowRFOCards(false)
                        }}
                        onLongPress={function () {

                        }} {...focusedRFO}
                        sendRFOEmail={handleSendRFOEmail}
                    />
                </Modal>
            </Portal>

            {
                (dispId && !visible) &&
                <FAB
                    icon="plus"
                    onPress={() => {
                        setFocusedRFO(undefined);
                        showModal();
                    }}
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
