import { useState } from "react";
import styled from "styled-components";
import { Typography, useTheme } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import { device } from "../../../../components/devices";
import { Divide as Hamburger } from "hamburger-react";
import { colors } from "../../../../index";

export const FEATURES_ID = "features";
export const GET_STARTED_ID = "get_started";
export const PRICING_ID = "pricing";
export const DOWNLOAD_ID = "download";

type Props = {
  id: string;
  text: string;
};
const MenuItem = ({ id, text }: Props) => {
  const isDesktop = useMediaQuery({ query: device.laptopL });
  const theme = useTheme();

  return (
    <NavbarLink>
      <a
        href={id}
        style={{ textDecoration: "none", color: theme.palette.primary.main }}
      >
        <Typography
          variant={isDesktop ? "h6" : "subtitle1"}
          fontWeight={"bold"}
          color={colors.graylight}
        >
          {text}
        </Typography>
      </a>
    </NavbarLink>
  );
};
const MenuItemExtended = ({ id, text }: Props) => {
  const isDesktop = useMediaQuery({ query: device.laptopL });
  const theme = useTheme();

  return (
    <NavbarLinkExtended>
      <a
        href={id}
        style={{ textDecoration: "none", color: theme.palette.primary.main }}
      >
        <Typography
          variant={isDesktop ? "h6" : "subtitle1"}
          fontWeight={"bold"}
          color={colors.graylight}
        >
          {text}
        </Typography>
      </a>
    </NavbarLinkExtended>
  );
};

const Header = () => {
  const [extendNavbar, setExtendNavbar] = useState<boolean>(false);
  return (
    <NavbarContainer
      extendNavbar={extendNavbar}
      style={{ backgroundColor: colors.graydark }}
    >
      <NavbarInnerContainer>
        <LeftContainer>
          <Logo src={"/tare-ticketing-icon.png"} />
        </LeftContainer>
        <RightContainer>
          <NavbarLinkContainer>
            <MenuItem id={`#${FEATURES_ID}`} text={"Features"} />
            <MenuItem id={`#${GET_STARTED_ID}`} text={"Get Started"} />
            <MenuItem id={`#${PRICING_ID}`} text={"Pricing"} />
            <MenuItem id={`#${DOWNLOAD_ID}`} text={"Download"} />
            <OpenLinksButton>
              <Hamburger toggled={extendNavbar} onToggle={setExtendNavbar} />
            </OpenLinksButton>
          </NavbarLinkContainer>
        </RightContainer>
      </NavbarInnerContainer>

      {extendNavbar && (
        <NavbarExtendedContainer>
          <MenuItemExtended id={`#${FEATURES_ID}`} text={"Features"} />
          <MenuItemExtended id={`#${GET_STARTED_ID}`} text={"Get Started"} />
          <MenuItemExtended id={`#${PRICING_ID}`} text={"Pricing"} />
          <MenuItemExtended id={`#${DOWNLOAD_ID}`} text={"Download"} />
        </NavbarExtendedContainer>
      )}
    </NavbarContainer>
  );
};

export const NavbarContainer = styled.nav<{ extendNavbar: boolean }>`
  width: 100%;
  height: ${(props) => (props.extendNavbar ? "100vh" : "80px")};

  display: flex;
  flex-direction: column;

  @media (min-width: 700px) {
    height: 80px;
  }
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

export const NavbarLink = styled.span`
  color: white;
  font-size: x-large;
  font-family: Arial, Helvetica, sans-serif;
  text-decoration: none;
  margin: 10px;

  @media (max-width: 700px) {
    display: none;
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

export default Header;
