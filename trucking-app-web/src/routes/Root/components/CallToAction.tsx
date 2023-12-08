import React from "react";
import styled from "styled-components";
import { Container } from "../../../components/shared";
import { Typography, Button, useTheme } from "@mui/material";
import AppStoreSVG from "../../../components/SVGS/AppStoreSVG";
import PlayStoreSVG from "../../../components/SVGS/PlayStoreSVG";
import { BaseProps } from "../../types";

const CallToActionContainer = styled(Container)`
  background-color: white;
  height: 75vh;
  flex-direction: column;
  gap: 30px;
`;

const CallToActionMessage = styled(Container)`
  flex-direction: column;
  gap: 30px;
`;

const ButtonContainer = styled(Container)`
  display: flex;
  gap: 20px;
  flex-direction: column;
  width: 100%;
`;

const CallToActionButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  max-width: 300px;
  width: 100%;
`;

const ButtonText = styled(Typography)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CallToAction = ({ id }: BaseProps) => {
  const theme = useTheme();

  return (
    <CallToActionContainer id={id}>
      <CallToActionMessage>
        <Typography variant="h4">
          Your time is precious, start getting it back
        </Typography>
        <Typography variant="subtitle2">
          DOWNLOAD
        </Typography>
      </CallToActionMessage>
      <ButtonContainer>
        <CallToActionButton
          style={{ backgroundColor: theme.palette.primary.main }}
        >
          <ButtonText variant="button">
            APP STORE
          </ButtonText>
          <AppStoreSVG height="45px" width="45px" fill="white" />
        </CallToActionButton>
        <CallToActionButton
          style={{ backgroundColor: theme.palette.secondary.main }}
        >
          <ButtonText variant="button">
            APP STORE
          </ButtonText>
          <PlayStoreSVG height="45px" width="45px" fill="white" />
        </CallToActionButton>
      </ButtonContainer>
    </CallToActionContainer>
  );
};

export default CallToAction;
