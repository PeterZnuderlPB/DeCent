import {
    FETCH_COOPERATIVE_CHAT_REQUEST,
    FETCH_COOPERATIVE_CHAT_SUCCESS,
    FETCH_COOPERATIVE_CHAT_FAILURE,
    ADD_COOPERATIVE_CHAT_REQUEST,
    ADD_COOPERATIVE_CHAT_SUCCESS,
    ADD_COOPERATIVE_CHAT_FAILURE
} from '../../actions/types';

const INITIAL_STATE = {
    data: [],
    loading: true,
    addLoading: false
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_COOPERATIVE_CHAT_REQUEST:
            return { ...state, loading: true };
        case FETCH_COOPERATIVE_CHAT_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case FETCH_COOPERATIVE_CHAT_FAILURE:
            return { ...state, loading: false };
        case ADD_COOPERATIVE_CHAT_REQUEST:
            return { ...state, addLoading: true };
        case ADD_COOPERATIVE_CHAT_SUCCESS:
            return { ...state, addLoading: false };
        case ADD_COOPERATIVE_CHAT_FAILURE:
            return { ...state, addLoading: false };
        default:
            return state;
    }
}