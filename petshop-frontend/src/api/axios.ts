// src/api/axios.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Certifique-se de que essa URL está correta
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;