import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Typography, Box, useTheme } from '@mui/material'
import { Container } from '../../components/shared'
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useParams } from 'react-router-dom';

const View = styled(Container)`
    height: 100vh;
    width: 100vw;
`

const MessageView = styled(Box)`
    display: flex; 
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center; 
    max-width: 90%; 
    height: 350px; 
    width: 400px;  
    border-radius: 10px;
    box-sizing: border-box;
    padding: 30px;   
    box-shadow: 2px 2px 2px 2px grey;
`

type Props = {}

const TicketPage = (props: Props) => {
    const theme = useTheme();
    const [validated, setValidated] = useState(false); // flag that indicates whether an email has been sent to operator
    const [accessToken, setAccessToken] = useState<string>();
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

    useEffect(() => {
        if (!token) {
            // Redirect to welcom page and display error
        }

        sendAuthEmail();
    }, [])

    console.log('VALIDATE', validated, accessToken);

    return <View>
        <MessageView style={{ backgroundColor: theme.palette.secondary.main }}>
            <div style={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'column',
            }}>
                <Typography variant='h5' style={{ color: 'white' }}>
                    {validated ? "Thanks for your patients!" : "Validating....."}
                </Typography>
                <Typography variant='body2' style={{ color: 'white' }}>
                    {validated ? "Thank you for your patients! Here is your ticket" : "Just give us a second, we are validating your token."}
                </Typography>
            </div>
            <Box sx={{
                display: 'flex',
                backgroundColor: 'white',
                width: '60px',
                height: '60px',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px'
            }}>
                {validated ? <LockOpenIcon style={{ fontSize: '25pt' }} /> : <LockIcon style={{ fontSize: '25pt' }} />}
            </Box>
            <Typography variant='caption' style={{ color: 'white' }}>
                {validated ? "All done thanks for waiting" : "Sorry for taking too long...."}
            </Typography>
        </MessageView>
    </View>
}

export default TicketPage