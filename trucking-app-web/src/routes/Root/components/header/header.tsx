import { useState } from "react";
import styled from "styled-components";
import { Typography, useTheme } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import { device } from "../../../../components/devices";

export const FEATURES_ID = "features";
export const GET_STARTED_ID = "get_started";
export const PRICING_ID = "pricing";
export const DOWNLOAD_ID = "download";

type Props = {
  id: string;
  text: string;
};
const MenuItem = ({ id, text }: Props) => {
  const isDesktop = useMediaQuery({ query: device.laptopL });
  const theme = useTheme();

  return (
    <span>
      <a href={id}>
        <Typography
          variant={isDesktop ? "h4" : "subtitle1"}
          fontWeight={"bold"}
          color={theme.palette.primary.main}
        >
          {text}
        </Typography>
      </a>
    </span>
  );
};

const Header = () => {
  const [bar, setBar] = useState(false);

  return (
    <Container bar={bar}>
      <Logo>
        <span className="green">LOGO</span>
      </Logo>
      <Nav bar={bar}>
        <MenuItem id={`#${FEATURES_ID}`} text={"Features"} />
        <MenuItem id={`#${GET_STARTED_ID}`} text={"Get Started"} />
        <MenuItem id={`#${PRICING_ID}`} text={"Pricing"} />
        <MenuItem id={`#${DOWNLOAD_ID}`} text={"Download"} />
      </Nav>

      <div onClick={() => setBar(!bar)} className="bars">
        <div className="bar"></div>
      </div>
    </Container>
  );
};

const Container = styled.div<{ bar: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1280px;
  width: 80%;
  margin: 0 auto;
  padding: 1.5rem 0;
  position: relative;
  animation: header 500ms ease-in-out;
  @media (max-width: 840px) {
    width: 90%;
  }
  .bars {
    display: none;
  }
  @media (max-width: 640px) {
    .bars {
      width: 40px;
      height: 40px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      z-index: 100;
      .bar {
        position: absolute;
        width: 100%;
        height: 2px;
        background-color: ${(props) => (props.bar ? "transparent" : "#fff")};
        transition: all 400ms ease-in-out;
        :before,
        :after {
          content: "";
          width: 100%;
          height: 2px;
          background-color: #fff;
          position: absolute;
        }

        :before {
          transform: ${(props) =>
            props.bar ? "rotate(45deg)" : "translateY(10px)"};
          transition: all 400ms ease-in-out;
        }

        :after {
          transform: ${(props) =>
            props.bar ? "rotate(-45deg)" : "translateY(-10px)"};
          transition: all 400ms ease-in-out;
        }
      }
    }
  }
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  span {
    font-size: 1.8rem;
  }

  h1 {
    font-weight: 600;
    font-size: 1.2rem;
  }
`;
const Nav = styled.div<{ bar: boolean }>`
  display: flex;

  @media (max-width: 640px) {
    position: fixed;
    display: flex;
    flex-direction: column;
    background-color: #01be96;
    inset: 0;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    gap: 2rem;
    font-weight: 700;
    height: ${(props) => (props.bar ? "100vh" : 0)};
    transition: height 400ms ease-in-out;
    overflow: hidden;
    z-index: 100;
  }
  span {
    margin-left: 1rem;
    a {
      color: #fff;
      text-decoration: none;
      font-weight: 400;
      position: relative;
      :before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: -5px;
        height: 2px;
        background-color: #fff;
        transform: scale(0);
        transform-origin: right;
        transition: transform 400ms ease-in-out;
      }
      :hover:before {
        transform: scale(1);
        transform-origin: left;
      }
      :hover {
        opacity: 0.7;
      }
    }
  }
`;

export default Header;
