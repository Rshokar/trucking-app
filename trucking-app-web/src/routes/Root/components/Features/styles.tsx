import styled from "styled-components";
import { Section, SectionContents } from "../../../../components/shared";
import { device } from "../../../../components/devices";
import YellowTruckSVG from "../../../../components/SVGS/trucks/YellowTruckSVG";


export const FeaturesSection = styled(Section)`
  flex-direction: column;
  position: relative; 
  
  @media(${device.laptop}) {
    align-items: center; 
    padding-top: 250px; 
    h1, h4 {
      text-align: center;
    }
  }
`;

export const FeaturesSectionContents = styled(SectionContents)`
    flex-direction: column; 
    align-items: flex-start;
    gap: 8rem; 
    width: 100%;

    >div:first-child {
      display: flex; 
      flex-direction: column; 
      gap: 30px; 
    }

    @media(${device.laptop}) {
      align-items: center; 
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
`


export const YTruckSVG = styled(YellowTruckSVG)`
      position: absolute;
      top: -120px;
      right: 0px;

      
    @media(${device.laptopL}) {
      scale: 0.75;
    }
  
    @media(${device.laptop}) {
      top: -100px;
    }
`