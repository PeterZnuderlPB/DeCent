import axios from 'axios';

export var baseUrlHttp = "http://localhost:8000/";
export var apiUrlHttp = "http://localhost:8000/api/";

export const django_client_id = "t5Atz5P7YfpN0Ul2cDUWbAwMwjQfCfza5GmagZZu";
export const django_client_secret =
  "FUTJYMX0xGp22rBHitfcL747Yypg3nf79azyyfITHjqueee6E6sBVeU4bwh8EBSDLPCbMKlTHTBasrvLw7tQxVullWYPY505OYI6qDMXNEM16gBp4GCcrlp5D5vb2T6N";

export const google_client_id = "254472747355-6umtrkcedqn00tg7ec17l705ftttam0r.apps.googleusercontent.com"

export var apiCall = axios.create(
    {
        baseURL: apiUrlHttp
    })

export default axios.create({
    baseURL: baseUrlHttp
})