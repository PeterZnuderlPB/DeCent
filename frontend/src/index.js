import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import si from 'react-intl/locale-data/si';
import reduxThunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';

addLocaleData(en);
addLocaleData(si);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(reduxThunk))
    );

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.querySelector('#root')
);