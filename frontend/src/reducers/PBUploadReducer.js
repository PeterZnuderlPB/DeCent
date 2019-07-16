import { UPLOAD_FILE_START, UPLOAD_FILE_SUCCESS, UPLOAD_FILE_FAIL, UPLOAD_FILE_ADD } from '../actions/types';

// Add files
const INITIAL_STATE = {
    loading: false,
    files: []
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case UPLOAD_FILE_START:
            return action.payload;
        case UPLOAD_FILE_SUCCESS:
            return action.payload;
        case UPLOAD_FILE_FAIL:
            return action.payload;
        case UPLOAD_FILE_ADD:
            return action.payload;
        default:
            return state;
    }
}