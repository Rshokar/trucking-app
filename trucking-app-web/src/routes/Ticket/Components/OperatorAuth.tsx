import React, { useEffect, FC, useState } from 'react'
import MessageView from '../../../components/MessageView/MessageView'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useParams } from 'react-router-dom';
import RFOCodeForm from '../../../components/Forms/RFOCodeForm';
import { Button, Typography, useTheme } from '@mui/material';
import styled from 'styled-components';
import { FormView } from '../../../components/Forms/styles';
import DumpTruckSvg from '../../../components/SVGS/DumpTruckSvg';


type Props = {
    setAccessToken: (token: string) => any;
    showSnackBar: (color: string, message: string) => any
}

const ResendMessage = styled.div`
    display: flex; 
    flex-direction: row; 
    gap: 5px;
    justify-content: center;
    align-items: center;
`

const FormContainer = styled.div`
    width: 90%;
    max-width: 500px;
    background-color: white;
    padding: 20px; 
    box-sizing: border-box;
    display: flex; 
    flex-direction: column; 
    align-items: center; 
`

const OperatorAuth: FC<Props> = ({ setAccessToken, showSnackBar }) => {

    const [sent, setSent] = useState(false); // flag that indicates whether an email has been sent to operator
    const [sending, setSending] = useState<boolean>(false);
    const { token } = useParams();
    const theme = useTheme();




    const validateCode = async (code: string) => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/v1/company/operators/validate_token/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            })
            if (res.status !== 200) throw Error("Response from api not okay")

            setAccessToken((await res.json()).access_token)
            showSnackBar('success', "Validation complete")
        } catch (err: any) {
            console.log(err);
        }
    }

    const sendAuthEmail = async (): Promise<any> => {
        const res = await fetch(`http://127.0.0.1:5000/v1/company/operators/generate_token/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        showSnackBar('success', "Email sent");
        setSent(res.status === 200);
    }

    const handleReSend = async (): Promise<any> => {
        setSending(true);
        await sendAuthEmail();
        setSending(false)

    }

    useEffect(() => {
        sendAuthEmail();
    }, [])

    return (
        <>
            {
                sent ?
                    <FormContainer>
                        <DumpTruckSvg width={100} height={100} color={theme.palette.secondary.main} />
                        <FormView style={{ width: '100%', backgroundColor: 'white' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="subtitle1" fontWeight={'bold'}>
                                    Enter Verification Code
                                </Typography>
                                <Typography variant='subtitle2' textAlign={'center'}>
                                    We've sent a code to your email. Enter it bellow to authenticate
                                </Typography>
                            </div>
                            <div style={{ backgroundColor: 'white', padding: '5px', borderRadius: '5px' }}>
                                <RFOCodeForm onSubmit={validateCode} />
                            </div>
                            <ResendMessage>
                                <Typography variant='body2' textAlign={'center'}>Didn't get a code?</Typography>
                                <Button
                                    disabled={sending}
                                    onClick={handleReSend}
                                >
                                    <Typography style={{ fontWeight: 'bold' }} variant='body2' >
                                        {sending ? "Sending..." : "Click to resend."}
                                    </Typography>
                                </Button>
                            </ResendMessage>
                        </FormView>
                    </FormContainer>
                    :
                    <MessageView

                        title={"Authenticating Operator"}
                        subtitle={"Wait while we create you an secret token"}
                        icon={<HourglassBottomIcon style={{ fontSize: '25pt' }} />}
                        message={"Sorry for taking too long. We will send you a token over email when its done."}
                    />
            }

        </>
    )
}

export default OperatorAuth


