import {
    FETCH_COOPERATIVE_ENROLLMENT_START,
    FETCH_COOPERATIVE_ENROLLMENT_SUCCESS,
    FETCH_COOPERATIVE_ENROLLMENT_FAIL,
    SET_SINGLE_COOPERATIVE_ENROLLMENT_START,
    SET_SINGLE_COOPERATIVE_ENROLLMENT_SUCCESS,
    SET_SINGLE_COOPERATIVE_ENROLLMENT_FAIL
} from '../../actions/types';

const INITIAL_STATE = {
    data: [],
    loading: true,
    singleData: [],
    singleLoading: true
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case FETCH_COOPERATIVE_ENROLLMENT_START:
            return { ...state, loading: true };
        case FETCH_COOPERATIVE_ENROLLMENT_SUCCESS:
            return action.payload;
        case FETCH_COOPERATIVE_ENROLLMENT_FAIL:
            return { ...state, loading: false };
        case SET_SINGLE_COOPERATIVE_ENROLLMENT_START:
            return { ...state, singleLoading: true };
        case SET_SINGLE_COOPERATIVE_ENROLLMENT_SUCCESS:
            return { ...state, singleData: action.payload.singleData.singleData, singleLoading: action.payload.singleLoading };
        case SET_SINGLE_COOPERATIVE_ENROLLMENT_FAIL:
            return { ...state, singleLoading: false }
        default:
            return state;
    }
}