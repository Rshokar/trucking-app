import React, { FunctionComponent, useEffect, useState, useCallback } from 'react'
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import moment from 'moment';
import { Dispatch, DispatchQuery } from '../../../models/Dispatch'
import { DispatchController } from '../../../controllers/DispatchController'
import TicketSection from '../../../components/Tickets/TicketSection'
import TicketItem from '../../../components/Tickets/TicketItem'; // updated import
import { StyledSection, StyledHeader } from './styles';

type Props = {
    navigateToTickets: (dispId: string) => void;
}

const DispatchSection: FunctionComponent<Props> = ({ navigateToTickets }) => {
    const [dispatches, setDispatches] = useState<Dispatch[]>([]);
    const [query, setQuery] = useState<DispatchQuery>(new DispatchQuery());
    const [enablePaginate, setEnablePaginate] = useState<boolean>(false);
    const [showDateModal, setShowDateModal] = useState<boolean>(false);

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
            <TicketSection
                more={enablePaginate}
                data={dispatches}
                render={({ item }: any) => {
                    return <TicketItem
                        title={item.customer?.customer_name || ''}
                        subtitle={moment(item.date).format('YYYY-MM-DD h:mm a')}
                        avatar={item.rfo_count}
                        onClick={() => navigateToTickets(item.dispatch_id)}
                    />
                }}
                paginate={paginate}
            />
        </StyledSection>
    )
}

export default DispatchSection;
