import{
    FETCH_TABLE_START,
    FETCH_TABLE_SUCCESS,
    FETCH_TABLE_FAIL,
} from '../actions/types'

const INITIAL_STATE = {
    
}

export default (state = INITIAL_STATE, action) =>{
    switch(action.type){
        case FETCH_TABLE_START:
            return state;
        case FETCH_TABLE_SUCCESS:
            return {...state};
        case FETCH_TABLE_FAIL:
            return state;
        default:
            return state;
    }
}