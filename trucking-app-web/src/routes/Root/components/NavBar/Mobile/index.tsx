import { useState, ReactNode, useEffect } from "react";
import { useTheme } from "@mui/material";
import { NavbarContainer, NavbarLink, MenuItemsDrawer, Logo } from './styles';
import { Typography } from '@mui/material'
import { CONTACT_ID, DOWNLOAD_ID, FEATURES_ID, GET_STARTED_ID, PRICING_ID, SUMMARY_ID } from "..";
import LogoSVG from "../../../../../components/SVGS/LogoSVG";
import SmallLogoSVG from "../../../../../components/SVGS/SmallLogoSVG";
import WhiteLogoSVG from "../../../../../components/SVGS/WhiteLogoSVG";

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


const MobileNavBar = () => {
  const [extendNavbar, setExtendNavbar] = useState<boolean>(false);
  const [showItems, setShowItems] = useState<boolean>(false);
  const theme = useTheme()
  return (
    <NavbarContainer extendNavbar={extendNavbar}>
      <div>
        <SmallLogoSVG onClick={() => setShowItems(!showItems)} />
        <Typography variant="subtitle1">Tare Ticketing</Typography>
      </div>
    </NavbarContainer>

  );
};

export default MobileNavBar