import {
    GOOGLE_IS_AUTHENTICATING,
    GOOGLE_AUTHENTICATE_ACTION,
    GOOGLE_LOGOUT,
    CONVERT_GOOGLE_TOKEN_SUCCESS,
    CONVERT_GOOGLE_TOKEN_FAIL
} from './types'
import { message } from 'antd'
import {FetchUserStart} from './index'
export const url = "http://127.0.0.1:8000";

/*These are the django client ID and SECRET
  from the OauthToolkit Application registered in your django admin
*/
export const django_client_id = "t5Atz5P7YfpN0Ul2cDUWbAwMwjQfCfza5GmagZZu";
export const django_client_secret =
  "FUTJYMX0xGp22rBHitfcL747Yypg3nf79azyyfITHjqueee6E6sBVeU4bwh8EBSDLPCbMKlTHTBasrvLw7tQxVullWYPY505OYI6qDMXNEM16gBp4GCcrlp5D5vb2T6N";

export const isAuthenticating = () => ({
    type: GOOGLE_IS_AUTHENTICATING
});

export const  convertGoogTokenSuccess = (json) => async dispatch =>  {
    console.log("Convert Google Token", json);
    
    localStorage.setItem("goog_access_token_conv", json.access_token);
    localStorage.setItem("goog_refresh_token_conv", json.refresh_token);
    let expiryDate = Math.round(new Date().getTime() / 1000) + json.expires_in;
    localStorage.setItem("goog_access_token_expires_in", expiryDate);
    dispatch( {
      type: CONVERT_GOOGLE_TOKEN_SUCCESS,
      goog_token: json
    });
    dispatch(FetchUserStart(json));
    message.success("Google login successful.");
  }
  
  export const googleLogoutAction = () => {
    message.success("Google logout successful.");
    return function(dispatch) {
      localStorage.removeItem("goog_access_token_conv");
      localStorage.removeItem("goog_refresh_token_conv");
      localStorage.removeItem("goog_access_token_expires_in");
      dispatch({ type: GOOGLE_LOGOUT});
      return Promise.resolve();
    };
  }
  
  const convertGoogTokenFailure = err => async dispatch => {
    message.warning("Google login unsuccessful."); 
    return { type: CONVERT_GOOGLE_TOKEN_FAIL, err }
};

// the API endpoint expects form-urlencoded-data thus search-params
export const  convertGoogleToken = (access_token) => {
    return async function(dispatch) {
      dispatch(isAuthenticating());
      const searchParams = new URLSearchParams();
      searchParams.set("grant_type", "convert_token");
      searchParams.set("client_id", django_client_id);
      searchParams.set("client_secret", django_client_secret);
      searchParams.set("backend", "google-oauth2");
      searchParams.set("token", access_token);
      try {
        let response = await fetch(`${url}/auth/convert-token/`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: searchParams
        });
        if (!response.ok) {
          throw new Error("An Error has occured, please try again.");
        }
        let responseJson = await response.json();
        return dispatch(convertGoogTokenSuccess(responseJson));
      } catch (err) {
        return dispatch(convertGoogTokenFailure(err));
      }
    };
  }
  
