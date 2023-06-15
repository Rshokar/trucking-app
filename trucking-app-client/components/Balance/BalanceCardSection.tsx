import React, { FunctionComponent } from "react";
import styled from "styled-components/native";

import BalanceCard from "./BlanceCard";

const BalanceCardSectionBackround = styled.View`
    width: 100%; 
    justify-content: center;
    align-items: center;
    flex: 2;
`
import { BalanceCardProps } from "./types";

const BalanceCardSection: FunctionComponent<BalanceCardProps> = (props) => {
    return (
        <BalanceCardSectionBackround>
            <BalanceCard {...props} />
        </BalanceCardSectionBackround>
    )
}

export default BalanceCardSection