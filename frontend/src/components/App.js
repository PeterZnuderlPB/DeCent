import React from 'react';
import { Router, Route} from 'react-router-dom';
import { BackTop } from 'antd'

import history from '../history';

import NavBar from './core/Auth/NavBar';
import PBModal from './core/PBModal';
import Profile from './core/Profile';

class App extends React.Component{
    render(){
        
        return (
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
            
        );
    }
};

export default App;