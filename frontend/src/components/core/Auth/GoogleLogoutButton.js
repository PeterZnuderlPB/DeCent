import React, { Component } from "react";
import { connect } from "react-redux";
import gapi from "gapi-client";
import { GoogleLogout } from "react-google-login";

import { googleLogoutAction } from "../../../actions/googleAuthActions";
import { google_client_id} from "../../..//apis"

import { FormattedMessage } from 'react-intl';

class GoogleLogoutButton extends Component {
  componentWillMount() {
    gapi.load("auth2", () => {
      this.auth2 = gapi.auth2.init({
        client_id: google_client_id
      });
    });
  }

  render() {
    const signOut = dispatch => {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2
        .signOut()
        .then(() => {
          console.log("User signed out.");
          localStorage.removeItem("goog_avatar_url");
          localStorage.removeItem("goog_name");
          localStorage.removeItem("goog_email");
        })
        .then(() => this.props.googleLogoutAction())
        .then(() => this.props.history.push("/"));
    };
    return (
      <GoogleLogout
        buttonText="Logout"
        onLogoutSuccess={signOut}
        className="loginBtn loginBtn--google"
      />
    );
  }
}

const mapDispatchToProps = dispatch => ({
    googleLogoutAction: () => dispatch(googleLogoutAction())
  });
  
  export default connect(null, mapDispatchToProps)(GoogleLogoutButton);
