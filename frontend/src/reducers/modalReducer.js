import{
    MODAL_SHOW,
    MODAL_HIDE,
} from '../actions/types'

const INITIAL_STATE = {
    visible: false,
    content:'Llorem impsum dolor sit amet...'
}

export default (state = INITIAL_STATE, action) =>{
    switch(action.type){
        case MODAL_SHOW:
            return{ ...state, "visible": true, "content": action.payload}
        case MODAL_HIDE:
            return{ ...state, "visible": false, "content": ""}
        default:
            return state;
    }
}