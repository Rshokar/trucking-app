import React from "react";
import { Typography, useTheme } from "@mui/material";
import styled from "styled-components";
import { Container } from "../../../../components/shared";
import Package from "./components/Package";
import { BaseProps } from "../../../types";

const PricingContainer = styled(Container)`
  background-color: white;
  gap: 40px;
  flex-direction: column;
  padding: 40px 10px 0px 10px;
`;

const PackageContainer = styled(Container)`
  gap: 40px;
  flex-wrap: wrap;
  flex-basis: calc(50% - 10px);
`;

const Message = styled(Container)`
  flex-direction: column;
  gap: 20px;
`;

const Pricing = ({ id }: BaseProps) => {
  const theme = useTheme();

  return (
    <PricingContainer id={id}>
      <Message>
        <Typography variant="h3" fontWeight="bold">
          Tiered Pricing
        </Typography>
        <Typography textAlign="center" maxWidth="400px" variant="h6">
          With tiered pricing, get charged for how much you use. Because one
          consistency is the inconsistency of logistics
        </Typography>

        <Typography textAlign="center" maxWidth="90%" variant="subtitle1">
          An <strong>RFO</strong> stands for Request For Operator. This is a digital ticket you create that stores all your billing information
        </Typography>
      </Message>
      <PackageContainer>
        <Package
          title="BEGINNER"
          monthRange="0-120 RFO'S PER MONTH"
          dayRange="On average of 0-5 RFO's per day"
          pricePerRFO={'0.25'}
          totalPrice={15}
          color={theme.palette.secondary.main}
          breakColor={theme.palette.primary.main}
        />
        <Package
          title="STANDARD"
          monthRange="120-360 RFO'S PER MONTH"
          dayRange="On average of 6-15 RFO's per day"
          pricePerRFO={'0.22'}
          totalPrice={50}
          color={theme.palette.primary.main}
          breakColor={theme.palette.secondary.main}
        />
        <Package
          title="PROFESSIONAL"
          monthRange="360-720 RFO'S PER MONTH"
          dayRange="On average of 15-30 RFO's per day"
          pricePerRFO={'0.20'}
          totalPrice={100}
          color={theme.palette.secondary.main}
          breakColor={theme.palette.primary.main}
        />
        <Package
          title="ENTERPRISE"
          monthRange="720+ RFO'S PER MONTH"
          dayRange="On average of 30+ RFO's per day"
          pricePerRFO={'0.17'}
          totalPrice={125}
          color={theme.palette.primary.main}
          breakColor={theme.palette.secondary.main}
        />
      </PackageContainer>
    </PricingContainer>
  );
};

export default Pricing;
