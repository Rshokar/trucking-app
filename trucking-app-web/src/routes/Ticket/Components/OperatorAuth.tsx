import React, { useEffect, FC, useState, ReactNode } from 'react'
import { useParams } from 'react-router-dom';
import RFOCodeForm from '../../../components/Forms/RFOCodeForm';
import { Button, Typography, useTheme } from '@mui/material';
import styled from 'styled-components';
import { FormView } from '../../../components/Forms/styles';
import DumpTruckSvg from '../../../components/SVGS/DumpTruckSvg';
import ExpiredSVG from '../../../components/SVGS/ExpiredSVG';
import NothingFoundSVG from '../../../components/SVGS/NothingFoundSVG';
import MyCard from '../../../components/Cards/MyCard';


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

    const theme = useTheme();
    const [sent, setSent] = useState(false); // flag that indicates whether an email has been sent to operator
    const [expired, setExpired] = useState<boolean>(false);
    const [sending, setSending] = useState<boolean>(false);
    const [svg, setSVG] = useState<ReactNode>(<DumpTruckSvg width={100} height={100} color={theme.palette.secondary.main} />);
    const [title, setTitle] = useState<string>("Authenticating Operator");
    const [subtitle, setSubtitle] = useState<string>("Wait while we create you an secret token");
    const { token } = useParams();




    const validateCode = async (code: string) => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/v1/company/operators/validate_token/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            })

            if (res.status === 400) {
                setTitle("Incorrect Code!")
                setSubtitle("Click bellow to resend token")
            }

            if (res.status === 401) {
                setExpired(true)
                setTitle("The dispatch is expired")
                setSubtitle("Something went wrong")
                setSVG(<ExpiredSVG width={100} height={100} color={theme.palette.error.main} />)
            };

            if (res.status === 404) {
                setTitle("Token is not correct")
                setSubtitle("The token used did not match out results. Try again")
                setSVG(<NothingFoundSVG width={100} height={100} color={theme.palette.error.main} />)
            }

            if (res.status !== 200) throw Error(await res.text())

            setAccessToken((await res.json()).access_token)
            showSnackBar(theme.palette.secondary.main, "Validation complete.")
        } catch (err: any) {
            showSnackBar(theme.palette.error.main, err.message)
        }
    }

    const sendAuthEmail = async (): Promise<any> => {

        try {
            const res = await fetch(`http://127.0.0.1:5000/v1/company/operators/generate_token/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            if (res.status === 401) {
                setExpired(true)
                setTitle("The dispatch is expired")
                setSubtitle("Contact your dispatcher to update status")
                setSVG(<ExpiredSVG width={100} height={100} color={theme.palette.error.main} />)
            };

            if (res.status === 404) {
                setExpired(true)
                setTitle("RFO (Request For Operator) not found")
                setSubtitle("The ticket you were looking for no loner exist. Contact your dispatcher")
                setSVG(<NothingFoundSVG width={100} height={100} color={theme.palette.error.main} />)
            }
            if (res.status !== 200) throw Error(await res.text())

            showSnackBar(theme.palette.secondary.main, "Email sent");
            setTitle("Enter verification code")
            setSubtitle("We've sent a code to your email. Enter it bellow to authenticate")
            setSent(true);
        } catch (err: any) {
            showSnackBar(theme.palette.error.main, err.message)
            setTitle(err.message)
        }
    }

    const handleReSend = async (): Promise<any> => {
        setSending(true);
        await sendAuthEmail();
        setSending(false)

    }

    useEffect(() => {
        sendAuthEmail();
    }, [])

    return <MyCard
        title={title}
        subtitle={subtitle}
        svg={svg}
    >
        <FormView style={{ width: '100%', backgroundColor: 'white' }}>
            {
                sent &&
                <div style={{ backgroundColor: 'white', padding: '5px', borderRadius: '5px' }}>
                    <RFOCodeForm onSubmit={validateCode} />
                </div>
            }
            {
                !expired &&
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
            }
        </FormView>
    </MyCard>
}

export default OperatorAuth


// <MessageView

// title={"Authenticating Operator"}
// subtitle={"Wait while we create you an secret token"}
// icon={<HourglassBottomIcon style={{ fontSize: '25pt' }} />}
// message={"Sorry for taking too long. We will send you a token over email when its done."}
// />