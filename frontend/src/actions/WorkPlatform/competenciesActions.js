import { message } from 'antd';
import {
    FETCH_COMPETENCIES_START,
    FETCH_COMPETENCIES_SUCCESS,
    FETCH_COMPETENCIES_FAIL
} from '../types';
import MiscUtilities from '../../utilities/MiscUtilities';
import con from '../../apis';

export const FetchCompetenciesAction = (visibleFields, filters) => (dispatch, getState) => {
    dispatch(FetchCompetenciesStartAction());
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

    con.get('api/competency/', {
        params: {
            settings
        },
        headers: {
            Authorization: `${user.auth.token.token_type} ${user.auth.token.access_token}`
        }
    })
    .then(res => {
        message.success('[Competencies] Success');
        dispatch(FetchCompetenciesSuccessAction(res.data));
    })
    .catch(err => {
        message.error('[Competencies] Error');
        dispatch(FetchCompetenciesFailAction());
    })
}

// Static actions
export const FetchCompetenciesStartAction = () => {
    return {
        type: FETCH_COMPETENCIES_START,
        payload: null
    }
}

export const FetchCompetenciesSuccessAction = data => {
    return {
        type: FETCH_COMPETENCIES_SUCCESS,
        payload: data
    }
}

export const FetchCompetenciesFailAction = () => {
    return {
        type: FETCH_COMPETENCIES_FAIL,
        payload: null
    }
}