import axios from "axios";


const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    }
})

axiosClient.interceptors.response.use(response => {
    return response;
}, error => {
    return error.response, error.response.status;

})

export default axiosClient 