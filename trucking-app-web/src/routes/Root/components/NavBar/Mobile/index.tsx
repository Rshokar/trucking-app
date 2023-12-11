import { useState, ReactNode, useEffect } from "react";
import { useTheme } from "@mui/material";
import { MobileNavBarSection, MobileNavBarSectionContents, NavbarLink, MenuItemsDrawer, Logo } from './styles';
import { Typography } from '@mui/material'
import WhiteLogo from '../../../../../assets/tare-ticketing-icon.png'
import { NavBarProps } from "..";
import { useMediaQuery } from "react-responsive";
import { device } from "../../../../../components/devices";
import SmallLogoSVG from "../../../../../components/SVGS/SmallLogoSVG";


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


const MobileNavBar = (props: NavBarProps) => {
  const isTablet = useMediaQuery({ query: device.tablet })
  const [extendNavbar, setExtendNavbar] = useState<boolean>(false);
  const [showItems, setShowItems] = useState<boolean>(false);
  return (
    <MobileNavBarSection>
      <MobileNavBarSectionContents>
        <SmallLogoSVG />
        <Typography variant="button">Tare Ticketing</Typography>
      </MobileNavBarSectionContents>
    </MobileNavBarSection>

  );
};

export default MobileNavBar