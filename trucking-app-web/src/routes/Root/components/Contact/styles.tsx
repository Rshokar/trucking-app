import styled from "styled-components";
import { Container, Section, SectionContents } from "../../../../components/shared";
import { Input, TextareaAutosize, Typography } from '@mui/material';
import { device } from "../../../../components/devices";

export const ContactSection = styled(Section)`
`;

export const ContactSectionContent = styled(SectionContents)`
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding-bottom: 5rem;


    >div:first-child {
            display: flex; 
            flex-direction: column; 
            gap: 40px;
    @media(${device.laptop}) {
        h1 {
          font-size: 2.75rem;
        }
      
        h4 {
          font-size: 1rem;
        }
      }
    }
`

export const InputBox = styled(Input)`
    background-color: white;
    padding: 10px;
    border-radius: 1px;
`;

export const InputBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const TextAreaBox = styled(TextareaAutosize)`
  padding: 10px;
  border-radius: 1px;
  width: 100%;
  border-top: none;
  border-left: none;
  border-right: none;
  padding-bottom: 5rem;
  box-sizing: border-box; 
  &::placeholder {
    /* Define your placeholder styles here */
    font-size: 12pt;
    color: #7b7b7b; /* Placeholder text color */
    font-family: sans-serif;
  }
`;

export const ButtonText = styled(Typography)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DualInput = styled.div`
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  gap: 30px;
  justifyContent: space-between;
  width: 100%;
  marginBottom: 30px;
`