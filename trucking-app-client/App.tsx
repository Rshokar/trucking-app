import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { PaperProvider, DefaultTheme } from 'react-native-paper';
import RoofStack from "./navigators/RoofStack";
import { SnackbarProvider } from './providers/SnackBarProvider';
import React, { useEffect } from 'react';


const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    white: '#fff',
    primary: "#2c365a",
    secondary: "#ef835d",
    tertiary: "#3891A6",
    gray: "#d1d5db",
    graylight: "#F3F4F6",
    graydark: "#4B5563",
    accent: "#fbcd77",
    success: "#01A971",
    red: 'red',
  },
  fonts: {
    ...DefaultTheme.fonts,
    titleMedium: {
      fontSize: 30,
      fontWeight: 'bold',
      fontFamily: 'Lato-Regular',
    },
    bodyLarge: {
      fontSize: 20,
      letterSpacing: 1.1
    },
    bodySmall: {
      fontSize: 14,
      letterSpacing: .8,
    },
    labelLarge: {
      fontSize: 20,
      fontWeight: 'bold'
    },
    labelSmall: {
      fontSize: 15,
      fontWeight: 'bold'
    }
  }
}

export default function App() {
  let [fontsLoaded] = useFonts({
    "Lato-Bold": require("./assets/fonts/Lato-Black.ttf"),
    "Lato-Regular": require("./assets/fonts/Lato-Regular.ttf"),
  })

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return <PaperProvider theme={theme}>
    <SnackbarProvider>
      <RoofStack />
    </SnackbarProvider>
  </PaperProvider>
}