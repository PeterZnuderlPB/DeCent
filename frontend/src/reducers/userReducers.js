import { combineReducers } from "redux";
import authReducer from './authReducer';
import usersettingReducer from './usersettingsReducer';
import googleInfoReducer from './googleAuthReducer'

export default combineReducers({
    auth: authReducer,
    user_settings: usersettingReducer,
    google_auth: googleInfoReducer
})