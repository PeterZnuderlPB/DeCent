import {
    FETCH_ALL_COOPERATIVE_START,
    FETCH_ALL_COOPERATIVE_SUCCESS,
    FETCH_ALL_COOPERATIVE_FAIL,
    FETCH_COOPERATIVE_START,
    FETCH_COOPERATIVE_SUCCESS,
    FETCH_COOPERATIVE_FAIL,
    SET_COOPERATIVE_WORKER_START,
    SET_COOPERATIVE_WORKER_SUCCESS,
    SET_COOPERATIVE_WORKER_FAIL
} from '../../actions/types';

const INTIAL_STATE = {
    cooperativeAllData: [],
    cooperativeAllLoading: true,
    cooperativeData: [],
    cooperativeLoading: true,
    cooperativeWorker: []
}

export default (state = INTIAL_STATE, action) => {
    switch(action.type) {
        case FETCH_ALL_COOPERATIVE_START:
            return { ...state, cooperativeAllLoading: true };
        case FETCH_ALL_COOPERATIVE_SUCCESS:
            return { ...state, cooperativeAllLoading: false, cooperativeAllData: action.payload };
        case FETCH_ALL_COOPERATIVE_FAIL:
            return { ...state, cooperativeAllLoading: false };
        case FETCH_COOPERATIVE_START:
            return { ...state, cooperativeLoading: true };
        case FETCH_COOPERATIVE_SUCCESS:
            return { ...state, cooperativeLoading: false, cooperativeData: action.payload };
        case FETCH_COOPERATIVE_FAIL:
            return { ...state, cooperativeLoading: false };
        case SET_COOPERATIVE_WORKER_START:
            return { ...state };
        case SET_COOPERATIVE_WORKER_SUCCESS:
            return { ...state, cooperativeWorker: action.payload };
        case SET_COOPERATIVE_WORKER_FAIL:
            return { ...state };
        default:
            return state;
    }
}