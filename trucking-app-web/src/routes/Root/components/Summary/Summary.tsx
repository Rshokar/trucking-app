import React from 'react'
import { Container } from '../../../../components/shared'
import { Typography, useTheme } from "@mui/material";
import styled from 'styled-components';
import Break from '../../../../components/Break/Break';

type Props = {
    id: string
}

const SummaryContainer = styled(Container)`
    flex-direction: column; 
    background-color: white;
    padding: 80px 0px 80px 0px;
    gap: 20px;
`

const MyFrame = styled.iframe`
    width: 760px;
    height: 515px;


    @media(max-width: 1000px) {
        width: 660px;
        height: 415px;
    }

    @media(max-width: 760px) {
        width: 560px;
        height: 315px;
    }

    
    @media(max-width: 600px) {
        width: 460px;
        height: 215px;
    }

    
    @media(max-width: 500px) {
        width: 360px;
        height: 200px;
    }
`

const Summary = ({ id }: Props) => {
    return (
        <SummaryContainer id={`${id}`}>
            <Typography
                variant={"h2"}
                fontWeight={"bold"}
                textAlign="center"
            >
                How it works
            </Typography>
            <Typography
                variant={"h4"}
                textAlign="center"
            >
                Drops the books and pickup the future
            </Typography>
            <Break style={{ marginBottom: '20px' }} />
            <MyFrame
                src="https://www.youtube.com/embed/9phQ-fK42Oo?si=L06S0pat_3p3icyx"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen={true}
            >

            </MyFrame>

        </SummaryContainer>
    )
}

export default Summary