import React from "react";
import Step from "./components/Step";
import styled from "styled-components";
import { Container } from "../../../../components/shared";
import DownloadApp from "../../../../components/DownloadApp/DownloadApp";
import DownloadSVG from "../../../../components/SVGS/DownloadSVG";
import { useTheme } from "@mui/material";
import ExcavatorSVG from "../../../../components/SVGS/ExcavatorSVG";
import OperatorSVG from "../../../../components/SVGS/OperatorSVG";
import DispatchBookSVG from "../../../../components/SVGS/DispatchBookSVG";
import RelaxSVG from "../../../../components/SVGS/RelaxSVG";
import { useMediaQuery } from "react-responsive";
import { device } from "../../../../components/devices";

const StepsContainer = styled(Container)`
  flex-direction: column;
`;

const Steps = () => {
  const theme = useTheme();
  const isLaptop = useMediaQuery({ query: device.laptop });
  const isDesktop = useMediaQuery({ query: device.desktop });
  let svgSize = "20rem";

  if (isLaptop) svgSize = "300px";
  if (isDesktop) svgSize = "400px";

  return (
    <StepsContainer>
      <Step
        color={theme.palette.primary.main}
        breakColor={theme.palette.secondary.main}
        step={{
          callToActionButtons: (
            <DownloadApp
              iosButtonStyle={{ border: "1px solid white" }}
              playStoreButtonStyle={{ border: "1px solid white" }}
            />
          ),
          callToAction: "Download the app and register",
          stepName: "Step One",
          title: "Download the app",
          SVG: <DownloadSVG width={svgSize} height={svgSize} stroke="white" />,
        }}
      />
      <Step
        color={theme.palette.secondary.main}
        breakColor={theme.palette.primary.main}
        step={{
          callToAction:
            "Categorize dispatches by customer and date, allowing for easy search and billing.",
          stepName: "Step Two",
          title: "Add your customers",
          SVG: (
            <ExcavatorSVG
              width={svgSize}
              height={svgSize}
              stroke="white"
              fill="none"
              strokeWidth="1"
            />
          ),
        }}
      />
      <Step
        color={theme.palette.primary.main}
        breakColor={theme.palette.secondary.main}
        step={{
          callToAction:
            "Send operators RFO's (Request for operators) directly to operator emails in a safe and secure manner.",
          stepName: "Step Three",
          title: "Add your operators",
          SVG: (
            <OperatorSVG
              width={svgSize}
              height={svgSize}
              stroke="white"
              fill="white"
              strokeWidth=".25"
            />
          ),
        }}
      />
      <Step
        color={theme.palette.secondary.main}
        breakColor={theme.palette.primary.main}
        step={{
          callToAction:
            "Create a dispatch and add RFO (Request for Operators). Emails will automatically be sent to operators allowing you to focus on your business.",
          stepName: "Step Four",
          title: "Send Dispatches",
          SVG: (
            <DispatchBookSVG
              width={svgSize}
              height={svgSize}
              stroke="white"
              strokeWidth="1"
            />
          ),
        }}
      />
      <Step
        color={theme.palette.primary.main}
        breakColor={theme.palette.secondary.main}
        step={{
          callToAction:
            "Instead of collecting paper tickets, operators can now take pictures of billing information and send them via Tare Ticketing!",
          stepName: "Step Five",
          title: "Sit Back",
          SVG: (
            <RelaxSVG
              width={svgSize}
              height={svgSize}
              stroke="white"
              strokeWidth="1"
              fill="none"
            />
          ),
        }}
      />
    </StepsContainer>
  );
};

export default Steps;
