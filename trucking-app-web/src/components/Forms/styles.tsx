import styled from "styled-components";
import { Container } from "../shared";
import { Typography } from "@mui/material";

export const FormView = styled(Container)`
    background-color: white;
    width: 90%; 
    max-width: 500px; 
    flex-direction: column; 
    gap: 10px; 
    padding: 10px;
    box-sizing: border-box; 
`

export const ErrorText = styled(Typography)`
    color: #C73E1D;
    width: 100%; 
    padding-left: 10px; 
`