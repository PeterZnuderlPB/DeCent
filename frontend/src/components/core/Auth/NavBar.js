import React from 'react';
import { connect } from 'react-redux';
import { Link} from 'react-router-dom';

import { Drawer, Button, Avatar  } from 'antd';
import { FormattedMessage } from 'react-intl';

import LogInForm from './LogInForm';
import RegisterForm from './RegisterForm';
import GoogleLoginButton from './GoogleLoginButton';
//import GoogleLogoutButton from './GoogleLogoutButton'
import { LogoutStart, ShowModal, HideModal, FetchUserStart} from '../../../actions';
import { ChangeLangAction } from '../../../actions/langActions';

class NavBar extends React.Component {
    state = { visible: false, placement: 'left', form:"login" };

    componentDidMount(){
        const access_token = localStorage.getItem("django_access_token_conv")|| localStorage.getItem("goog_access_token_conv");
        //console.log("Local storage token", access_token);
        if(access_token){
            const token={access_token: access_token, token_type: "Bearer"}
            this.props.FetchUserStart(token);
        }
        
    }

    showDrawer = (selected_form) => {
        this.setState({
          visible: true,
          form: selected_form
        });
      };

    onClose = () => {
        this.setState({
          visible: false,
        });
    };

    onLogOut = () =>{
        const access_token = this.props.google_user.token_data.access_token || this.props.user.token.access_token;
        const token_type = this.props.google_user.token_data.token_type || this.props.user.token.token_type;
        this.props.LogoutStart(access_token, token_type);
    }

    handleSocialLogin = (user) => {
        console.log(user)
    }
       
    handleSocialLoginFailure = (err) => {
        console.error(err)
    }
       
    renderForm(){
        switch(this.state.form){
            case("login"):
                return <LogInForm closeDrawer ={this.onClose} />
            case("register"):
                return <RegisterForm closeDrawer ={this.onClose} />
            default:
                return null
        }
            
    }

    renderLogOut(){
        return(
        <>
            <li className="nav-item">
                
                {localStorage.getItem("goog_avatar_url")?
                    <Avatar 
                        src={localStorage.getItem("goog_avatar_url")} 
                        alt="Profile"
                        ></Avatar>:
                    null
                 }
                 <span >
                 <FormattedMessage id="nav.welcome" defaultMessage="Welcome" />, {this.props.user.userInfo.first_name? this.props.user.userInfo.first_name:this.props.user.userInfo.username}
                 </span>
            </li>
            <li className="nav-item">
                <Button className="nav-link" onClick={this.onLogOut}><FormattedMessage id="nav.logout" defaultMessage="Logout" /></Button>
            </li>
        </>
        )
    }

    renderSignInOptions(){
        return(
            <>
            <li className="nav-item">
                <Button className="nav-link" onClick={() => this.showDrawer("register")}><FormattedMessage id="nav.register" defaultMessage="Register" /></Button>
            </li>
            <li className="nav-item">
                <Button className="nav-link" onClick={() => this.showDrawer("login")}><FormattedMessage id="nav.login" defaultMessage="Login" /></Button>
            </li>
            <li className="nav-item">
                <GoogleLoginButton />
            </li>
            </>
        );
    }

    render(){
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="#">Navbar</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
    
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/"><FormattedMessage id="nav.home" defaultMessage="Home" /></Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/profile"><FormattedMessage id="nav.profile" defaultMessage="Profile" /></Link>
                        </li>
                        {this.props.user.isAuthenticated? this.renderLogOut():this.renderSignInOptions()}

                        {/* <!-- Languages --> */}
                        <li className="nav-item">
                            <a onClick={() => this.props.ChangeLangAction('en')} className="nav-link">EN</a>
                        </li>

                        <li className="nav-item">
                            <a onClick={() => this.props.ChangeLangAction('si')} className="nav-link">SI</a>
                        </li>
                        {/* <!-- /Languages --> */}
                    </ul>
                </div>

                <Drawer
                title={ <FormattedMessage id="auth.drawer" defaultMessage="Login/Register" /> }
                placement={this.state.placement}
                closable={true}
                onClose={this.onClose}
                visible={this.state.visible}
                width="512"
                >
                    {this.renderForm()}
                </Drawer>
            </nav>
        );
    }
    
}

const mapStateToProps = state =>{
    return { user: state.user.auth, google_user: state.user.google_auth}
}

export default connect(mapStateToProps,{LogoutStart, ShowModal, HideModal, FetchUserStart, ChangeLangAction})(NavBar)