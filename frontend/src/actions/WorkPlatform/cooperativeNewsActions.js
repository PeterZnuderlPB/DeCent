import { message } from 'antd';
import {
    FETCH_COOPERATIVE_NEWS_START,
    FETCH_COOPERATIVE_NEWS_SUCCESS,
    FETCH_COOPERATIVE_NEWS_FAIL
} from '../types';
import con from '../../apis';

export const FetchCooperativeNewsAction = (visibleFields, filters) => (dispatch, getState) => {
    dispatch(FetchCooperativeNewsStartAction());
    const { user } = getState();

    let params = {
        results: 1000,
        page: 1,
        sortOrder: [],
        sortField: [],
        visibleFields: [],
        filters: {}
    };
    
    if (filters !== undefined) {
        if ('cacheEnabled' in filters) {
            params = {
                ...params,
                cacheEnabled: filters['cacheEnabled']
            }
        } else {
            params.filters = filters;
        }
    }

    params.visibleFields = visibleFields;

    let settings = JSON.stringify(params);

    con.get('api/cooperativenews/', {
        params: {
            settings
        },
        headers: {
            Authorization: `${user.auth.token.token_type} ${user.auth.token.access_token}`
        }
    })
    .then(res => {
        message.success('[CooperativeNews] Success');
        dispatch(FetchCooperativeNewsSuccessAction(res.data));
    })
    .catch(err => {
        message.error('[CooperativeNews] Error');
        dispatch(FetchCooperativeNewsFailAction());
    })
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