import React, { useEffect, useState, ReactNode } from 'react'
import styled from 'styled-components'
import { Box, useTheme } from '@mui/material'
import { Container } from '../../components/shared'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import { useParams } from 'react-router-dom';
import MyCard from '../../components/Cards/MyCard';
import EngineSVG from '../../components/SVGS/EngineSVG';
import NothingFoundSVG from '../../components/SVGS/NothingFoundSVG';
import ExpiredSVG from '../../components/SVGS/ExpiredSVG';
import EmailConfirmedSVG from '../../components/SVGS/EmailConfirmedSVG';

const View = styled(Container)`
    height: 100vh;
    width: 100vw;
    align-items: center; 
    justify-content: center;
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


const ValidateOperatorEmailPage = () => {
    const [message, setMessage] = useState<{ title: string, subTitle: string, svg: ReactNode, }>({
        title: "Validating Email....",
        subTitle: "Thanks for clicking the link. We are currently validating your email",
        svg: <EngineSVG width={100} height={100} />,
    });
    const { token } = useParams();

    const validateEmail = async () => {
        console.log(process.env.REACT_APP_API_URL)
        const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/company/operators/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: token + '' })
        })
        const response = await res.text();
        if (res.status === 404)
            setMessage({
                title: response,
                subTitle: "The operators to be validated could not be found. Contact your dispatcher.",
                svg: <NothingFoundSVG width={100} height={100} />
            })

        if (res.status === 403)
            setMessage({
                title: response,
                subTitle: "It looks like the link you were given is expired or invalid. Contact your dispatcher to send a new link.",
                svg: <ExpiredSVG width={100} height={100} />
            })

        if (res.status === 200)
            setMessage({
                title: response,
                subTitle: "Welcome to the crew. Your dispatcher will be in contact soon with RFO'S (Request For Operator).",
                svg: <EmailConfirmedSVG width={100} height={100} stroke='black' />
            })
    }

    useEffect(() => {
        validateEmail();
    }, [])


    return <View>
        <MyCard title={message.title} subtitle={message.subTitle} svg={message.svg} />
    </View>

}
export default ValidateOperatorEmailPage