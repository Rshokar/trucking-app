import styled from "styled-components";

export const NavbarContainer = styled.nav<{ extendNavbar: boolean, color: string }>`
    position: fixed;
    bottom: 10%;
    right: 10%;

    @media (max-width: 700px) {
        bottom: 5%;
        right: 5%;
    }

    display: flex;
    flex-direction: column-reverse;
    align-items: end;
    gap: 30px;
    overflow: hidden;
    z-index: 1000;
    padding: 10px;
    min-width: 300px;
`;

export const NavBarLogoContainer = styled.div<{ color: string; hoverColor: string }>`
    background-color: ${props => props.color};
    border: 1px solid black;
    flex-basis: 70px;  // initial size
    flex-grow: 0;      // prevent growing
    flex-shrink: 0;    // prevent shrinking
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1;

    cursor: pointer;

    &:hover {
        background-color: ${props => props.hoverColor}
    }

    transition: background-color 0.2s ease-in-out;
`;


export const MenuItemsDrawer = styled.div<{ show: boolean, color: string }>`
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: end;
    transform: ${props => props.show ? 'translateX(0)' : 'translateX(150%)'};
    opacity: ${props => props.show ? '1' : '0'};
    transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;
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