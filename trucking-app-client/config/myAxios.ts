import axios from "axios";

const API_URL = "http://10.0.0.134:5000/v1";

// Create an instance with default settings
const myAxios = axios.create({
    baseURL: `${API_URL}`,
});

// // Add a request interceptor
// myAxios.interceptors.request.use(function (config) {
//     // Log the headers
//     console.log('Axios Request Headers:', config.headers);
//     console.log('Axios Request URI:', config.url);

//     // Return the config so the request can proceed
//     return config;
// }, function (error) {
//     // If there's an error, you can handle it here
//     return Promise.reject(error);
// });

export default myAxios;
