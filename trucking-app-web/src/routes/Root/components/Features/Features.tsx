import React, { useState } from "react";
import styled from "styled-components";
import { Container } from "../../../../components/shared";
import Feature from "./components/Feature";
import ManageSVG from "../../../../components/SVGS/ManageSVG";
import BillSVG from "../../../../components/SVGS/BillSVG";
import InternetSVG from "../../../../components/SVGS/InternetSVG";
import SmileyFaceSVG from "../../../../components/SVGS/SmileyFaceSVG";
import { useTheme, Typography } from "@mui/material";
import { device } from "../../../../components/devices";
import { BaseProps } from "../../../types";

const FeaturesContainer = styled(Container)`
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 50px;
  padding-bottom: 40px;

  @media (${device.tablet}) {
    gap: 100px;
  }
`;

const Features = ({ id }: BaseProps) => {
  const theme = useTheme();
  return (
    <div id={id} style={{ paddingTop: '40px', backgroundColor: 'white' }}>
      <Typography
        variant="h3"
        style={{
          backgroundColor: "#FFFFFF",
          textAlign: "center",
          paddingBottom: "40px",
          fontWeight: "bold",
        }}
      >
        FEATURES
      </Typography>
      <FeaturesContainer>
        <Feature
          color={theme.palette.primary.main}
          title={"Advanced Ticket Managment"}
          svg={<BillSVG height={70} width={70} stroke={"white"} />}
          breakDown={[
            {
              title: "Aggregate Billing Information",
              blurb:
                "Crafted for effortless aggregation of billing data, ensuring seamless communication between dispatch and operators.",
            },
            {
              title: "Categorization",
              blurb:
                "Organize dispatches by customer and date. RFOs can be sorted by dispatch and operator. Billing tickets can be filtered using the physical ticket number.",
            },
            {
              title: "Historical & Archived Access",
              blurb:
                "Dispatchers have the added advantage of retrieving all historical and archived data.",
            },
            {
              title: "Intuitive Display & Access",
              blurb:
                "Dispatchers experience a smooth interface on iOS and Android, and Operators receive email links to web pages for managing their associated billing tickets.",
            },
          ]}
        />
        <Feature
          color={theme.palette.secondary.main}
          title={"Operator and Dispatch Management"}
          svg={<ManageSVG height={70} width={70} fill={"white"} />}
          breakDown={[
            {
              title: "Simplified Operator Identification",
              blurb:
                "Each operator has a unique ID alongside their company name for easy recognition.",
            },
            {
              title: "Unlimited Operator Additions",
              blurb:
                "No restrictions on the number of operators you can onboard, ensuring scalability as your operations grow.",
            },
            {
              title: "Immediate Email Notifications",
              blurb:
                "As tickets are dispatched, operators get push notifications on their mobile devices.",
            },
            {
              title: "Secure Access",
              blurb:
                "Before being sent an RFO, operators are required to verify their email, ensuring data accuracy, trust, and security.",
            },
          ]}
        />
        <Feature
          color={theme.palette.primary.main}
          title={"Efficient Digital Tickets"}
          svg={<InternetSVG height={70} width={70} fill={"white"} />}
          breakDown={[
            {
              title: "Diverse Image Support",
              blurb:
                "Accommodates image formats across IOS and android devices, maximizing ease of user for operators and dispatchers",
            },
            {
              title: "Enhanced Security Protocols",
              blurb:
                "Along with email verification, a timely expiry system for ticket access, and unique codes for data access are implemented. Data transfer is secure, ensuring both safety and authenticity.",
            },
          ]}
        />
        <Feature
          color={theme.palette.secondary.main}
          title={"User-Centric Design & Ease of Use"}
          svg={<SmileyFaceSVG height={70} width={70} fill={"white"} />}
          breakDown={[
            {
              title: "Inclusive Video Tutorials",
              blurb:
                "Detailed guides are available in Punjabi and English making sure operators and dispatcher can communicate easily.",
            },
            {
              title: "Feedback-Driven Interface:",
              blurb:
                "The UI is not only straightforward but also provides instant feedback on user actions, amplifying usability and accessibility.",
            },
          ]}
        />
      </FeaturesContainer>
    </div>
  );
};

export default Features;
