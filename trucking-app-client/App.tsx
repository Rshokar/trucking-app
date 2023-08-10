import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { PaperProvider, DefaultTheme } from 'react-native-paper';
import RoofStack from "./navigators/RoofStack";
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
    <RoofStack />
  </PaperProvider>
}