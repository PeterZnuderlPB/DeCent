import React from 'react';
import { connect } from 'react-redux';
import { Link} from 'react-router-dom';

import { Drawer, Button, Avatar, Layout, Menu, Icon  } from 'antd';

import { FormattedMessage } from 'react-intl';

import LogInForm from './LogInForm';
import RegisterForm from './RegisterForm';
import GoogleLoginButton from './GoogleLoginButton';
import LanguageSelect from '../LanguageSelect'
//import GoogleLogoutButton from './GoogleLogoutButton'
import { ToggleNavbar } from '../../../actions/navbarActions';
import { LogoutStart, ShowModal, HideModal, FetchUserStart} from '../../../actions';
import { ChangeLangAction } from '../../../actions/langActions';

const { Header, Content, Footer, Sider } = Layout;

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
            <Menu.SubMenu
            key="sub2"
            title={
              <span>
                {localStorage.getItem("goog_avatar_url")?
                    <Avatar 
                        src={localStorage.getItem("goog_avatar_url")} 
                        alt="Profile"
                        ></Avatar>:
                    <Icon type="user" />
                 }
                <span className="nav-text"><FormattedMessage id="nav.welcome" defaultMessage="Welcome" />, {this.props.user.userInfo.first_name? this.props.user.userInfo.first_name:this.props.user.userInfo.username}
                 </span>
              </span>
            }
            >
                <Menu.Item key="201">
                    <Icon type="profile" />
                    <span className="nav-text">
                        <Link to="/profile"><FormattedMessage id="nav.profile" defaultMessage="Profile" /></Link>
                    </span>
                </Menu.Item>
                <Menu.Item key="202">
                    <Icon type="close-square" />
                    <span className="nav-text" onClick={this.onLogOut}><FormattedMessage id="nav.logout" defaultMessage="Logout" /></span>
                </Menu.Item>
                
            </Menu.SubMenu>
        )
    }

    renderSignInOptions(){
        return(
            <Menu.SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="appstore" />
                <span><FormattedMessage id="nav.singin_register" defaultMessage="Signin/Register" /></span>
              </span>
            }
          >
                <Menu.Item key="101">
                    <Icon type="shop" />
                    <span className="nav-text" onClick={() => this.showDrawer("register")}><FormattedMessage id="nav.register" defaultMessage="Register" /></span>
                </Menu.Item>
                <Menu.Item key="102">
                    <Icon type="shop" />
                    <span className="nav-text" onClick={() => this.showDrawer("login")}><FormattedMessage id="nav.login" defaultMessage="Login" /></span>
                </Menu.Item>
                <Menu.Item key="103">
                    <Icon type="shop" />
                    <span className="nav-text"><GoogleLoginButton /></span>
                </Menu.Item>
            </Menu.SubMenu>
            
        );
    }

    render(){
        return(
            <>
            <Sider
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 20,
                }}
                collapsible
                collapsed={this.props.navbar}
                onCollapse={() => this.props.ToggleNavbar()}
                >
                <div className="logo" />
                <Menu theme="light" mode="inline" defaultSelectedKeys={['2']}>
                    <Menu.Item key="1">
                        <span className="nav-text"><LanguageSelect /></span>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Icon type="home" />
                        <span className="nav-text">
                            <Link to="/"><FormattedMessage id="nav.home" defaultMessage="Home" /></Link>
                        </span>
                    </Menu.Item>
                    {/* <Menu.Item key="3">
                        <Icon type="database" />
                        <span className="nav-text">
                            <Link to="/evaluations"><FormattedMessage id="nav.evaluations" defaultMessage="Evaluations" /></Link>
                        </span>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <Icon type="team" />
                        <span className="nav-text">
                            <Link to="/subjects"><FormattedMessage id="nav.subjects" defaultMessage="Subjects" /></Link>
                        </span>
                    </Menu.Item> */}

                    {/* Projects */}
                    {this.props.user.isAuthenticated
                    ? this.props.user.userInfo.active_type === 1 || this.props.user.userInfo.active_type === 2 || this.props.user.userInfo.active_type === 3
                        ? <Menu.Item key="5">
                            <Icon type="project" />
                            <span className="nav-text">
                                <Link to="/projects"><FormattedMessage id="nav.projects" defaultMessage="Projects" /></Link>
                            </span>
                        </Menu.Item>
                        : null
                    : null
                    }

                    {/* WorkOrders */}
                    {this.props.user.isAuthenticated
                    ? this.props.user.userInfo.active_type === 1 || this.props.user.userInfo.active_type === 2 || this.props.user.userInfo.active_type === 3
                        ? <Menu.Item key="6">
                            <Icon type="solution" />
                            <span className="nav-text">
                                <Link to="/workorders"><FormattedMessage id="nav.workorders" defaultMessage="Work orders" /></Link>
                            </span>
                        </Menu.Item>
                        : null
                    : null
                    }

                    {/* Cooperatives */}
                    {this.props.user.isAuthenticated
                    ? this.props.user.userInfo.active_type === 1 || this.props.user.userInfo.active_type === 2 || this.props.user.userInfo.active_type === 3
                        ? <Menu.Item key="7">
                            <Icon type="apartment" />
                            <span className="nav-text">
                                <Link to="/cooperatives"><FormattedMessage id="nav.cooperatives" defaultMessage="Cooperatives" /></Link>
                            </span>
                        </Menu.Item>
                        : null
                    : null
                    }

                    {/* Workers */}
                    {this.props.user.isAuthenticated
                    ? this.props.user.userInfo.active_type === 2 || this.props.user.userInfo.active_type === 3
                        ? <Menu.Item key="8">
                            <Icon type="team" />
                            <span className="nav-text">
                                <Link to="/workers"><FormattedMessage id="nav.workers" defaultMessage="Workers" /></Link>
                            </span>
                        </Menu.Item>
                        : null
                    : null
                    }

                    {/* My projects */}
                    {this.props.user.isAuthenticated
                    ? this.props.user.userInfo.active_type === 2 || this.props.user.userInfo.active_type === 3
                        ? <Menu.Item key="9">
                            <Icon type="project" />
                            <span className="nav-text">
                                <Link to="/myprojects"><FormattedMessage id="nav.myprojects" defaultMessage="My projects" /></Link>
                            </span>
                        </Menu.Item>
                        : null
                    : null
                    }

                    {/* My cooperative */}
                    {this.props.user.isAuthenticated
                    ? this.props.user.userInfo.active_cooperative !== 0
                        ? <Menu.Item key="10">
                            <Icon type="apartment" />
                            <span className="nav-text">
                                <Link to="/mycooperative"><FormattedMessage id="nav.mycooperative" defaultMessage="My cooperative" /></Link>
                            </span>
                        </Menu.Item>
                        : null
                    : null
                    }

                    {/* Cooperative managment */}
                    {this.props.user.isAuthenticated
                    ? this.props.user.userInfo.active_cooperative !== 0
                        ? <Menu.Item key="11">
                            <Icon type="cluster" />
                            <span className="nav-text">
                                <Link to="/managecooperative"><FormattedMessage id="nav.managecooperative" defaultMessage="Manage cooperative" /></Link>
                            </span>
                        </Menu.Item>
                        : null
                    : null
                    }

                    {this.props.user.isAuthenticated ? this.renderLogOut() : this.renderSignInOptions()}
                    
                </Menu>
                </Sider>

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
            
            </>
        );
    }
    
}

const mapStateToProps = state => {
    return {
        user: state.user.auth,
        google_user: state.user.google_auth,
        navbar: state.navbar
    }
}

export default connect(mapStateToProps, {
    LogoutStart,
    ShowModal,
    HideModal,
    FetchUserStart,
    ChangeLangAction,
    ToggleNavbar
})(NavBar)