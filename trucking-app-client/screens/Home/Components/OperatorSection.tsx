import React, { FC, useState, useEffect } from 'react'
import { View } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';
import { Operator, OperatorQuery } from '../../../models/Operator'
import { OperatorController } from '../../../controllers/OperatorController'
import TicketItem from '../../../components/Tickets/TicketItem';
import { StyledHeader, StyledSection } from './styles';
import TicketSection from '../../../components/Tickets/TicketSection';

const StyledInput = styled(TextInput)`
    width: 90%;
`

type Props = {
    navigateToTicket: (operatorId: string) => void;
}

const OperatorSection: FC<Props> = ({ navigateToTicket }) => {

    const [operators, setOperators] = useState<Operator[]>([]);
    const [query, setQuery] = useState<OperatorQuery>(new OperatorQuery());
    const [enablePaginate, setEnablePaginate] = useState<boolean>(false);
    const theme = useTheme();

    useEffect(() => {
        getOperators();
    }, [])

    const getOperators = async () => {
        const operatorController = new OperatorController();
        const opRes: Operator[] = await operatorController.getAll(query);

        if (query.page === 0) {
            setOperators(opRes);
        } else {
            setOperators([...operators, ...opRes]);
        }

        setEnablePaginate(opRes.length === query.limit);
    }

    const paginate = () => {
        if (enablePaginate) {
            query.page = query.page + 1;
            setQuery({ ...query });
            setEnablePaginate(false);
        }
    };


    return (
        <StyledSection>
            <StyledHeader>
                <StyledInput label={"Operators"} value={query.operator_name} onChangeText={(text) => {
                    query.operator_name = text;
                    setQuery({ ...query });
                }} />
            </StyledHeader>
            <TicketSection
                title={'Operators'}
                more={enablePaginate}
                data={operators}
                render={({ item }: { item: Operator }) => {
                    if (item.operator_name?.match(query.operator_name || '')) {
                        return <TicketItem
                            aviColor={theme.colors.secondary}
                            title={item.operator_name || ''}
                            subtitle={item.operator_email || 'ontheroad@fast.com'}
                            avatar={item.operator_name?.charAt(0).toLocaleUpperCase() || 'A'}
                            onClick={() => { }}
                        />
                    }
                }}
                paginate={paginate}
            />
        </StyledSection>
    )
}

export default OperatorSection
