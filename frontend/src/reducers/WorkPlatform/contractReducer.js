import {
    FETCH_CONTRACTS_REQUEST,
    FETCH_CONTRACTS_SUCCESS,
    FETCH_CONTRACTS_FAILURE
} from '../../actions/types';

const INITIAL_STATE = {
    data: [],
    loading: true
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_CONTRACTS_REQUEST:
            return { ...state, loading: true };
        case FETCH_CONTRACTS_SUCCESS:
            return { ...state, data: action.payload, loading: false };
        case FETCH_CONTRACTS_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
}