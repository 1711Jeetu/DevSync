import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/api',
    withCredentials: true, // VERY IMPORTANT! This tells axios to send cookies.
});

export default api;