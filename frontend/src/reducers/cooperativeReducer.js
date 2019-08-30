import {
    FETCH_COOPERATIVE_START,
    FETCH_COOPERATIVE_SUCCESS,
    FETCH_COOPERATIVE_FAIL
} from '../actions/types';

const INTIAL_STATE = {
    cooperativeData: [],
    cooperativeLoading: true
}

export default (state = INTIAL_STATE, action) => {
    switch(action.type) {
        case FETCH_COOPERATIVE_START:
            return { ...state, cooperativeLoading: true };
        case FETCH_COOPERATIVE_SUCCESS:
            return action.payload;
        case FETCH_COOPERATIVE_FAIL:
            return { ...state, cooperativeLoading: false }
        default:
            return state;
    }
}