import { message } from 'antd';
import {
    FETCH_COOPERATIVE_ENROLLMENT_START,
    FETCH_COOPERATIVE_ENROLLMENT_SUCCESS,
    FETCH_COOPERATIVE_ENROLLMENT_FAIL,
    SET_SINGLE_COOPERATIVE_ENROLLMENT_START,
    SET_SINGLE_COOPERATIVE_ENROLLMENT_SUCCESS,
    SET_SINGLE_COOPERATIVE_ENROLLMENT_FAIL
} from '../types';
import { COOPERATIVE_MAMANGMENT_APPLICATION_LIST } from '../../constants';
import con from '../../apis';
import { FetchCooperativeAction } from './cooperativeActions';

export const FetchCooperativeEnrollmentAction = (cooperativeId, visibleFields) => (dispatch, getState) => {
    dispatch(FetchCooperativeEnrollmentStartAction());
    const { user } = getState();

    let params = {
        results: 1000,
        page: 1,
        sortOrder: [],
        sortField: [],
        visibleFields: [],
        filters: {
            cooperative__id: cooperativeId
        }
    };

    params.visibleFields = visibleFields;

    let settings = JSON.stringify(params);

    con.get('api/cooperativeenrollment/', {
        params: {
            settings
        },
        headers: {
            Authorization: `${user.auth.token.token_type} ${user.auth.token.access_token}`
        }
    })
    .then(res => {
        message.success('[CooperativeEnrollment] Success');
        dispatch(FetchCooperativeEnrollmentSuccessAction(res.data));
    })
    .catch(err => {
        message.error('[CooperativeEnrollment] Error');
        dispatch(FetchCooperativeEnrollmentFailAction());
    })
}

export const AcceptCooperativeEnrollmentAction = (enrollerId, accept) => (dispatch, getState) => {
    const { user } = getState();

    let uri = accept === undefined ? `api/cooperativeenrollment/${enrollerId}` : `api/cooperativeenrollment/${enrollerId}?accept=true`; 

    con.delete(uri, {
        headers: {
            Authorization: `${user.auth.token.token_type} ${user.auth.token.access_token}`
        }
    })
    .then(() => {
        dispatch(FetchCooperativeEnrollmentAction(user.auth.userInfo.active_cooperative, COOPERATIVE_MAMANGMENT_APPLICATION_LIST));
        dispatch(FetchCooperativeAction());
    })
    .catch(err => {
        console.log("[CooperativeEnrollment] DELETE Error => ", err);
    });
}

export const SetSingleCooperativeEnrollmentAction = enrollmentId => (dispatch, getState) => {
    dispatch(SetSingleCooperativeEnrollmentStartAction());
    const { cooperativeEnrollment } = getState();

    let singleData = cooperativeEnrollment.data.data.find(c => c.id === enrollmentId);

    if (singleData === undefined) {
        dispatch(SetSingleCooperativeEnrollmentFailAction());
        return;
    }

    const singleDataPayload = {
        singleData: singleData,
        singleLoading: false
    };

    dispatch(SetSingleCooperativeEnrollmentSuccesstAction(singleDataPayload));
}

// Basic actions
export const FetchCooperativeEnrollmentStartAction = () => {
    return {
        type: FETCH_COOPERATIVE_ENROLLMENT_START,
        payload: null
    }
}

export const FetchCooperativeEnrollmentSuccessAction = data => {
    return {
        type: FETCH_COOPERATIVE_ENROLLMENT_SUCCESS,
        payload: {
            data: data,
            loading: false
        }
    }
}

export const FetchCooperativeEnrollmentFailAction = () => {
    return {
        type: FETCH_COOPERATIVE_ENROLLMENT_FAIL,
        payload: null
    }
}

export const SetSingleCooperativeEnrollmentStartAction = () => {
    return {
        type: SET_SINGLE_COOPERATIVE_ENROLLMENT_START,
        payload: null
    }   
}

export const SetSingleCooperativeEnrollmentSuccesstAction = data => {
    return {
        type: SET_SINGLE_COOPERATIVE_ENROLLMENT_SUCCESS,
        payload: {
            singleLoading: false,
            singleData: data
        }
    }   
}

export const SetSingleCooperativeEnrollmentFailAction = () => {
    return {
        type: SET_SINGLE_COOPERATIVE_ENROLLMENT_FAIL,
        payload: null
    }   
}