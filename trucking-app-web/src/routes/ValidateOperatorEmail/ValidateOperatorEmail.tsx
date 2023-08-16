import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Typography, Box, useTheme } from '@mui/material'
import { Container } from '../../components/shared'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
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
    const [validated, setValidated] = useState(false);
    const { token } = useParams();

    const validateEmail = async () => {
        const res = await fetch('http://127.0.0.1:5000/v1/company/operators/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: token + '' })
        })
        setValidated(res.status === 200);
    }

    useEffect(() => {
        if (!token) {
            // Redirect to welcom page and display error
        }

        validateEmail();
    }, [])

    console.log('VALIDATED', validated);

    return <View>
        <MessageView style={{ backgroundColor: theme.palette.secondary.main }}>
            <div style={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'column',
            }}>
                <Typography variant='h5' style={{ color: 'white' }}>
                    {validated ? "Email Validated" : "Validating your email"}
                </Typography>
                <Typography variant='body2' style={{ color: 'white' }}>
                    {validated ? "Thank you for your patients, your email has been validated and your dispatcher will be in contact soon" : " Thanks for clicking the link. We are currently validating your email."}
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
                {validated ? <MarkEmailReadIcon style={{ fontSize: '25pt' }} /> : <LocalPostOfficeIcon style={{ fontSize: '25pt' }} />}
            </Box>
            <Typography variant='caption' style={{ color: 'white' }}>
                {validated ? "All done thanks for waiting" : "Sorry for taking too long...."}
            </Typography>
        </MessageView>
    </View>
}

export default ValidateOperatorEmailPage