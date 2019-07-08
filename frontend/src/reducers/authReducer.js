import googleAuthRducer from './googleAuthReducer'
import{
    LOGIN_START,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    GET_USER_START,
    GET_USER_SUCCESS,
    GET_USER_FAIL,
    REGISTRATION_START,
    REGISTRATION_SUCCESS,
    REGISTRATION_FAIL,
    LOGOUT_START,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
} from '../actions/types'

const INITIAL_STATE = {
    err:'',
    isAuthenticating: null,
    isAuthenticated: null,
    userInfo:{
        username: '',
        email: '',
        first_name: '',
        last_name:''
    },
    token: {access_token: null, token_type: null, refresh_token:null},
    google_token: {},
}

export default (state = INITIAL_STATE, action) =>{
    switch(action.type){
        case LOGIN_START:
            return{ ...state, isAuthenticating:true, isAuthenticated: false, err: null }
        case LOGIN_SUCCESS:
            return{ ...state, isAuthenticating: false, isAuthenticated: true, token: action.payload}
        case LOGIN_FAIL:
            return{ ...state, isAuthenticating: false, isAuthenticated:false, err: action.payload }
        case GET_USER_START:
            return{ ...state }
        case GET_USER_SUCCESS:
            return{ ...state, isAuthenticating:false, isAuthenticated: true, userInfo: action.payload.data.user, token: action.payload.token}
        case GET_USER_FAIL:
            return{ ...state, err: action.payload }
        case REGISTRATION_START:
            return{ ...state }
        case REGISTRATION_SUCCESS:
            return{ ...state, token: action.payload.token }
        case REGISTRATION_FAIL:
            return{ ...state , err: action.payload}
        case LOGOUT_START:
            return{ ...state }
        case LOGOUT_SUCCESS:
            return{ ...INITIAL_STATE }
        case LOGOUT_FAIL:
            return{ ...state, err: action.payload }
        default:
            return state;
    }
}