import styled from "styled-components";
import { Section, SectionContents } from "../../../../../components/shared";


export const MobileNavBarSection = styled(Section)`
  position: fixed;
  top: 0; 
  left: 0; 
  width: 100%;
  box-sizing: border-box;
  display: flex; 
  justify-content: flex-start;
  margin-top: 0px;
  > div:first-child {
    display: flex;
    gap: 20px; 
    justify-content: center; 
    align-items: center;
  }
`;


export const MobileNavBarSectionContents = styled(SectionContents)`

`



export const MenuItemsDrawer = styled.div<{ show: boolean, color: string }>`
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: end;
    width: ${props => props.show ? '200px' : '0px'};
    opacity: ${props => props.show ? '1' : '0'};
    transition: width .4s ease-in-out, opacity 0.2s ease-in-out;
    background-color: ${props => props.color};
    padding: 20px;
    border-radius: 10px; 
`;


export const LeftContainer = styled.div`
  flex: 70%;
  display: flex;
  align-items: center;
  padding-left: 5%;
`;

export const RightContainer = styled.div`
  flex: 100%;
  display: flex;
  justify-content: flex-end;
  padding-right: 50px;
`;

export const NavbarInnerContainer = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
`;

export const NavbarLinkContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const NavbarLink = styled.span<{ inView: boolean, inViewColor: string, outOfViewColor: string }>`
    a {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 30px;
        font-family: Arial, Helvetica, sans-serif;
        // transform: ${props => props.inView ? 'translateX(-20%)' : 'translateX(0)'}
        padding-right: ${props => props.inView ? '40px' : '0px'};
        transition: all 0.2s ease-in-out;
        span {
            color: white; 
            background-color: black;
            padding: 5px 10px 5px 10px;
            font-size: 1.15rem;
            border-radius: 5px;
        }

        div {
            height: 40px;
            aspect-ratio: 1; 
            background-color: ${props => props.inView ? props.inViewColor : props.outOfViewColor};
            border-radius: ${props => props.inView ? '50%' : '0%'};
            transition: all 0.2s ease-in-out;
        }
    }
`;

export const NavbarLinkExtended = styled.span`
  color: white;
  font-size: x-large;
  font-family: Arial, Helvetica, sans-serif;
  text-decoration: none;
  margin: 10px;
`;

export const Logo = styled.img`
  max-width: 60px;
`;

export const OpenLinksButton = styled.button`
  width: 70px;
  height: 50px;
  background: none;
  border: none;
  color: white;
  font-size: 45px;
  cursor: pointer;

  @media (min-width: 700px) {
    display: none;
  }
`;

export const NavbarExtendedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 700px) {
    display: none;
  }
`;