import { message } from 'antd';
import {
    FETCH_COOPERATIVE_START,
    FETCH_COOPERATIVE_SUCCESS,
    FETCH_COOPERATIVE_FAIL
} from './types';
import con from '../apis';

export const FetchCooperativeAction = () => (dispatch, getState) => {
    dispatch(FetchCooperativeStartAction());
    const { user } = getState();

    con.get(`api/cooperative/${user.auth.userInfo.active_cooperative}`, {
        headers: {
            Authorization: `${user.auth.token.token_type} ${user.auth.token.access_token}`
        }
    })
    .then(res => {
        setTimeout(() => {
            message.success('[Cooperative] Success');
            dispatch(FetchCooperativeSuccessAction(res.data));
        }, 500)
    })
    .catch(err => {
        setTimeout(() => {
            message.error('[Cooperative] Error');
            dispatch(FetchCooperativeFailAction());
        }, 500)
    });
}

export const UpdateCooperativeMembersAction = (cooperativeId, userToRemoveId) => (dispatch, getState) => {
    const { user } = getState();

    con.patch(`api/cooperative/${cooperativeId}`, {
        workerRemove__id: userToRemoveId
    },
    {
        headers: {
            Authorization: user.auth.token.token_type + " " + user.auth.token.access_token
        }
    })
    .then(() => {
        message.error('[Cooperative] Members update success');
        dispatch(FetchCooperativeAction());
    })
    .catch(() => message.error('[Cooperative] Members update error'));
}

export const FetchCooperativeStartAction = () => {
    return {
        type: FETCH_COOPERATIVE_START,
        payload: null
    }
}

export const FetchCooperativeSuccessAction = data => {
    return {
        type: FETCH_COOPERATIVE_SUCCESS,
        payload: {
            cooperativeData: data,
            loadingCooperative: false
        }
    }
}

export const FetchCooperativeFailAction = () => {
    return {
        type: FETCH_COOPERATIVE_FAIL,
        payload: null
    }
}