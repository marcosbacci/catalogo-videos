import axios from 'axios';

export const httpVideo = axios.create({
    baseURL: "http://localhost:8000/api"
});