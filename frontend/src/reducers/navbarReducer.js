import { TOGGLE_NAVBAR } from '../actions/types';

const INITIAL_STATE = false

export default (state = INITIAL_STATE, action) =>{
    switch(action.type){
        case TOGGLE_NAVBAR:
            return action.payload;
        default:
            return state;
    }
}