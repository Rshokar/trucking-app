import React, { useState, FC, useEffect } from 'react'
import styled from 'styled-components'
import {
    Typography,
    Box,
    useTheme,
    Button,
    Modal,
    Snackbar
} from '@mui/material'

import IconButton from '@mui/material/IconButton';
import moment from 'moment';
import BookIcon from '@mui/icons-material/Book';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EditIcon from '@mui/icons-material/Edit';
import TicketItem from '../../../components/Tickets/TicketItem';
import BillSVG from '../../../components/SVGS/BillSVG';
import BillForm, { BillFormResult } from '../../../components/Forms/BillForm';
import { FormView } from '../../../components/Forms/styles';
import { Bill } from '../../../models/Bill';
import { Company } from '../../../models/Company';
import { Customer } from '../../../models/Customer';
import { RFO } from '../../../models/RFO';
import { Dispatch } from '../../../models/Dispatch'
import BillCard from '../../../components/Cards/BillCard';

const TicketInfoContainer = styled.div`
    height: 100%;
    max-width: 90%; 
    width: 500px; 
    display: flex;
    justify-content: center;
    align-items: center; 
    flex-direction: column;
    padding-top: 10px; 
    box-sizing: border-box;
    gap: 10px;
`

const TicketContainer = styled(Box)`
    width: 100%; 
    height: auto;
    padding: 10px; 
    box-sizing: border-box;
    background-color: white;
`

const TicketContainerHeader = styled.div`
    display: flex; 
    flex-direction: row; 
    gap: 10px;
`


const TextSection = styled.div`
    padding-top: 10px; 
    display: flex;
    flex-direction: column;
`

const SeperatedText = styled.div`
    display: flex; 
    flex-direction: row; 
    justify-content: space-between; 
    align-items: center; 
`

const NoTicketsFound = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center; 
    justify-content: center; 
    flex-direction: column; 
    gap: 20px;
`

const TicketSection = styled.div`
    display: flex;
    width: 100%;
    align-items: center; 
    justify-content: flex-start; 
    flex-direction: column; 
    gap: 10px;
    background-color: white; 
    padding: 10px; 
    box-sizing: border-box;
