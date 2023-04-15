import { Text } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

import RoofStack from "./navigators/RoofStack";
import Welcome from './screens/Welcome';

export default function App() {


  let [fontsLoaded] = useFonts({
    "Lato-Bold": require("./assets/fonts/Lato-Black.ttf"),
    "Lato-Regular": require("./assets/fonts/Lato-Regular.ttf"),
  })


  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return <RoofStack />
}