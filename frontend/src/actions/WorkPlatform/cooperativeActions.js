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
    SET_COOPERATIVE_WORKER_FAIL
} from '../types';
import MiscUtilities from '../../utilities/MiscUtilities';
import con from '../../apis';

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