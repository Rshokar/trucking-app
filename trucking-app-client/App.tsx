import { StatusBar } from 'expo-status-bar';
import Welcome from './screens/Welcome';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';


export default function App() {
  let [fontsLoaded] = useFonts({
    "lato-Bold": require("./assets/fonts/Lato-Bold.ttf"),
    "lato-Regular": require("./assets/fonts/Lato-Bold-Regular.ttf"),
  })


  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Welcome />
  );
}