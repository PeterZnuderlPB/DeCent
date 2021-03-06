import React from "react";
import { connect } from "react-redux";

import { convertGoogleToken } from "../../../actions/googleAuthActions";
import { GoogleLogin } from "react-google-login";
import { google_client_id, googleLoginRedirect} from "../../..//apis"

import { FormattedMessage } from 'react-intl';

const GoogleLoginButton = props => {
  const onSuccess = response => {
    console.log(response);
    if (response.profileObj) {
      localStorage.setItem("goog_avatar_url", response.profileObj.imageUrl);
      localStorage.setItem("goog_name", response.profileObj.name);
      localStorage.setItem("goog_email", response.profileObj.email);
    }
    props.convertGoogleToken(response.Zi.access_token);
  };

  const onFailure = response => {
    console.log(response);
  };

  return (
    <GoogleLogin
      clientId = {google_client_id}
      buttonText="Login"
      onSuccess={onSuccess}
      onFailure={onFailure}
      className="loginBtn loginBtn--google"
      prompt="select_account"
      redirectUri = {googleLoginRedirect}
    />
  );
};

const mapDispatchToProps = dispatch => ({
    convertGoogleToken: access_token => dispatch(convertGoogleToken(access_token))
  });
  
  export default connect(null, mapDispatchToProps)(GoogleLoginButton);
