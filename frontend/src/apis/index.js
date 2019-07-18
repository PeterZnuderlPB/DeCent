import axios from 'axios';

export var baseUrlHttp = "http://localhost:8000/";
export var apiUrlHttp = "http://localhost:8000/api/";

export const django_client_id = "WXIb0nkguOs8QPz8X2GBrXrn4vPoj2gql80RhKmZ";
export const django_client_secret =
  "3cSH7Z97RSfSZP4Jy2DZEhApJg8Xo1g3YXMVqYHrV9kOE9uM03pdiAByJyLKzuccyQQYcmFapW5SMlBFnnbqObYX3zYUvwoGnGJUp4ISL3T6fbcre9YvqmM3qgcC1lRx";

export const google_client_id = "254472747355-6umtrkcedqn00tg7ec17l705ftttam0r.apps.googleusercontent.com"

export var apiCall = axios.create(
    {
        baseURL: apiUrlHttp
    })

export default axios.create({
    baseURL: baseUrlHttp
})