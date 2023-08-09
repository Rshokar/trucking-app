import React, { FC, useState, useEffect } from 'react';
import { TextInput, useTheme, FAB, Modal, Snackbar } from 'react-native-paper';
import styled from 'styled-components/native';
import { Operator, OperatorQuery } from '../../models/Operator';
import { OperatorController } from '../../controllers/OperatorController';
import TicketItem from '../Tickets/TicketItem';
import { StyledHeader, StyledSection } from './styles';
import TicketSection from '../Tickets/TicketSection';
import OperatorForm from '../Forms/OperatorForm';
import { OperatorFormResult } from '../Forms/types';
import MyModal from '../Modal/MyModal';

const StyledInput = styled(TextInput)`
    width: 90%;
`;

type Props = {
    navigateToTicket: (operatorId: number) => void;
};

const OperatorSection: FC<Props> = ({ navigateToTicket }) => {
    const [operators, setOperators] = useState<Operator[]>([]);
    const [query, setQuery] = useState<OperatorQuery>(new OperatorQuery());
    const [enablePaginate, setEnablePaginate] = useState<boolean>(false);
    const [visible, setVisible] = useState(false);
    const [focusedOperator, setFocusedOperator] = useState<Operator>();
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const theme = useTheme();
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    useEffect(() => {
        getOperators();
    }, [query]);

    const getOperators = async () => {
        const operatorController = new OperatorController();
        const opRes: Operator[] = await operatorController.getAll(query);

        if (query.page === 0) {
            setOperators(opRes);
        } else {
            setOperators([...operators, ...opRes]);
        }

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
                res = await operatorController.update<Operator>(focusedOperator.operator_id + "", formData as Operator);
                const index = operators.findIndex(op => op.operator_id === focusedOperator.operator_id);
                operators[index] = res;
            } else {
                res = await operatorController.create<Operator>(formData as Operator);
                operators.push(res);
            }
            setOperators([...operators]);
            setFocusedOperator(undefined);
            hideModal();
            return true;
        } catch (err: any) {
            console.log(err);
            setSnackbarMessage(err.message);
            setSnackbarVisible(true);
            return true;
        }
    };

    const handleDelete = async (operatorId: number): Promise<boolean> => {
        try {
            const operatorController = new OperatorController();
            await operatorController.delete(operatorId + "");
            setOperators(operators.filter(op => op.operator_id !== operatorId));
            return true
        } catch (err: any) {
            console.log(err);
            setSnackbarMessage(err.message);
            setSnackbarVisible(true);
            return true
        }
    };

    console.log("HELLO WORLD", operators)

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
                title={'Operators'}
                more={enablePaginate}
                data={operators}
                render={({ item }: { item: Operator }) => {
                    if (item.operator_name?.match(query.operator_name || '')) {
                        return (
                            <TicketItem
                                aviColor={theme.colors.secondary}
                                title={item.operator_name || ''}
                                subtitle={item.confirmed ? item.operator_email : "Email not validated"}
                                avatar={item.operator_name?.charAt(0).toLocaleUpperCase() || 'A'}
                                onClick={() => navigateToTicket(item.operator_id ?? 0)}
                                onButtonClick={() => {
                                    setFocusedOperator(item)
                                    setVisible(true);
                                }}
                                buttonClickIcon={"pencil"}
                                onDelete={() => handleDelete(item.operator_id ?? 0)}
                            />
                        );
                    }
                }}
                paginate={paginate}
            />
            <MyModal
                visible={visible}
                onDismiss={hideModal}
                title={'Add/Edit Operator'}
            >
                <OperatorForm
                    onSubmit={handleFormSubmit}
                    defaultValues={focusedOperator as OperatorFormResult} />
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
