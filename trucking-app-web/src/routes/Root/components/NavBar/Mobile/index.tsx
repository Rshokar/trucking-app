import { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { MobileNavBarSection, MobileNavBarSectionContents, NavbarLink, NavIconButton, Drawer } from './styles';
import { Typography, IconButton } from '@mui/material'
import { NavBarProps } from "..";
import SmallLogoSVG from "../../../../../components/SVGS/SmallLogoSVG";


type Props = {
  url: string;
  text: string;
};
const MenuItem = ({ url, text }: Props) => {
  const [isActive, setIsActive] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const section = document.getElementById(url.substring(1));
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
  }, [url]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    const target = document.getElementById(url.substring(1)); // Remove the '#' from url
    target?.scrollIntoView({ behavior: "smooth" });
  };


  return (
    <NavbarLink
      inViewColor={'white'}
      outOfViewColor={theme.palette.secondary.main}
      inView={isActive}
      href={url}
      onClick={handleClick}>
      <Typography variant="button">
        {text}
      </Typography>
    </NavbarLink>
  );
};


const MobileNavBar = (props: NavBarProps) => {
  const [showItems, setShowItems] = useState<boolean>(false);
  const theme = useTheme();
  const toggleMenu = () => {
    setShowItems(!showItems);
  };

  return (
    <MobileNavBarSection>
      <MobileNavBarSectionContents>
        <div>
          <NavIconButton onClick={toggleMenu} aria-label="menu" show={showItems}>
            <MenuIcon />
          </NavIconButton>
          <Drawer backgroundColor={theme.palette.primary.main} show={showItems}>
            {props.menuItems.map(mItems => <MenuItem url={mItems.url} text={mItems.label} />)}
          </Drawer>
        </div>
        <div>
          <Typography variant="button">Tare Ticketing</Typography>
          <SmallLogoSVG />
        </div>
      </MobileNavBarSectionContents>
    </MobileNavBarSection>

  );
};

export default MobileNavBar