import {
    FETCH_COOPERATIVE_ENROLLMENT_START,
    FETCH_COOPERATIVE_ENROLLMENT_SUCCESS,
    FETCH_COOPERATIVE_ENROLLMENT_FAIL
} from '../actions/types';

const INITIAL_STATE = {
    data: [],
    loading: true
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case FETCH_COOPERATIVE_ENROLLMENT_START:
            return { ...state, loading: true };
        case FETCH_COOPERATIVE_ENROLLMENT_SUCCESS:
            return action.payload;
        case FETCH_COOPERATIVE_ENROLLMENT_FAIL:
            return { ...state, loading: false };
        default:
            return state;
    }
}