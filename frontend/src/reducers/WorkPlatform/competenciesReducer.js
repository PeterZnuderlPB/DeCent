import {
    FETCH_COMPETENCIES_START,
    FETCH_COMPETENCIES_SUCCESS,
    FETCH_COMPETENCIES_FAIL
} from '../../actions/types';

const INITIAL_STATE = {
    data: [],
    loading: true
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_COMPETENCIES_START:
            return { ...state, loading: true };
        case FETCH_COMPETENCIES_SUCCESS: 
            return { ...state, data: action.payload, loading: false };
        case FETCH_COMPETENCIES_FAIL:
            return { ...state, loading: false };
        default:
            return state;
    }
}