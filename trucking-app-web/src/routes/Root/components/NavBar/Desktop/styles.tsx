import styled from "styled-components";
import { SectionContents, Section } from "../../../../../components/shared";
import { device } from "../../../../../components/devices";

export const DesktopNavBarSection = styled(Section)`
    position: fixed;
    top: 0; 
    left: 0; 
    width: 100%;
    margin-top: 0px;
    z-index: 10;

    span {
        font-size: 1.1rem; 
    }

    @media (${device.laptop}) {
        span {
            font-size: .75rem;
        }
    }
`
export const DesktopNavBarSectionContents = styled(SectionContents) <{ menuItemColor: string, showBackground: boolean }>`
    display: flex; 
    justify-content: space-between;
    flex: 1;
    // background-color: ${props => props.showBackground ? '#252D4D' : 'transparent'};
    padding: 5px 20px 5px 20px;
    border-radius: 5px; 
    transition: background-color 1s ease-in-out;

    >div:first-child {
        display: flex;
        gap: 20px; 
        justify-content: center; 
        align-items: center;    
    }

    .menu-items {
        display: flex;
        gap: 20px;


        div {
            background-color: ${props => props.menuItemColor};
            padding: 5px 20px 5px 20px;
            border-radius: 5px;
            transition: background-color 0.4s ease-in-out, color 0.2s ease-in-out;
            a {
                text-decoration: none;
            } 
        }


        .active {
            background-color: white;

            a span {
                color: black;
            }
        }
    }

`