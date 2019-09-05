import {
    FETCH_COOPERATIVE_CHAT_REQUEST,
    FETCH_COOPERATIVE_CHAT_SUCCESS,
    FETCH_COOPERATIVE_CHAT_FAILURE
} from '../../actions/types';

const INITIAL_STATE = {
    data: [],
    loading: true
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_COOPERATIVE_CHAT_REQUEST:
            return { ...state, loading: true };
        case FETCH_COOPERATIVE_CHAT_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case FETCH_COOPERATIVE_CHAT_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
}