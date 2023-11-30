import { useState, ReactNode, useEffect } from "react";
import styled from "styled-components";
import { Typography, useTheme } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import { device } from "../../../../components/devices";
import { Divide as Hamburger } from "hamburger-react";
import { colors } from "../../../../index";
import { NavbarContainer, NavbarLink, NavbarLinkExtended, NavBarLogoContainer, MenuItemsDrawer, Logo } from './styles';
import { useInView } from "react-intersection-observer";
export const FEATURES_ID = "features";
export const GET_STARTED_ID = "get_started";
export const PRICING_ID = "pricing";
export const DOWNLOAD_ID = "download";
export const CONTACT_ID = "contact";
export const SUMMARY_ID = 'summary';

type Props = {
  id: string;
  text: string;
};
const MenuItem = ({ id, text }: Props) => {
  const [isActive, setIsActive] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const section = document.getElementById(id.substring(1));
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { threshold: 0.2 } // Adjust the threshold as needed
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [id]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    const target = document.getElementById(id.substring(1)); // Remove the '#' from id
    target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <NavbarLink inViewColor={theme.palette.primary.main} outOfViewColor={theme.palette.secondary.main} inView={isActive}>
      <a
        href={id}
        onClick={handleClick}
        style={{ textDecoration: "none", color: theme.palette.primary.main }}
      >
        <span>
          {text}
        </span>
        <div></div>
      </a>
    </NavbarLink>
  );
};


type MainButtonProps = {
  logo?: ReactNode;
  onClick: () => any
}
const MainButton = ({ logo, onClick }: MainButtonProps) => {
  const theme = useTheme();

  return (
    <NavBarLogoContainer onClick={onClick} color={theme.palette.primary.main} hoverColor={theme.palette.secondary.main}>
      <Logo src={"/tare-ticketing-icon.png"} />
    </NavBarLogoContainer>
  );
}

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

const NavBar = () => {
  const [extendNavbar, setExtendNavbar] = useState<boolean>(false);
  const [showItems, setShowItems] = useState<boolean>(false);
  const theme = useTheme()
  return (
    <NavbarContainer
      extendNavbar={extendNavbar}
      color={"blue"}
    >
      <MainButton onClick={() => setShowItems(!showItems)} />
      <MenuItemsDrawer show={showItems} color={theme.palette.action.active}>
        <MenuItem id={`#${SUMMARY_ID}`} text={"How it works"} />
        <MenuItem id={`#${GET_STARTED_ID}`} text={"Get Started"} />
        <MenuItem id={`#${FEATURES_ID}`} text={"Features"} />
        <MenuItem id={`#${PRICING_ID}`} text={"Pricing"} />
        <MenuItem id={`#${DOWNLOAD_ID}`} text={"Download"} />
        <MenuItem id={`#${CONTACT_ID}`} text={"Contact"} />
      </MenuItemsDrawer>
    </NavbarContainer>
  );
};


// const NavBar = () => {
//   const [extendNavbar, setExtendNavbar] = useState<boolean>(false);
//   return (
//     <NavbarContainer
//       extendNavbar={extendNavbar}
//       style={{ backgroundColor: colors.graydark }}
//     >
//       <NavbarInnerContainer>
//         <LeftContainer>
//           <Logo src={"/tare-ticketing-icon.png"} />
//         </LeftContainer>
//         <RightContainer>
//           <NavbarLinkContainer>
//             <MenuItem id={`#${FEATURES_ID}`} text={"Features"} />
//             <MenuItem id={`#${GET_STARTED_ID}`} text={"Get Started"} />
//             <MenuItem id={`#${PRICING_ID}`} text={"Pricing"} />
//             <MenuItem id={`#${DOWNLOAD_ID}`} text={"Download"} />
//             <MenuItem id={`#${CONTACT_ID}`} text={"Contact"} />
//             <OpenLinksButton>
//               <Hamburger toggled={extendNavbar} onToggle={setExtendNavbar} />
//             </OpenLinksButton>
//           </NavbarLinkContainer>
//         </RightContainer>
//       </NavbarInnerContainer>

//       {extendNavbar && (
//         <NavbarExtendedContainer>
//           <MenuItemExtended id={`#${FEATURES_ID}`} text={"Features"} />
//           <MenuItemExtended id={`#${GET_STARTED_ID}`} text={"Get Started"} />
//           <MenuItemExtended id={`#${PRICING_ID}`} text={"Pricing"} />
//           <MenuItemExtended id={`#${DOWNLOAD_ID}`} text={"Download"} />
//           <MenuItemExtended id={`#${CONTACT_ID}`} text={"Contact"} />
//         </NavbarExtendedContainer>
//       )}
//     </NavbarContainer>
//   );
// };

// export const NavbarContainer = styled.nav<{ extendNavbar: boolean }>`
//   width: 100%;
//   height: ${(props) => (props.extendNavbar ? "100vh" : "80px")};

//   display: flex;
//   flex-direction: column;

//   @media (min-width: 700px) {
//     height: 80px;
//   }
// `;

// export const LeftContainer = styled.div`
//   flex: 70%;
//   display: flex;
//   align-items: center;
//   padding-left: 5%;
// `;

// export const RightContainer = styled.div`
//   flex: 100%;
//   display: flex;
//   justify-content: flex-end;
//   padding-right: 50px;
// `;

// export const NavbarInnerContainer = styled.div`
//   width: 100%;
//   height: 80px;
//   display: flex;
// `;

// export const NavbarLinkContainer = styled.div`
//   display: flex;
//   align-items: center;
// `;

// export const NavbarLink = styled.span`
//   color: white;
//   font-size: x-large;
//   font-family: Arial, Helvetica, sans-serif;
//   text-decoration: none;
//   margin: 10px;

//   @media (max-width: 700px) {
//     display: none;
//   }
// `;

// export const NavbarLinkExtended = styled.span`
//   color: white;
//   font-size: x-large;
//   font-family: Arial, Helvetica, sans-serif;
//   text-decoration: none;
//   margin: 10px;
// `;

// export const Logo = styled.img`
//   max-width: 60px;
// `;

// export const OpenLinksButton = styled.button`
//   width: 70px;
//   height: 50px;
//   background: none;
//   border: none;
//   color: white;
//   font-size: 45px;
//   cursor: pointer;

//   @media (min-width: 700px) {
//     display: none;
//   }
// `;

// export const NavbarExtendedContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;

//   @media (min-width: 700px) {
//     display: none;
//   }
// `;

export default NavBar;
