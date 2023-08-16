import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Typography, Box, useTheme } from '@mui/material'
import { Container } from '../../components/shared'
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useParams, useNavigation } from 'react-router-dom';
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
import { colors } from '../..';
const View = styled(Container)`
    height: 100vh;
    width: 100vw;
`

const TicketInfoContainer = styled.div`
    max-width: 90%; 
    width: 500px; 
    display: flex;
    justify-content: center;
    align-items: center; 
    flex-direction: column;
    padding: 20px; 
    box-sizing: border-box;
    gap: 10px;
`

const TicketContainer = styled(Box)`
    width: 100%; 
    height: auto;
    padding: 10px; 
    border: 2px solid grey;
    border-radius: 5px;
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


type Props = {}

const TicketPage = (props: Props) => {
    const theme = useTheme();
    const [validated, setValidated] = useState(false); // flag that indicates whether an email has been sent to operator
    const [accessToken, setAccessToken] = useState<string>();
    const [loaded, setLoaded] = useState<boolean>(false);

    const [disp, setDispatch] = useState<Dispatch>();
    const [rfo, setRFO] = useState<RFO>();
    const [customer, setCustomer] = useState<Customer>();
    const [bills, setBills] = useState<Bill>();
    const [operator, setOperator] = useState<string>();
    const [company, setCompany] = useState<Company>();

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
            setAccessToken((await res.json()).access_token)
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
        if (!token) {
            // Redirect to welcom page and display error
        }
        sendAuthEmail();
    }, [])


    useEffect(() => {
        if (!accessToken) return;
        getTickets();

    }, [accessToken])

    console.log('VALIDATE', validated, accessToken);

    return <View>
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
                        <Typography variant='body2'>Dispatcher: {company?.company_name}</Typography>
                        <Typography variant='body2'>Notes: {disp?.notes}</Typography>
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