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
import ValidateEmailController from '../../controllers/ValidateEmailController';

const View = styled(Container)`
    height: 100vh;
    width: 100vw;
    align-items: center; 
    justify-content: center;
`

export enum EMAIL_VALIDATION_TYPE { DISPATCHER = 'dispatcher', OPERATOR = 'operator' }


const ValidateEmail = () => {
    const [message, setMessage] = useState<{ title: string, subTitle: string, svg: ReactNode, }>({
        title: "Validating Email....",
        subTitle: "Thanks for clicking the link. We are currently validating your email",
        svg: <EngineSVG width={100} height={100} />,
    });
    const { token = '', type = 'dispatcher' } = useParams();


    const runValidation = async () => {
        switch (type) {
            case (EMAIL_VALIDATION_TYPE.DISPATCHER):
                return ValidateEmailController.validateDispatcherEmail(token)
            case (EMAIL_VALIDATION_TYPE.OPERATOR):
                return ValidateEmailController.validateOperatorEmail(token)
            default:
                throw Error("Email validation type not found");
        }
    }

    const validateEmail = async () => {
        const res = await runValidation()
        const response = await res.text();
        if (res.status === 404)
            setMessage({
                title: response,
                subTitle: `The ${type === EMAIL_VALIDATION_TYPE.DISPATCHER ? "dispatcher" : "operator"} could not be found.`,
                svg: <NothingFoundSVG width={100} height={100} />
            })

        if (res.status === 403)
            setMessage({
                title: response,
                subTitle: "It looks like the link you were given is expired or invalid",
                svg: <ExpiredSVG width={100} height={100} />
            })

        if (res.status === 200)
            setMessage({
                title: response,
                subTitle: `Welcome to the crew. ${type === EMAIL_VALIDATION_TYPE.DISPATCHER ? "Go back to the app and press check again" : "Your dispatcher will be in contact soon with RFO'S (Request For Operator)"}.`,
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
export default ValidateEmail