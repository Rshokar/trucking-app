import React from "react";
import { app } from "./config/firebase";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { createTheme, ThemeProvider } from "@mui/material";
import RootPage from "./routes/Root/RootPage";
import ErrorPage from "./routes/Error/ErrorPage";
import ValidateEmail from "./routes/ValidateEmail/ValidateEmail";
import TicketPage from "./routes/Ticket/TicketPage";
import "intersection-observer";
import { Toaster } from "react-hot-toast";

const theme = createTheme({
  palette: {
    primary: { main: "#2c365a", light: '#42485D' },
    secondary: { main: "#ef835d" },
    error: { main: "#C73E1D" },
    background: { default: "#111629" },
    text: { primary: "#000000" },
  },
  typography: {
    h1: {
      fontWeight: 'bold',
      fontSize: '50px',
      color: 'white',
    },
    h2: {
      fontWeight: 'bold',
      textAlign: 'center',
    },
    h3: {
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: '35px',
      color: 'white'
    },
    h4: {
      fontSize: '20px',
      color: 'white',
      lineHeight: 1.3,
      letterSpacing: 8
    },
    h6: {
      padding: '10px',
      textAlign: 'left',
      color: 'white',
    },
    subtitle1: {
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'white'
    },
    subtitle2: {
      fontWeight: 'bold',
      textAlign: 'center'
    },
    body1: {
      color: 'white'
    },
    body2: {
      color: 'white'
    },
    button: {
      color: 'white',
      fontWeight: 'bold',
    }
  }
});

export const colors = {
  white: "#fff",
  primary: "#ef835d",
  secondary: "#2c365a",
  tertiary: "#85c6d8",
  gray: "#d1d5db",
  graylight: "#F3F4F6",
  graydark: "#4B5563",
  accent: "#fbcd77",
  success: "#01A971",
  red: "red",
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/validate_email/:token/:type',
    element: <ValidateEmail />,
    errorElement: <ErrorPage />
  },
  {
    path: "/ticket/:token",
    element: <TicketPage />,
    errorElement: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Toaster />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
