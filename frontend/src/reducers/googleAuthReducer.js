import{
    GOOGLE_IS_AUTHENTICATING,
    GOOGLE_LOGOUT,
    CONVERT_GOOGLE_TOKEN_SUCCESS,
    CONVERT_GOOGLE_TOKEN_FAIL,
    GOOGLE_AUTHENTICATE_ACTION,
} from '../actions/types'

const initialState = {
    err: null,
    isAuthenticated: false,
    isAuthenticating: false,
    token_data: {}
  };
  
  function googleInfoReducer(state = initialState, action) {
    switch (action.type) {
      case GOOGLE_IS_AUTHENTICATING:
        return {
          ...state,
          isAuthenticating: true,
          err: null,
          isAuthenticated: false,
          token_data: {}
        };
      case CONVERT_GOOGLE_TOKEN_SUCCESS:
        return {
          ...state,
          err: null,
          isAuthenticated: true,
          isAuthenticating: false,
          token_data: action.goog_token
        };
      case CONVERT_GOOGLE_TOKEN_FAIL:
        return {
          ...state,
          err: action.err,
          isAuthenticated: false,
          isAuthenticating: false
        };
      case GOOGLE_LOGOUT:
        return {
          ...initialState
        };
      case GOOGLE_AUTHENTICATE_ACTION:
        return {
          ...state,
          isAuthenticated: true
        };
      default:
        return state;
    }
  }
  
  export default googleInfoReducer;
  