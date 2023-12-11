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
import { BaseProps } from "../../../types";
import { StepsSection, StepsSectionContents } from "./styles";

const HowItWorks = ({ id }: BaseProps) => {
  const theme = useTheme();
  const isLaptop = useMediaQuery({ query: device.laptop });
  const isDesktop = useMediaQuery({ query: device.desktop });
  let svgSize = "10rem";

  return (
    <StepsSection id={id}>
      <StepsSectionContents>
        <div>
          <Step
            color={theme.palette.secondary.main}
            breakColor={theme.palette.primary.main}
            step={{
              callToAction:
                "Categorize dispatches by customer and date, allowing for easy search and billing.",
              stepName: "Step One",
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
              stepName: "Step Two",
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
                "Create a dispatch and add Request for Operators. Messages will automatically be sent to operators.",
              stepName: "Step Three",
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
                "Instead of collecting paper tickets, operators capture billing information digitally.",
              stepName: "Step Four",
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
        </div>
      </StepsSectionContents>
    </StepsSection>
  );
};

export default HowItWorks;
