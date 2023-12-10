import styled from "styled-components";
import { SectionContents, Section } from "../../../../../components/shared";

export const DesktopNavBarSection = styled(Section)`
    position: fixed;
    top: 0; 
    left: 0; 
    width: 100%;
    margin-top: 0px;
`
export const DesktopNavBarSectionContents = styled(SectionContents) <{ menuItemColor: string }>`
    display: flex; 
    justify-content: space-between;
    flex: 1;

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

            a {
                text-decoration: none;
                color: white;
            }
        }


        .target {
            background-color: white;

            a {
                color: black;
            }
        }
    }

`