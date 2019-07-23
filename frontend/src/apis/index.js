import axios from 'axios';

export const baseUrlHttp = "http://localhost:8000/";
export const apiUrlHttp = "http://localhost:8000/api/";


export const django_client_id = "test";
export const django_client_secret = "test";


export const google_client_id = "254472747355-6umtrkcedqn00tg7ec17l705ftttam0r.apps.googleusercontent.com"

export var apiCall = axios.create(
    {
        baseURL: apiUrlHttp
    })

export default axios.create({
    baseURL: baseUrlHttp
})