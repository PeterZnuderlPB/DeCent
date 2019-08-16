import {
    FETCH_POST_START,
    FETCH_POST_SUCCESS,
    FETCH_POST_FAIL,
    UPDATE_POST_START,
    UPDATE_POST_SUCCESS,
    UPDATE_POST_FAIL,
    ADD_POST_START,
    ADD_POST_SUCCESS,
    ADD_POST_FAIL
} from '../actions/types'

const INTIAL_STATE = {
    data: [],
    loadingPost: true,
    loadingUpdate: false,
    loadingAdd: false
}

export default (state = INTIAL_STATE, action) => {
    switch(action.type) {
        case FETCH_POST_START:
            return action.payload;
        case FETCH_POST_SUCCESS:
            return action.payload;
        case FETCH_POST_FAIL:
            return state;
        case UPDATE_POST_START:
            return action.payload;
        case UPDATE_POST_SUCCESS:
            return action.payload;
        case UPDATE_POST_FAIL:
            return action.payload;
        case ADD_POST_START:
            return action.payload;
        case ADD_POST_SUCCESS:
            return action.payload;
        case ADD_POST_FAIL:
            return state;
        default:
            return state;
    }
}