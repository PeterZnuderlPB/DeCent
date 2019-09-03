import {
    FETCH_COOPERATIVE_NEWS_START,
    FETCH_COOPERATIVE_NEWS_SUCCESS,
    FETCH_COOPERATIVE_NEWS_FAIL
} from '../../actions/types';

const INITIAL_STATE = {
    loading: true,
    data: []
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_COOPERATIVE_NEWS_START:
            return { ...state, loading: true };
        case FETCH_COOPERATIVE_NEWS_SUCCESS:
            return { ...state, data: action.payload, loading: false };
        case FETCH_COOPERATIVE_NEWS_FAIL:
            return { ...state, loading: false };
        default:
            return state;
    }
}