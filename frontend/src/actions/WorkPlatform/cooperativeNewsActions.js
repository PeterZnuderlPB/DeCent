import { message } from 'antd';
import {
    FETCH_COOPERATIVE_NEWS_START,
    FETCH_COOPERATIVE_NEWS_SUCCESS,
    FETCH_COOPERATIVE_NEWS_FAIL,
    SET_SINGLE_COOPERATIVE_NEWS_START,
    SET_SINGLE_COOPERATIVE_NEWS_SUCCESS,
    SET_SINGLE_COOPERATIVE_NEWS_FAIL
} from '../types';
import MiscUtilities from '../../utilities/MiscUtilities';
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
    
    params = MiscUtilities.SetRequestFilters(params, filters);

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

export const SetSignleCooperativeNewsAction = newsId => (dispatch, getState) => {
    dispatch(SetSingleCooperativeNewsStartAction());
    const { cooperativeNews } = getState();

    let singleData = cooperativeNews.data.data.find(cn => cn.id === newsId);

    if (singleData === undefined) {
        dispatch(SetSingleCooperativeNewsFailAction());
        return;
    }

    dispatch(SetSingleCooperativeNewsSuccesAction(singleData));
}

// Static actions
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

export const SetSingleCooperativeNewsStartAction = () => {
    return {
        type: SET_SINGLE_COOPERATIVE_NEWS_START,
        payload: null
    }
}

export const SetSingleCooperativeNewsSuccesAction = data => {
    return {
        type: SET_SINGLE_COOPERATIVE_NEWS_SUCCESS,
        payload: data
    }
}

export const SetSingleCooperativeNewsFailAction = () => {
    return {
        type: SET_SINGLE_COOPERATIVE_NEWS_FAIL,
        payload: null
    }
}