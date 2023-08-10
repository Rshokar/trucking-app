import axios from "axios";

const API_URL: String = "http://10.0.0.134:5000/v1";


// Create an instance with default settings
const myAxios = axios.create({
    baseURL: `${API_URL}`,
});


export default myAxios
