import styled from "styled-components";
import { Section, SectionContents } from "../../../../components/shared";
import { device } from "../../../../components/devices";

export const FeaturesSection = styled(Section)`
  flex-direction: column;
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
      h1 {
        font-size: 2.75rem;
      }
    
      h4 {
        font-size: 1rem;
      }
    }
  
    @media(${device.laptopS}) {
      align-items: center; 
  
      h1, h6 {
        text-align: center;
      }
`
