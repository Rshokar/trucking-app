import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Typography, Box, useTheme } from '@mui/material'
import { Container } from '../../components/shared'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
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

const ValidateOperatorEmailPage = (props: Props) => {
    const theme = useTheme();
    const [sent, setSent] = useState(false); // flag that indicates whether an email has been sent to operator
    const { token } = useParams();

    const sendAuthEmail = async () => {
        const res = await fetch(`http://127.0.0.1:5000/v1/company/operators/generate_token/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        setSent(res.status === 200);
    }

    useEffect(() => {
        if (!token) {
            // Redirect to welcom page and display error
        }

        sendAuthEmail();
    }, [])

    console.log('SENT', sent);

    return <View>
        <MessageView style={{ backgroundColor: theme.palette.secondary.main }}>
            <div style={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'column',
            }}>
                <Typography variant='h5' style={{ color: 'white' }}>
                    {sent ? "We just sent you an email!" : "Authenticating....."}
                </Typography>
                <Typography variant='body2' style={{ color: 'white' }}>
                    {sent ? "Thank you for your patients, we just sent you an email to your RFO" : "Just give us a second, we are sending you a validation email."}
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
                {sent ? <MarkEmailReadIcon style={{ fontSize: '25pt' }} /> : <LocalShippingIcon style={{ fontSize: '25pt' }} />}
            </Box>
            <Typography variant='caption' style={{ color: 'white' }}>
                {sent ? "All done thanks for waiting" : "Sorry for taking too long...."}
            </Typography>
        </MessageView>
    </View>
}

export default ValidateOperatorEmailPage