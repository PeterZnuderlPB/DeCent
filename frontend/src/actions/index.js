import { message } from 'antd'
import con from '../apis'
import history from '../history'
import {
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
    MODAL_SHOW,
    MODAL_HIDE,
} from './types'
import {django_client_id, django_client_secret} from '../apis'
import{ googleLogoutAction} from './googleAuthActions'
import { USER_SETTINGS_USERPERMISSIONS_LIST } from '../constants';

//----------------
//Actions Login
//----------------

export const LoginStart = (credentials) => async dispatch =>{
    dispatch({ type: LOGIN_START});
    const bodyFormData = new FormData();
    bodyFormData.set("username", credentials.username);
    bodyFormData.set("password", credentials.password);
    bodyFormData.set("client_id", django_client_id);
    bodyFormData.set("client_secret", django_client_secret);
    bodyFormData.set("grant_type", "password");
    const response = await con.post(
        '/auth/token',
        bodyFormData
    ).catch(err => { 
        console.warn(err);
        dispatch(LoginFail(err));
    })
    if(!response){
        dispatch(LoginFail("No response."));
    }
    else{
        //console.log("Lgoin success response", response.data)
        dispatch(LoginSuccess(response.data));
    }
    
    // Disabled for /editview/post/{id} --> user logs in, the edit loads
    // history.push('/');
}

export const LoginSuccess = (token) => async dispatch => {
    message.success("Login successful!", 1);
    
    localStorage.setItem("django_access_token_conv", token.access_token);
    localStorage.setItem("django_refresh_token_conv", token.refresh_token);
    let expiryDate = Math.round(new Date().getTime() / 1000) + token.expires_in;
    localStorage.setItem("django_access_token_expires_in", expiryDate);
    console.log("Local storage",localStorage);
    dispatch({ type: LOGIN_SUCCESS, payload: token});
    dispatch(FetchUserStart(token));
}

export const LoginFail = (err_msg) => {
    console.log(err_msg)
    message.error("Login failed. Please try again.", 2);
    return { type: LOGIN_FAIL, payload: err_msg}
}

export const FetchUserStart = (token) => async dispatch =>{
    dispatch({ type: GET_USER_START});
    const header = `${token.token_type} ${token.access_token}`;
    console.log("Sending ...", header)
    const response = await con.get(
        '/api/users/', 
        {
            headers: {
                Authorization: header,
              }
        }
    ).catch(err => { 
        dispatch(FetchUserFail(err));
    })
    if(!response){
        dispatch(FetchUserFail("No response."));
    }
    else {
        console.log("USER RESP", response.data.user.active_organization_id);
        
        let params = {
            results: 1000,
            page: 1,
            sortOrder: [],
            sortField: [],
            visibleFields: [],
            filters: {
                organization__id: response.data.user.active_organization_id,
                account__id: response.data.user.id
            }
        };
      
        params.visibleFields = params.visibleFields.concat(USER_SETTINGS_USERPERMISSIONS_LIST);
      
        let settings = JSON.stringify(params);

        const permissionResponse = await con.get (
            '/api/userpermission/', 
            {
                params: {
                    settings
                },
                headers: {
                    Authorization: header,
                  }
            }
        ).catch(err => { 
           console.log("User permission fetch error: ", err);
        });

        if (!permissionResponse || permissionResponse.data.data[0] === undefined) {
            response.data.user = {
                ...response.data.user,
                permissions: {
                    permissions: "CREATE;READ;UPDATE;DELETE"
                }
            }
        } else {
            response.data.user = {
                ...response.data.user,
                permissions: permissionResponse.data.data[0]
            }
        }

        const send  = {data: response.data, token: token}
        console.log("Fetch user send to reducer", send)
        dispatch(FetchUserSuccess(send));
    }

}

export const FetchUserSuccess = (user_info) => {
    message.success("Fetch user successful!", 1);
    return{ type: GET_USER_SUCCESS, payload: user_info}
}

export const FetchUserFail = (err_msg) => {
    console.log(err_msg)
    message.error("Fetch user failed. Please try to login manually.", 2);
    return { type: GET_USER_FAIL, payload: err_msg}
}

//Actions registration
export const RegistrationStart = (credentials) => async dispatch =>{
    dispatch({ type: REGISTRATION_START});
    const response = await con.post(
        '/api/users/',
        credentials
    ).catch(err => { 
        console.warn(err);
        dispatch(RegistrationFail(err));
    }).then(response =>{
        dispatch(RegistrationSuccess(response.data));
        dispatch(LoginStart(credentials));
    })
    //console.log(response);
    //dispatch({})
    history.push('/');
}

export const RegistrationSuccess = (user_info) => async dispatch => {
    message.success("Registration successful! Visit your profile page to edit your information.", 3);
    dispatch({ type: REGISTRATION_SUCCESS, payload: user_info});
}

export const RegistrationFail = (err_msg) => {
    message.error("Registration failed. Please try again.", 2);
    return { type: REGISTRATION_FAIL, payload: err_msg}
}

export const LogoutStart = (token, type) => async dispatch => {
    dispatch({ type: LOGOUT_START});
    localStorage.removeItem("goog_avatar_url");
    localStorage.removeItem("goog_name");
    localStorage.removeItem("goog_email");

    const header = `${type} ${token}`;
    const bodyFormData = new FormData();
    bodyFormData.set("client_id", django_client_id);
    await con.post(
        '/auth/invalidate-sessions', bodyFormData,
        {
            headers: {  Authorization: header,"Content-Type": "multipart/form-data"}
        }
    ).catch(err => { 
        message.warning("Logout failed",err);
        dispatch(LogoutFail(err));
    }).then(response=>{
        message.success("Logout successful.");
        dispatch(LogoutSuccess());
    })
        //history.push('/');
}

export const LogoutSuccess = () => async dispatch => {
    dispatch({ type: LOGOUT_SUCCESS});
    localStorage.removeItem("django_access_token_conv");
    localStorage.removeItem("django_refresh_token_conv");
    localStorage.removeItem("django_access_token_expires_in");
    console.log("Local storage logout",localStorage);
    dispatch(googleLogoutAction());
}

export const LogoutFail = (err_msg) => {
    message.error("Logout failed. Please try again.", 2);
    return { type: LOGOUT_FAIL, payload: err_msg}
}

//Modal action
export const ShowModal = (data) => {
    console.log(data);
    return { type: MODAL_SHOW, payload: data}
}

export const HideModal = (data) => {
    return { type: MODAL_HIDE, payload: data}
}