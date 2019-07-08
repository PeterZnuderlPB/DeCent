import axios from 'axios';

export var baseUrlHttp = "http://localhost:8000/";
export var apiUrlHttp = "http://localhost:8000/api/";

export default axios.create({
    baseURL: baseUrlHttp
})