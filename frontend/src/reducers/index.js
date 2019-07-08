import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import modalReducer from './modalReducer';
import PBTablesReducer from './PBTablesReducer'
import userReducers from './userReducers'

export default combineReducers({
    form: formReducer, // Reducer provided by redux-form, has to be named form
    user: userReducers,
    modal: modalReducer,
    tables: PBTablesReducer,
})