import React, { FunctionComponent } from "react"
import styled from 'styled-components/native'
import { Ionicons } from "@expo/vector-icons";

// custom components
import { colors } from "../colors"


const StyledView = styled.View`
    width: 45px;
    height: 45px;
    border-radius: 10px;
    justify-content: center;
    align-items: center;
`



// types
import { TicketAviProps } from "./types"
import BigText from "../Texts/BigText";

const TransactionAvi: FunctionComponent<TicketAviProps> = (props) => {
    return (
        <StyledView style={{ backgroundColor: props.background }}>
            <BigText>{props.icon}</BigText>
        </StyledView>
    )
}

export default TransactionAvi;