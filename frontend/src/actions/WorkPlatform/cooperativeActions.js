import { message } from 'antd';
import {
    FETCH_ALL_COOPERATIVE_START,
    FETCH_ALL_COOPERATIVE_SUCCESS,
    FETCH_ALL_COOPERATIVE_FAIL,
    FETCH_COOPERATIVE_START,
    FETCH_COOPERATIVE_SUCCESS,
    FETCH_COOPERATIVE_FAIL,
    SET_COOPERATIVE_WORKER_START,
    SET_COOPERATIVE_WORKER_SUCCESS,
    SET_COOPERATIVE_WORKER_FAIL,
    SET_COOPERATIVE_CHAT_START,
    SET_COOEPRATIVE_CHAT_SUCCESS,
    SET_COOPERATIVE_CHAT_FAIL
} from '../types';
import { FetchCooperativeChatAction } from './cooperativeChatActions'
import { COOPERATIVE_DASHBOARD_COOPERATIVE_CHAT } from '../../constants';
import MiscUtilities from '../../utilities/MiscUtilities';
import con from '../../apis';
import Pusher from 'pusher-js';

export const FetchAllCooperativesAction = (visibleFields, filters) => (dispatch, getState) => {
    dispatch(FetchAllCooeprativesStartAction());
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

    con.get('api/cooperative/', {
        params: {
            settings
        },
        headers: {
            Authorization: `${user.auth.token.token_type} ${user.auth.token.access_token}`
        }
    })
    .then(res => {
        message.success('[Cooperative] Success');
        dispatch(FetchAllCooperativesSuccessAction(res.data));
    })
    .catch(err => {
        message.error('[Cooperative] Error');
        dispatch(FetchAllCooperativesFailAction());
    })
}

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

export const SetCooperativeWorkerAction = workerId => (dispatch, getState) => {
    dispatch(SetCooperativeWorkerStartAction());
    const { cooperative } = getState();

    const worker = cooperative.cooperativeData.data.workers.find(w => w.id === workerId);

    if (worker === undefined) {
        dispatch(SetCooperativeWorkerFailAction());
        return;
    }

    dispatch(SetCooperativeWorkerSuccessAction(worker));
}

export const SetCooperativeChatAction = () => (dispatch, getState) => {
    dispatch(SetCooperativeChatStartAction())
    const { user } = getState();

    if (user.auth.userInfo.active_cooperative === 0) {
        dispatch(SetCooperativeChatFailAction())
        return;
    }
    
    const pusher = new Pusher('a9c032941cf5188550e7', {
        cluster: 'eu',
        forceTLS: true
    });

    pusher.subscribe('chat_channel').bind(`cooperative_chat_${user.auth.userInfo.active_cooperative}`, data => {
        if('UpdateChat' in data) {
            if (parseInt(data['UpdateChat']) !== user.auth.userInfo.id)
            dispatch(FetchCooperativeChatAction(COOPERATIVE_DASHBOARD_COOPERATIVE_CHAT, { cooperative__id: user.auth.userInfo.active_cooperative }));
        }
    });

    dispatch(SetCooperativeChatSuccessAction(pusher));
}

// Static actions
export const FetchCooperativeStartAction = () => {
    return {
        type: FETCH_COOPERATIVE_START,
        payload: null
    }
}

export const FetchCooperativeSuccessAction = data => {
    return {
        type: FETCH_COOPERATIVE_SUCCESS,
        payload: data
    }
}

export const FetchCooperativeFailAction = () => {
    return {
        type: FETCH_COOPERATIVE_FAIL,
        payload: null
    }
}

export const SetCooperativeWorkerStartAction = () => {
    return {
        type: SET_COOPERATIVE_WORKER_START,
        payload: null
    }
}

export const SetCooperativeWorkerSuccessAction = data => {
    return {
        type: SET_COOPERATIVE_WORKER_SUCCESS,
        payload: data
    }
}

export const SetCooperativeWorkerFailAction = () => {
    return {
        type: SET_COOPERATIVE_WORKER_FAIL,
        payload: null
    }
}

export const FetchAllCooeprativesStartAction = () => {
    return {
        type: FETCH_ALL_COOPERATIVE_START,
        payload: null
    }
}

export const FetchAllCooperativesSuccessAction = data => {
    return {
        type: FETCH_ALL_COOPERATIVE_SUCCESS,
        payload: data
    }
}

export const FetchAllCooperativesFailAction = () => {
    return {
        type: FETCH_ALL_COOPERATIVE_FAIL,
        payload: null
    }
}

export const SetCooperativeChatStartAction = () => {
    return {
        type: SET_COOPERATIVE_CHAT_START,
        payload: null
    }
}

export const SetCooperativeChatSuccessAction = data => {
    return {
        type: SET_COOEPRATIVE_CHAT_SUCCESS,
        payload: data
    }
}

export const SetCooperativeChatFailAction = () => {
    return {
        type: SET_COOPERATIVE_CHAT_FAIL,
        payload: null
    }
}