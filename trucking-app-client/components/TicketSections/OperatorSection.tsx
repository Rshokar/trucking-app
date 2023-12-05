import React, { FC, useState, useEffect } from 'react';
import { TextInput, useTheme, FAB, Modal, Portal, Text } from 'react-native-paper';
import styled from 'styled-components/native';
import { Operator, OperatorQuery } from '../../models/Operator';
import { OperatorController } from '../../controllers/OperatorController';
import TicketItem from '../Tickets/TicketItem';
import { StyledHeader, StyledSection } from './styles';
import TicketSection from '../Tickets/TicketSection';
import OperatorForm from '../Forms/OperatorForm';
import { OperatorFormResult } from '../Forms/types';
import MyModal from '../Modal/MyModal';
import RFOSection from './RfoSection';
import { RFO } from '../../models/RFO';
import { View } from 'react-native';
import useSnackbar from '../../hooks/useSnackbar';
import ConstructionWorker from '../../assets/svgs/ConstructionWorket';
import OperatorCard from '../Cards/OperatorCard';
import { it } from 'react-native-paper-dates';

const StyledInput = styled(TextInput)`
    width: 90%;
`;

type Props = {
    navigateToTicket: (operatorId: number) => void;
    navigate: any
};

const OperatorSection: FC<Props> = ({ navigate }) => {
    const [operators, setOperators] = useState<Operator[]>([]);
    const [query, setQuery] = useState<OperatorQuery>(new OperatorQuery());
    const [enablePaginate, setEnablePaginate] = useState<boolean>(false);
    const [visible, setVisible] = useState(false);
    const [focusedOperator, setFocusedOperator] = useState<Operator>();
    const [showRfos, setShowRfos] = useState<boolean>(false)
    const theme = useTheme();
    const [loading, setLoading] = useState<boolean>(false);
    const [showCard, setShowCard] = useState<boolean>(false)
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        getOperators();
    }, [query]);

    const getOperators = async () => {
        const operatorController = new OperatorController();
        const opRes: Operator[] = await operatorController.getAll(query);
        if (query.page === 0) setLoading(true);

        if (query.page === 0) {
            setOperators(opRes);
        } else {
            setOperators([...operators, ...opRes]);
        }
        setLoading(false)
        setEnablePaginate(opRes.length === query.limit);
    };

    const paginate = () => {
        if (enablePaginate) {
            query.page = query.page + 1;
            setQuery({ ...query });
            setEnablePaginate(false);
        }
    };

    const handleFormSubmit = async (formData: OperatorFormResult, id?: string): Promise<boolean> => {
        try {
            const operatorController = new OperatorController();
            let res: Operator;
            if (focusedOperator) { // If we have focused on an operator we are going to edit it
                res = await operatorController.update(focusedOperator.operator_id + "", formData as Operator);
                const index = operators.findIndex(op => op.operator_id === focusedOperator.operator_id);
                operators[index] = res;
                showSnackbar({
                    message: 'Operator successfuly edited',
                    color: theme.colors.primary,
                    onClickText: 'Ok'
                })
            } else {
                res = await operatorController.create(formData as Operator);
                operators.push(res);
                showSnackbar({
                    message: 'Operator successfuly added',
                    color: theme.colors.primary,
                    onClickText: 'Ok'
                })
            }
            setOperators([...operators]);
            setFocusedOperator(undefined);
            hideModal();
            return true;
        } catch (err: any) {
            showSnackbar({
                message: err.message,
                color: theme.colors.error,
                onClickText: 'Ok'
            })
            return true;
        }
    };

    const handleDelete = async (operatorId: number): Promise<boolean> => {
        try {
            const operatorController = new OperatorController();
            await operatorController.delete(operatorId + "");
            setOperators(operators.filter(op => op.operator_id !== operatorId));
            showSnackbar({
                message: 'Operator successfuly deleted.',
                color: theme.colors.primary,
                onClickText: 'Ok'
            })
            return true
        } catch (err: any) {
            showSnackbar({
                message: err.message,
                color: theme.colors.error,
                onClickText: 'Ok'
            })
            return true
        }
    };

    const handleRefresh = async () => {
        const q = new OperatorQuery();
        setQuery(q);
    }

    const showOperatorsRfos = (oper: Operator) => {
        setFocusedOperator(oper);
        setShowRfos(true);
    }

    const showOperatorCard = (oper: Operator) => {
        setFocusedOperator(oper)
        setShowCard(true)
    }

    const resendVerificationEmail = async (oper: Operator) => {
        const oC = new OperatorController();
        try {
            await oC.sendVerificationEmail(oper.operator_id + "");
            showSnackbar({
                color: theme.colors.primary,
                message: 'Sent verification email',
                onClickText: 'Ok',
            })
        } catch (err: any) {
            console.log(err.message)
            showSnackbar({
                color: theme.colors.error,
                message: err.message,
                onClickText: 'Ok',
            })
        }

    }

    return (
        <StyledSection>
            <StyledHeader>
                <StyledInput
                    label={"Operators"}
                    value={query.operator_name}
                    onChangeText={(text) => {
                        setQuery({ ...query, operator_name: text });
                    }}
                />
            </StyledHeader>
            <TicketSection

                loading={loading}
                title={'Operators'}
                more={enablePaginate}
                data={operators}
                onRefresh={handleRefresh}
                noTicketFoundSVG={<ConstructionWorker width={125} height={125} stroke={'black'} />}
                render={({ item }: { item: Operator; }) => {
                    if (item.operator_name?.match(query.operator_name || '')) {
                        return (
                            <TicketItem
                                aviColor={theme.colors.secondary}
                                title={item.operator_name || ''}
                                subtitle={<Text style={{ color: item.confirmed ? '' : theme.colors.error }}>
                                    {
                                        item.contact_method == 'email' ? item.operator_email : item.operator_phone
                                    }
                                </Text>}
                                avatar={item.operator_name?.charAt(0).toLocaleUpperCase() || 'A'}
                                onClick={() => item.confirmed ? showOperatorsRfos(item) : showOperatorCard(item)}
                                onLongpress={() => item.confirmed ? showOperatorsRfos(item) : showOperatorCard(item)}
                                onButtonClick={() => {
                                    setFocusedOperator(item);
                                    setVisible(true);
                                }}
                                buttonClickIcon={"pencil"}
                                onDelete={() => handleDelete(item.operator_id ?? 0)} />
                        );
                    }
                }}
                paginate={paginate}
                onNoTicketsFound={function () {
                    setFocusedOperator(undefined);
                    showModal()
                }}
                noTicketFoundMessage={'No Operators Found!'} />
            <MyModal
                visible={visible}
                onDismiss={hideModal}
                title={`${focusedOperator ? 'Edit' : 'Add'} Operator`}
            >
                <OperatorForm
                    onSubmit={handleFormSubmit}
                    defaultValues={focusedOperator as OperatorFormResult} />
            </MyModal>
            <Portal>
                <Modal
                    visible={showRfos}
                    onDismiss={() => {
                        setShowRfos(false);
                        setFocusedOperator(undefined);
                    }}
                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
                >
                    <View style={{ backgroundColor: 'white', height: '95%', width: '95%', paddingVertical: 20, borderRadius: 10 }}>

                        <RFOSection
                            navigateToTicket={function (rfo: RFO): void {
                                setShowRfos(false)
                                navigate("Tickets", { dispId: rfo.dispatch_id, rfoId: rfo.rfo_id })
                            }}
                            operators={operators}
                            operId={focusedOperator?.operator_id}
                        />
                    </View>
                </Modal>
            </Portal>
            <Portal>
                <Modal
                    visible={showCard}
                    onDismiss={() => {
                        setShowCard(false);
                        setFocusedOperator(undefined);
                    }}
                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                    <OperatorCard sendVerifcationEmail={resendVerificationEmail} {...focusedOperator} />
                </Modal>
            </Portal>
            {
                !visible &&
                <FAB icon="plus"
                    onPress={() => {
                        setFocusedOperator(undefined);
                        showModal()
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

export default OperatorSection