`


type Props = {
    accessToken: string;
    showSnackBar: (color: string, message: string) => any
}

const Ticket: FC<Props> = ({ accessToken, showSnackBar }) => {
    const theme = useTheme();

    const [loaded, setLoaded] = useState<boolean>(false);

    const [disp, setDispatch] = useState<Dispatch>();
    const [rfo, setRFO] = useState<RFO>();
    const [customer, setCustomer] = useState<Customer>();
    const [bills, setBills] = useState<Bill[]>([]);
    const [operator, setOperator] = useState<string>();
    const [company, setCompany] = useState<Company>();
    const [showForm, setShowForm] = useState<boolean>(false)
    const [showBill, setShowBill] = useState<boolean>(false)
    const [focusedBill, setFocusedBill] = useState<Bill>();


    const getTickets = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/company/operators/ticket`, {
                method: 'GET',
                headers: {
                    "Authorization-Fake-X": `Bearer ${accessToken}`
                }
            })
            if (res.status !== 200) throw Error("Response from api not okay");
            const result = await res.json();

            setDispatch(result.dispatch)
            setRFO(result.rfo)
            setCustomer(result.customer)
            setBills(result.bills)
            setOperator(result.operator)
            setCompany(result.company)
            setLoaded(true)
        } catch (err: any) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (!accessToken) return;
        getTickets();

    }, [accessToken])


    const handleCreate = async (data: BillFormResult): Promise<any> => {
        console.log(data)
        try {
            const formData = new FormData();

            formData.append('file', data.file);
            formData.append('ticket_number', data.ticket_number);

            const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/billing_ticket/operator`, {
                method: 'POST',
                headers: {
                    "Authorization-Fake-X": `Bearer ${accessToken}`
                },
                body: formData
            });

            if (res.status !== 201) throw Error("Error creating bill")
            const bill: Bill = await res.json();

            setBills([...bills, bill])
            setShowForm(false)
            showSnackBar('success', "Bill Created")

        } catch (err: any) {
            showSnackBar('error', "Error creating bill")
            console.log(err);
        }
    }


    const hanldeEdit = async (data: BillFormResult, id: string): Promise<any> => {
        console.log(data, id)

        try {
            const formData = new FormData();

            formData.append("ticket_number", data.ticket_number)

            const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/billing_ticket/operator/${id}`, {
                method: 'PATCH',
                headers: {
                    "Authorization-Fake-X": `Bearer ${accessToken}`
                },
                body: formData
            })

            if (res.status !== 200) throw Error("Error editing bill")

            const index = bills.findIndex(b => b.bill_id?.toString() === id)
            bills[index].ticket_number = data.ticket_number;
            setBills([...bills]);
            setShowForm(false);
            setFocusedBill(undefined);
            showSnackBar('success', "Bill Updated")

        } catch (err: any) {
            showSnackBar('error', "Error editing bill")

            console.log(err);
        }
    }

    const handleFormSubmit = async (values: BillFormResult, id?: string | undefined): Promise<boolean> => {
        if (focusedBill) {
            return await hanldeEdit(values, focusedBill.bill_id + "")
        }
        return await handleCreate(values);
    }

    const handleDelete = async (id: string): Promise<void> => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/billing_ticket/operator/${id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization-Fake-X": `Bearer ${accessToken}`
                }
            })

            if (res.status !== 204) throw Error("API error");

            setBills([...bills.filter(b => ('' + b.bill_id) !== id)])
            showSnackBar('success', "Bill Deleted")

            return;
        } catch (err: any) {
            showSnackBar('error', "Error editing bill")

            console.log(err);
        }
    }



    return (
        <TicketInfoContainer>
            <TicketContainer>
                <TicketContainerHeader>
                    <IconButton>
                        <BookIcon style={{ fontSize: '25pt', color: theme.palette.primary.main }} />
                    </IconButton>
                    <div>
                        <Typography variant='h5' style={{ fontWeight: 'bold' }}>{customer?.customer_name}</Typography>
                        <Typography variant='subtitle2'>{moment(disp?.date).format("YYYY-MM-DD")}</Typography>
                    </div>
                </TicketContainerHeader>
                <TextSection>
                    <SeperatedText>
                        <Typography variant='body1'>Dispatcher:</Typography>
                        <Typography variant='body1'>{company?.company_name}</Typography>

                    </SeperatedText>
                    <Typography variant='body1'>{disp?.notes}</Typography>
                </TextSection>
            </TicketContainer>
            <TicketContainer>
                <TicketContainerHeader>
                    <IconButton>
                        <LocalShippingIcon style={{ fontSize: '25pt', color: theme.palette.primary.main }} />
                    </IconButton>
                    <div>
                        <Typography variant='h5' style={{ fontWeight: 'bold' }}>{operator}</Typography>
                        <Typography variant='subtitle2'>Equipment: {rfo?.truck} {rfo?.trailer}</Typography>
                    </div>
                </TicketContainerHeader>
                <TextSection>
                    <SeperatedText>
                        <Typography variant='body1'>Start Location:</Typography>
                        <Typography variant='body1'>{rfo?.start_location}</Typography>
                    </SeperatedText>
                    <SeperatedText>
                        <Typography variant='body1'>Load Location:</Typography>
                        <Typography variant='body1'>{rfo?.load_location}</Typography>
                    </SeperatedText>
                    <SeperatedText>
                        <Typography variant='body1'>Dump Location:</Typography>
                        <Typography variant='body1'>{rfo?.dump_location}</Typography>
                    </SeperatedText>
                    <SeperatedText>
                        <Typography variant='body1'>Start Time:</Typography>
                        <Typography variant='body1'> {moment(rfo?.start_time).format("YYYY-MM-DD h:mm a")}</Typography>
                    </SeperatedText>
                </TextSection>
            </TicketContainer>
            {bills?.length === 0 ?
                <NoTicketsFound>
                    <BillSVG width={200} height={200} />
                    <Typography>No Bills found. Create One! </Typography>
                    <Button
                        style={{
                            background: theme.palette.primary.main,
                            color: 'white',
                            width: '300px'
                        }}
                        onClick={(e) => {
                            setFocusedBill(undefined);
                            setShowForm(true);
                        }}
                    >Add Bill</Button>
                </NoTicketsFound>
                :
                <TicketSection>
                    <SeperatedText style={{ width: '100%', paddingRight: '5px', paddingLeft: '5px', boxSizing: 'border-box' }}>
                        <Typography style={{ fontWeight: 'bold' }} variant='subtitle1'>Billing Tickets</Typography>
                        <Typography variant='subtitle1'>Recent</Typography>
                    </SeperatedText>
                    {
                        bills?.map((b, index) => <TicketItem
                            key={index}
                            onButtonClick={() => {
                                setFocusedBill(b)
                                setShowForm(true)
                            }}
                            buttonClickIcon={<EditIcon style={{ fontSize: '20pt', color: theme.palette.primary.main, padding: '5px' }} />}
                            title={`${b.ticket_number}`}
                            subtitle={`RFO ID: ${b.rfo_id}`}
                            icon={<ReceiptIcon style={{ fontSize: '27pt', color: 'white', padding: '5px' }} />}
                            onDelete={async () => await handleDelete(b.bill_id + '')}
                            onClick={() => {
                                setFocusedBill(b)
                                setShowBill(true)
                            }}
                        />)
                    }
                    <Button
                        style={{
                            background: theme.palette.secondary.main,
                            color: 'white',
                            width: '300px'
                        }}
                        onClick={(e) => {
                            setFocusedBill(undefined);
                            setShowForm(true);
                        }}
                    >Add Bill</Button>
                </TicketSection>
            }
            <Modal
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
                open={showForm}
                onClose={() => {
                    setFocusedBill(undefined);
                    setShowForm(false);
                }}

            >
                <FormView>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {focusedBill ? 'Edit bill' : 'Add bill'}
                    </Typography>
                    <BillForm
                        defaultValues={focusedBill}
                        onSubmit={handleFormSubmit} />
                </FormView>
            </Modal>
            <Modal
                open={showBill}
                onClose={() => {
                    setFocusedBill(undefined)
                    setShowBill(false)
                }}
                style={{
                    backgroundColor: 'black'
                }}
            >
                <BillCard
                    accessToken={accessToken}
                    onClose={() => {
                        setFocusedBill(undefined)
                        setShowBill(false)
                    }}
                    {...focusedBill} />
            </Modal>
        </TicketInfoContainer>
    )
}

export default Ticket