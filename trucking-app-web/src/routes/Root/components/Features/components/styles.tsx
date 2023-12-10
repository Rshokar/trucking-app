import styled from "styled-components";
import { Container } from "../../../../../components/shared";
import { Typography } from "@mui/material";
import { device } from "../../../../../components/devices";

export const FeatureHeader = styled(Container)`
    justify-content: space-between;
    width: 100%;
    padding-bottom: 30px;
    gap: 10px;
`

// export const FeatureSummary = styled(Container) <{ show: boolean }>`
//     opacity: ${props => props.show ? '1' : '0'};
//     max-height: ${props => props.show ? '1000px' : '0px'};
//     overflow: hidden;
//     transition: max-height .75s ease-in-out, opacity .75s ease-in-out;
// `;

export const FeatureArguments = styled(Container)`
    max-width: 100%;
    flex-direction: row; 
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 20px 20px;
    
    @media(${device.mobileL}) {
        flex-direction: column;
        gap: 50px;
    }
`;

export const FeatureArgument = styled(Container) <{ color: string, titleBorder: string, borderColor: string }>`
    background-color: ${props => props.color};
    box-sizing: border-box;
    padding: 10px; 
    flex-direction: column; 
    align-items: flex-start;
    justify-content: start;
    flex: 0 0 30%;
    opacity: 1;
    border: 2px solid ${props => props.borderColor};
    transform: translateY(30px);
    transition: opacity 0.5s, transform 0.5s, padding 0.2s;
    will-change: opacity, transform;
    gap: 10px;

    @media(${device.laptopL}) {
        flex: 0 0 calc(50% - 20px);
    }


    @media(${device.tablet}) {
        flex: 0 0 100%;
    }
    h6 {
        padding-left: 0;
        padding-right: 0;
        border-bottom: 2px solid ${props => props.titleBorder}
    }

    &:hover {
        padding: 15px;
        border: 2px solid ${props => props.borderColor}
    }
`



// Move this outside the Feature component
export const FeatureContainer = styled(Container)`
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    box-sizing: border-box;
    gap: 2rem;

    @media(${device.laptop}) {
        h3 {
          font-size: 1.75rem;
        }
    }
`;

export const TwoLineTitle = styled(Typography)`
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: white; 
    width: 100%;

    @media(${device.tablet}) {
        width: 75%
    }
`;

