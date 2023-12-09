import styled from "styled-components";
import { Container, Section, SectionContents } from "../../../../components/shared";
import { device } from "../../../../components/devices";
import { Typography, useTheme } from "@mui/material";
import DownloadApp from "../../../../components/DownloadApp/DownloadApp";
import LogoSVG from "../../../../components/SVGS/LogoSVG";
import RedTruckSVG from "../../../../components/SVGS/trucks/RedTruckSVG";
import GreenTruckSVG from "../../../../components/SVGS/trucks/GreenTruckSVG";
import { useMediaQuery } from "react-responsive";

const HeroSection = styled(Section)`
  position: relative;
  height: 100vh;
  width: 100%;
  @media (${device.tablet}) {
    height: 90vh;
    > svg {
      scale: 0.5;
    }
  }

  @media (${device.laptop}) {
    height: 90vh;
  }


  
`;

const HeroContents = styled(SectionContents)`
  gap: 40px;
  @media(${device.tablet}) {
    flex-direction: column;
    gap: 80px;
  }
`


const LeftContainer = styled(Container)`
  flex-direction: column;
  align-items: flex-start ;
  gap: 40px;

  
  @media(${device.laptop}) {
    h1 {
      font-size: 2.75rem;
    }
  
    h4 {
      font-size: 1rem;
    }
  }

  @media(${device.laptopS}) {
    align-items: center; 

    h1, h4 {
      text-align: center;
    }
  }
`;

const RightContainer = styled(Container)`

  @media(${device.laptop}) {
    svg{
      scale: .80;
    }   
  }

  @media(${device.laptopS}) {
    display:none;
  }

`

const RTruckSVG = styled(RedTruckSVG)`
  position: absolute;
  bottom: 10%; 
  right: 5%;
`

const GTruckSVG = styled(GreenTruckSVG)`
  position: absolute;
  left: -5%; 
  top: 5%;

`

const Hero = () => {

  const isLaptop = useMediaQuery({ query: device.laptop })
  return (
    <HeroSection>
      <HeroContents>
        <LeftContainer>
          <Typography variant="h1">Simplify Your Logistics</Typography>
          <Typography variant="h4">SIMPLE AND EASY TICKET AND DISPATCH MANAGEMENT FOR AGGREGATE LOGISTICS DISPATCHERS</Typography>
          <DownloadApp />
        </LeftContainer>
        <RightContainer>
          <LogoSVG />
        </RightContainer>
      </HeroContents>
      <RTruckSVG />
      <GTruckSVG />
    </HeroSection>
  );
};
export default Hero;
