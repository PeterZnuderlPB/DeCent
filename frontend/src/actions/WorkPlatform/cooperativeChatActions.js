import { message } from 'antd';
import {
    FETCH_COOPERATIVE_CHAT_REQUEST,
    FETCH_COOPERATIVE_CHAT_SUCCESS,
    FETCH_COOPERATIVE_CHAT_FAILURE
} from '../types';
import { apiCall } from '../../apis';
import MiscUtilities from '../../utilities/MiscUtilities';

export const FetchCooperativeChatAction = (visibleFields, filters) => (dispatch, getState) => {
    dispatch(FetchCooperativeChatRequestAction());
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

    apiCall.get('cooperativechat/', {
        params: {
            settings
        },
        headers: {
            Authorization: `${user.auth.token.token_type} ${user.auth.token.access_token}`
        }
    })
    .then(res => {
        message.success('[CooperativeChat] Success');
        dispatch(FetchCooperativeChatSuccessAction(res.data));
    })
    .catch(err => {
        message.error('[CooperativeChat] Error');
        dispatch(FetchCooperativeChatFailureAction());
    })
}

// Static actions
export const FetchCooperativeChatRequestAction = () => {
    return {
        type: FETCH_COOPERATIVE_CHAT_REQUEST,
        payload: null
    }
}

export const FetchCooperativeChatSuccessAction = data => {
    return {
        type: FETCH_COOPERATIVE_CHAT_SUCCESS,
        payload: data
    }
}

export const FetchCooperativeChatFailureAction = () => {
    return {
        type: FETCH_COOPERATIVE_CHAT_FAILURE,
        payload: null
    }
}