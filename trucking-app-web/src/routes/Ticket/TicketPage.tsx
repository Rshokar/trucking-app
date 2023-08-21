import { useState } from 'react'
import styled from 'styled-components'
import { Container } from '../../components/shared'
import Ticket from './Components/Ticket';
import OperatorAuth from './Components/OperatorAuth';
import { Snackbar, SnackbarContent } from '@mui/material';


const View = styled(Container)`
    height: 100vh;
    width: 100vw;
    align-items: flex-start;
`



const TicketPage = () => {
    const [accessToken, setAccessToken] = useState<string>();

    const [snackbar, setShowSnackBar] = useState<boolean>(false);
    const [color, setSnackbarColor] = useState<string>('');
    const [message, setSnackbarMessage] = useState<string>('');


    const hideSnackBar = () => setShowSnackBar(false)

    const showSnackBar = (color: string, message: string) => {
        setSnackbarColor(color);
        setSnackbarMessage(message)
        setShowSnackBar(true)
    };

    return <View style={{ alignItems: 'center' }}>
        {accessToken ?
            <Ticket accessToken={accessToken} showSnackBar={showSnackBar} />
            :
            <OperatorAuth setAccessToken={setAccessToken} showSnackBar={showSnackBar} />

        }
        <Snackbar
            open={snackbar}
            autoHideDuration={3000}
            onClose={hideSnackBar}
        >
            <SnackbarContent
                sx={{
                    backgroundColor: color
                }}
                message={message}
            />

        </Snackbar>
    </View>
}

export default TicketPage