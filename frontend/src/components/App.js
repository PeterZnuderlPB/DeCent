import React from 'react';
import { Router, Route} from 'react-router-dom';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { BackTop } from 'antd'
import { ChangeLangAction } from '../actions/langActions';

import history from '../history';
import translations from '../translations/translations';

import NavBar from './core/Auth/NavBar';
import PBModal from './core/PBModal';
import Profile from './core/Profile';

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
                    <Route path="/" component={NavBar}/>
                    <Route path="/" component={PBModal}/>
                    <hr/>
                    <Route path="/" exact component={Profile}/>
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