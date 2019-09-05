import {
    FETCH_ALL_COOPERATIVE_START,
    FETCH_ALL_COOPERATIVE_SUCCESS,
    FETCH_ALL_COOPERATIVE_FAIL,
    FETCH_COOPERATIVE_START,
    FETCH_COOPERATIVE_SUCCESS,
    FETCH_COOPERATIVE_FAIL,
    SET_COOPERATIVE_WORKER_START,
    SET_COOPERATIVE_WORKER_SUCCESS,
    SET_COOPERATIVE_WORKER_FAIL,
    SET_COOPERATIVE_CHAT_START,
    SET_COOEPRATIVE_CHAT_SUCCESS,
    SET_COOPERATIVE_CHAT_FAIL,
    RESET_COOPERATIVE_CHAT
} from '../../actions/types';

const INTIAL_STATE = {
    cooperativeAllData: [],
    cooperativeAllLoading: true,
    cooperativeData: [],
    cooperativeLoading: true,
    cooperativeWorker: [],
    cooperativeChat: null,
    cooperativeChatLoading: true
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
        case SET_COOPERATIVE_CHAT_START:
            return { ...state, cooperativeChatLoading: true };
        case SET_COOEPRATIVE_CHAT_SUCCESS:
            return { ...state, cooperativeChatLoading: false, cooperativeChat: action.payload };
        case SET_COOPERATIVE_CHAT_FAIL:
            return { ...state, cooperativeChatLoading: false };
        case RESET_COOPERATIVE_CHAT:
            return { ...state, cooperativeChatLoading: true, cooperativeChat: null };
        default:
            return state;
    }
}