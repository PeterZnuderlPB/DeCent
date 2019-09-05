import { message } from 'antd';
import {
    FETCH_COOPERATIVE_CHAT_REQUEST,
    FETCH_COOPERATIVE_CHAT_SUCCESS,
    FETCH_COOPERATIVE_CHAT_FAILURE,
    ADD_COOPERATIVE_CHAT_REQUEST,
    ADD_COOPERATIVE_CHAT_SUCCESS,
    ADD_COOPERATIVE_CHAT_FAILURE
} from '../types';
import { apiCall } from '../../apis';
import { COOPERATIVE_DASHBOARD_COOPERATIVE_CHAT } from '../../constants';
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

export const AddCooperativeChatAction = (data, cooperativeId) => (dispatch, getState) => {
    dispatch(AddCooperativeChatRequestAction());
    const { user } = getState();

    const cooperativeChatData = {
        id: 0,
        message: data,
        message_sent: new Date(),
        account: user.auth.userInfo.id,
        cooperative: cooperativeId,
        is_active: true,
        is_locked: false
    }

    const conConfig = {
        headers: {
            Authorization: `${user.auth.token.token_type} ${user.auth.token.access_token}`
        }
    }

    apiCall.post('cooperativechat/', cooperativeChatData, conConfig)
    .then(() => {
        dispatch(AddCooperativeChatSuccessAction());
        dispatch(FetchCooperativeChatAction(COOPERATIVE_DASHBOARD_COOPERATIVE_CHAT, { cooperative__id: user.auth.userInfo.active_cooperative }));
    })
    .catch(() => {
        dispatch(AddCooperativeChatFailureAction());
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

export const AddCooperativeChatRequestAction = () => {
    return {
        type: ADD_COOPERATIVE_CHAT_REQUEST,
        payload: null
    }
}

export const AddCooperativeChatSuccessAction = () => {
    return {
        type: ADD_COOPERATIVE_CHAT_SUCCESS,
        payload: null
    }
}

export const AddCooperativeChatFailureAction = () => {
    return {
        type: ADD_COOPERATIVE_CHAT_FAILURE,
        payload: null
    }
}