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
import Profile from './core/Profile';
import PBMail from './core/PBMail';
import PBEditView from './core/PBEditView'
import PBTable from './core/PBTable'
import PBUpload from './core/PBUpload'
import Evaluations from './core/Evaluations';
import PBDetailView from './core/PBDetailView';

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
                        <Layout style={{ marginLeft: 230 }}>
                            <Header style={{ background: '#cceeff', padding: 0 }}>
                                <Route path="/" component={PBModal}/>
                            </Header>
                            
                            <Content >
                                <Route path="/" exact component={() => <PBUpload maxfiles={2} filetype={"image/*"} category={"food"}/>} />
                                <Route path="/" exact component={Profile} />
                                <Route path="/profile" exact component={() => <h1>Profile page!!</h1>} />
                                <Route path="/evaluations" exact component={Evaluations} />
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
    return { lang: state.lang }
}

export default connect(mapStateToProps, { ChangeLangAction })(App);
