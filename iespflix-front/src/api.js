import axios from "axios";

const api = axios.create({
    baseURL: "https://iespflix-api.onrender.com"
});

export default api;