import { CHANGE_LANG } from '../actions/types';

const INITIAL_STATE = 'en'

export default (state = INITIAL_STATE, action) =>{
    switch(action.type){
        case CHANGE_LANG:
            return action.payload;
        default:
            return state;
    }
}