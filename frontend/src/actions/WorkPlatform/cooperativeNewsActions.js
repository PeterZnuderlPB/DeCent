import {
    FETCH_COOPERATIVE_NEWS_START,
    FETCH_COOPERATIVE_NEWS_SUCCESS,
    FETCH_COOPERATIVE_NEWS_FAIL
} from './types';

export const FetchCooperativeNewsAction = () => {
    
}

export const FetchCooperativeNewsStartAction = () => {
    return {
        type: FETCH_COOPERATIVE_NEWS_START,
        payload: null
    }
}

export const FetchCooperativeNewsSuccessAction = data => {
    return {
        type: FETCH_COOPERATIVE_NEWS_SUCCESS,
        payload: data
    }
}

export const FetchCooperativeNewsFailAction = () => {
    return {
        type: FETCH_COOPERATIVE_NEWS_FAIL,
        payload: null
    }
}