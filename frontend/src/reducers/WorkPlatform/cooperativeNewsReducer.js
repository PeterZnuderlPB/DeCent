import {
    FETCH_COOPERATIVE_NEWS_START,
    FETCH_COOPERATIVE_NEWS_SUCCESS,
    FETCH_COOPERATIVE_NEWS_FAIL,
    SET_SINGLE_COOPERATIVE_NEWS_START,
    SET_SINGLE_COOPERATIVE_NEWS_SUCCESS,
    SET_SINGLE_COOPERATIVE_NEWS_FAIL
} from '../../actions/types';

const INITIAL_STATE = {
    loading: true,
    data: [],
    singleLoading: true,
    singleData: []
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_COOPERATIVE_NEWS_START:
            return { ...state, loading: true };
        case FETCH_COOPERATIVE_NEWS_SUCCESS:
            return { ...state, data: action.payload, loading: false };
        case FETCH_COOPERATIVE_NEWS_FAIL:
            return { ...state, loading: false };
        case SET_SINGLE_COOPERATIVE_NEWS_START:
            return { ...state, singleLoading: true };
        case SET_SINGLE_COOPERATIVE_NEWS_SUCCESS:
            return { ...state, singleData: action.payload, singleLoading: false };
        case SET_SINGLE_COOPERATIVE_NEWS_FAIL:
            return { ...state, singleLoading: false };
        default:
            return state;
    }
}