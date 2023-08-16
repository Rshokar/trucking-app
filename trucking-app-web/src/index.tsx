import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { createTheme, ThemeProvider } from '@mui/material'
import RootPage from './routes/Root/RootPage';
import ErrorPage from './routes/Error/ErrorPage';
import ValidateOperatorEmailPage from './routes/ValidateOperatorEmail/ValidateOperatorEmail'
import AuthenticateOperatorPage from './routes/AuthenticateOperator/AuthenticateOperatorPage';
import TicketPage from './routes/Ticket/TicketPage';

const theme = createTheme({
  palette: {
    primary: { main: '#ef835d' },
    secondary: { main: '#2c365a' },
    error: { main: '#C73E1D' },
    background: { default: 'lightgray' },
    text: { primary: '#000000' }
  }
})

export const colors = {
  white: '#fff',
  primary: "#ef835d",
  secondary: "#2c365a",
  tertiary: "#85c6d8",
  gray: "#d1d5db",
  graylight: "#F3F4F6",
  graydark: "#4B5563",
  accent: "#fbcd77",
  success: "#01A971",
  red: 'red'
}
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/validate_operator_email/:token',
    element: <ValidateOperatorEmailPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/operator_auth/:token',
    element: <AuthenticateOperatorPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/ticket/:token',
    element: <TicketPage />,
    errorElement: <ErrorPage />
  }
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
