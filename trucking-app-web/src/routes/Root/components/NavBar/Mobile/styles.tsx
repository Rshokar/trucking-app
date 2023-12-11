import styled from "styled-components";
import { Section, SectionContents } from "../../../../../components/shared";
import { IconButton } from "@mui/material";


export const MobileNavBarSection = styled(Section)`
  position: fixed;
  top: 0; 
  left: 0; 
  width: 100%;
  box-sizing: border-box;
  display: flex; 
  justify-content: flex-start;
  margin-top: 0px;
  z-index: 100;
  span {
    font-size: 1.1rem; 
  }
`;


export const MobileNavBarSectionContents = styled(SectionContents)`
  width: 100%;  
  justify-content: space-between;

  >div:first-child {
    position: relative;
  }

  >div:last-child {
    display: flex;
    justify-content: center; 
    align-items: center;
    gap: 20px;
  }
`

export const NavIconButton = styled(IconButton) <{ show: boolean }>`
  background-color: ${props => props.show ? 'white' : '#2D2D2D'} !important;
  color: ${props => props.show ? '#2D2D2D' : 'white'} !important;
  height: 48px;
  width: 48px;
  transform: ${props => props.show ? 'rotate(90deg)' : 'rotate(0deg)'};
  transition: transform .5s ease-in-out, color .5s ease-in-out !important; /* Add this line to animate the rotation */
`;


export const Drawer = styled.div<{ show: boolean, backgroundColor: string }>`
  position: absolute; /* Changed from relative to absolute */
  top: 80px; /* Assuming your NavIconButton is 48px high */
  left: 0;
  width: 172px; /* You can adjust this if you want the drawer to be less than full width */
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: start;
  // background-color: ${props => props.backgroundColor};
  border-radius: 10px;
  transition: transform 0.3s ease; /* Add a transition for a sliding effect */
  transform: ${props => (props.show ? 'translateX(0)' : 'translateX(-400%)')};
  z-index: 101; /* Ensure it's above the NavBarSection */
`;


export const NavbarLink = styled.a<{ inView: boolean, inViewColor: string, outOfViewColor: string }>`
  text-decoration: none;

  span {
      color: ${props => props.inView ? 'black' : 'white'}; 
      background-color: ${props => props.inView ? props.inViewColor : props.outOfViewColor};
      padding: 5px 10px 5px 10px;
      font-size: 1.15rem;
      border-radius: 5px;
      border: .5px solid white;
  }
`;


