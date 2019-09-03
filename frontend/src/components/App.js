import React from 'react';
import { Router, Route} from 'react-router-dom';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { BackTop, Layout, Menu, Icon  } from 'antd'
import { ChangeLangAction } from '../actions/langActions';

import history from '../history';
import translations from '../translations/translations';

import NavBar from './core/Auth/NavBar';
import PBModal from './core/PBModal';
import Profile from './WorkPlatform/Profile';
import PBMail from './core/PBMail';
import PBEditView from './core/PBEditView'
import PBTable from './core/PBTable'
import PBUpload from './core/PBUpload'
import Evaluations from './Competencies/Evaluations';
import PBDetailView from './core/PBDetailView';
import Subjects from './Competencies/Subjects';
import UserSettings from './WorkPlatform/UserSettings';
import Projects from './WorkPlatform/Projects';
import WorkOrders from './WorkPlatform/WorkOrders';
import MyProjects from './WorkPlatform/MyProjects';
import Workers from './WorkPlatform/Workers';

import './core/styles/appstyle.css';
import Cooperatives from './WorkPlatform/Cooperatives';
import CooperativeManagment from './WorkPlatform/CooperativeManagment';
import MyCooperative from './WorkPlatform/MyCooperative';

const { Header, Content, Footer, Sider } = Layout;

class App extends React.Component{

    render(){

        // Checks for localstorage lang, changes app lang
        if(localStorage.getItem('lang')) {
            this.props.ChangeLangAction(localStorage.getItem('lang'));
        }

        return (
            <IntlProvider locale={this.props.lang} messages={translations[this.props.lang]}>
            <>
            <div className="container">
                <Router history={history}>
                    <Layout >
                        <Route path="/" component={NavBar}/>
                        <Layout className="app-container" style={{ marginLeft: !this.props.navbar ? 230 : 130 }}>
                            <Header style={{ background: '#cceeff', padding: 0 }}>
                                <Route path="/" component={PBModal}/>
                            </Header>
                            
                            <Content >
                                <Route path="/" exact component={() => <PBUpload maxfiles={2} filetype={"image/*"} category={"food"}/>} />
                                <Route path="/" exact component={Profile} />
                                <Route path="/profile" exact component={UserSettings} />
                                <Route path="/evaluations" exact component={Evaluations} />
                                <Route path="/subjects" exact component={Subjects} />
                                <Route path="/projects" exact component={Projects} />
                                <Route path="/workorders" exact component={WorkOrders} />
                                <Route path="/workers" exact component={Workers} />
                                <Route path="/myprojects" exact component={MyProjects} />
                                <Route path="/cooperatives" exact component={Cooperatives} />
                                <Route path="/mycooperative" exact component={MyCooperative} />
                                <Route path="/managecooperative" exact component={CooperativeManagment} />
                                <Route path="/BrowseView/:table_name" exact component={PBTable} />
                                <Route path="/EditView/:table_name/:id" exact component={PBEditView} />
                                <Route path="/EditView/:table_name/" exact component={PBEditView} />
                                <Route path="/DetailView/:table_name/:id" exact component={PBDetailView} />
                            </Content>
                            <Footer style={{ textAlign: 'center' }}>
                                <Route path="/" component={PBMail}/>
                            </Footer>
                        </Layout>    
                    </Layout>
                </Router>
            </div>
            <BackTop />
            </>
            </IntlProvider>

        );
    }
};

const mapStateToProps = state =>{
    return {
        lang: state.lang,
        navbar: state.navbar
    }
}

export default connect(mapStateToProps, { ChangeLangAction })(App);
