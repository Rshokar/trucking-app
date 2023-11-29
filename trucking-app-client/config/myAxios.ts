import axios from "axios";
import { FIREBASE_APP } from "./firebaseConfig";
import { getAuth, getIdToken } from "firebase/auth";
import { navigate } from "../utils/NavigationService";
import { AuthController } from "../controllers/AuthController";
import { API_URL } from "@env";

console.log("AAPI", API_URL);
// Create an instance with default settings
const myAxios = axios.create({
  baseURL: API_URL || `http://192.168.0.29:5000/v1`,
});

// // Add a request interceptor
myAxios.interceptors.response.use(
  function (config) {
    return config;
  },
  async (error) => {
    console.log("ERROR IN MYAXIOS INTERCEPTOR", error);
    const user = getAuth(FIREBASE_APP).currentUser;
    const originalRequest = error.config;

    if (user && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Force refresh the token using Firebase SDK
      const newToken = await getIdToken(user, true); // `true` forces a refresh

      try {
        AuthController.re_auth(newToken);
      } catch (err: any) {
        // Navigate to login.
        await AuthController.logout();
        navigate("Welcome", {}); // Use your desired route name
      }

      // Retry the request with the new token
      return myAxios(originalRequest);
    } else if (error.response.status === 401 && originalRequest._retry) {
      navigate("Welcome", {});
    }

    return Promise.reject(error);
  }
);

export default myAxios;
