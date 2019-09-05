import { message } from 'antd';
import {
    FETCH_CONTRACTS_REQUEST,
    FETCH_CONTRACTS_SUCCESS,
    FETCH_CONTRACTS_FAILURE
} from '../types';
import MiscUtilities from '../../utilities/MiscUtilities';
import con from '../../apis';

export const FetchContractsAction = (visibleFields, filters) => (dispatch, getState) => {
    dispatch(FetchContractsRequestAction());
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

    con.get('api/contract/', {
        params: {
            settings
        },
        headers: {
            Authorization: `${user.auth.token.token_type} ${user.auth.token.access_token}`
        }
    })
    .then(res => {
        message.success('[Contract] Success');
        dispatch(FetchContractsSuccessAction(res.data));
    })
    .catch(err => {
        message.error('[Contract] Error');
        dispatch(FetchContractsFailureAction());
    })
}

// Static actions
export const FetchContractsRequestAction = () => {
    return {
        type: FETCH_CONTRACTS_REQUEST,
        payload: null
    }
}

export const FetchContractsSuccessAction = data => {
    return {
        type: FETCH_CONTRACTS_SUCCESS,
        payload: data
    }
}

export const FetchContractsFailureAction = () => {
    return {
        type: FETCH_CONTRACTS_FAILURE,
        payload: null
    }
}