import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
    Typography,
    Box,
    useTheme,
    Button,
    Modal,
    Snackbar
} from '@mui/material'
import { Container } from '../../components/shared'
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useParams } from 'react-router-dom';
import { Bill } from '../../models/Bill';
import { Dispatch } from '../../models/Dispatch';
import { Customer } from '../../models/Customer';
import { RFO } from '../../models/RFO';
import { Company } from '../../models/Company';
import MessageView from '../../components/MessageView/MessageView';
import IconButton from '@mui/material/IconButton';
import moment from 'moment';
import BookIcon from '@mui/icons-material/Book';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EditIcon from '@mui/icons-material/Edit';
import TicketItem from '../../components/Tickets/TicketItem';
import BillSVG from '../../components/SVGS/BillSVG';
import BillForm, { BillFormResult } from '../../components/Forms/BillForm';
import { FormView } from '../../components/Forms/styles';

const View = styled(Container)`
    height: 100vh;
    width: 100vw;
    align-items: flex-start;
`

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
    border: 2px solid grey;
    border-radius: 5px;
    box-sizing: border-box;
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
    height: 100%;
    width: 100%;
    align-items: center; 
    justify-content: flex-start; 
    flex-direction: column; 
    gap: 10px;
`

type Props = {}

const TicketPage = (props: Props) => {
    const theme = useTheme();
    const [validated, setValidated] = useState(false); // flag that indicates whether an email has been sent to operator
    const [accessToken, setAccessToken] = useState<string>();
    const [loaded, setLoaded] = useState<boolean>(false);

    const [disp, setDispatch] = useState<Dispatch>();
    const [rfo, setRFO] = useState<RFO>();
    const [customer, setCustomer] = useState<Customer>();
    const [bills, setBills] = useState<Bill[]>([]);
    const [operator, setOperator] = useState<string>();
    const [company, setCompany] = useState<Company>();
    const [showForm, setShowForm] = useState<boolean>(false)
    const [focusedBill, setFocusedBill] = useState<Bill>();
    const [snackbar, setShowSnackBar] = useState<boolean>(false);
    const [color, setSnackbarColor] = useState<string>('');
    const [message, setSnackbarMessage] = useState<string>('');

    const { token } = useParams();

    const sendAuthEmail = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/v1/company/operators/validate_token/${token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            if (res.status !== 200) throw Error("Response from api not okay")
            setValidated(res.status === 200);


            setTimeout(async () => {
                setAccessToken((await res.json()).access_token)
            }, 1000)
        } catch (err: any) {
            console.log(err);
        }
    }

    const getTickets = async () => {
        try {
            const res = await fetch('http://127.0.0.1:5000/v1/company/operators/ticket', {
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
        sendAuthEmail();
    }, [])


    useEffect(() => {
        if (!accessToken) return;
        getTickets();

    }, [accessToken])

    const showSnackBar = (color: string, message: string) => {
        setSnackbarColor(color);
        setSnackbarMessage(message)
        setShowSnackBar(true)
    };
    const hideSnackBar = () => setShowSnackBar(false)

    const handleCreate = async (data: BillFormResult): Promise<any> => {
        console.log(data)
        try {
            const formData = new FormData();

            formData.append('file', data.file);
            formData.append('ticket_number', data.ticket_number);

            const res = await fetch('http://127.0.0.1:5000/v1/billing_ticket/operator', {
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

            const res = await fetch(`http://127.0.0.1:5000/v1/billing_ticket/operator/${id}`, {
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
            const res = await fetch(`http://127.0.0.1:5000/v1/billing_ticket/operator/${id}`, {
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
    console.log(focusedBill);

    return <View style={{ alignItems: 'center' }}>
        {loaded ?
            <TicketInfoContainer>
                <TicketContainer>
                    <TicketContainerHeader>
                        <IconButton>
                            <BookIcon style={{ fontSize: '25pt', color: theme.palette.secondary.main }} />
                        </IconButton>
                        <div>
                            <Typography variant='h5' style={{ fontWeight: 'bold' }}>{customer?.customer_name}</Typography>
                            <Typography variant='subtitle2'>{moment(disp?.date).format("YYYY-MM-DD")}</Typography>
                        </div>
                    </TicketContainerHeader>
                    <TextSection>
                        <SeperatedText>
                            <Typography variant='body2'>Dispatcher:</Typography>
                            <Typography variant='body2'>{company?.company_name}</Typography>

                        </SeperatedText>
                        <Typography variant='body2'>{disp?.notes}</Typography>
                    </TextSection>
                </TicketContainer>
                <TicketContainer>
                    <TicketContainerHeader>
                        <IconButton>
                            <LocalShippingIcon style={{ fontSize: '25pt', color: theme.palette.secondary.main }} />
                        </IconButton>
                        <div>
                            <Typography variant='h5' style={{ fontWeight: 'bold' }}>{operator}</Typography>
                            <Typography variant='subtitle2'>Equipment: {rfo?.truck} {rfo?.trailer}</Typography>
                        </div>
                    </TicketContainerHeader>
                    <TextSection>
                        <SeperatedText>
                            <Typography variant='body2'>Start Location:</Typography>
                            <Typography variant='body2'>{rfo?.start_location}</Typography>
                        </SeperatedText>
                        <SeperatedText>
                            <Typography variant='body2'>Load Location:</Typography>
                            <Typography variant='body2'>{rfo?.load_location}</Typography>
                        </SeperatedText>
                        <SeperatedText>
                            <Typography variant='body2'>Dump Location:</Typography>
                            <Typography variant='body2'>{rfo?.dump_location}</Typography>
                        </SeperatedText>
                        <SeperatedText>
                            <Typography variant='body2'>Start Time:</Typography>
                            <Typography variant='body2'> {moment(rfo?.start_time).format("YYYY-MM-DD h:mm a")}</Typography>
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
                            <Typography style={{ fontWeight: 'bold' }} variant='subtitle2'>Billing Tickets</Typography>
                            <Typography variant='subtitle2'>Recent</Typography>
                        </SeperatedText>
                        {
                            bills?.map((b, index) => <TicketItem
                                key={index}
                                onButtonClick={() => {
                                    setFocusedBill(b)
                                    setShowForm(true)
                                }}
                                buttonClickIcon={<EditIcon style={{ fontSize: '20pt', color: theme.palette.secondary.main, padding: '5px' }} />}
                                title={`${b.ticket_number}`}
                                subtitle={`RFO ID: ${b.rfo_id}`}
                                icon={<ReceiptIcon style={{ fontSize: '27pt', color: 'white', padding: '5px' }} />}
                                onDelete={async () => await handleDelete(b.bill_id + '')}
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
                <Snackbar
                    open={snackbar}
                    autoHideDuration={3000}
                    onClose={hideSnackBar}
                    message={message}
                    color={color}
                />
            </TicketInfoContainer>
            :
            <MessageView
                title={validated ? "Thanks for your patients!" : "Validating....."}
                subtitle={validated ? "Thank you for your patients! Here is your ticket" : "Just give us a second, we are validating your token."}
                icon={validated ? <LockOpenIcon style={{ fontSize: '25pt' }} /> : <LockIcon style={{ fontSize: '25pt' }} />}
                message={validated ? "All done thanks for waiting" : "Sorry for taking too long...."}
            />

        }
    </View>
}

export default TicketPage