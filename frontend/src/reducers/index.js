import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import modalReducer from './modalReducer';
import PBTablesReducer from './PBTablesReducer'
import userReducers from './userReducers';
import langReducer from './langReducer';
import PBUploadReducer from './PBUploadReducer';
import PBEditViewRecuder from './PBEditViewReducer';
import navbarReducer from './navbarReducer';
import cooperativeReducer from './cooperativeReducer';
import cooperativeEnrollmentReducer from './cooperativeEnrollmentReducer';

export default combineReducers({
    form: formReducer, // Reducer provided by redux-form, has to be named form
    user: userReducers,
    modal: modalReducer,
    tables: PBTablesReducer,
    lang: langReducer,
    upload: PBUploadReducer,
    edit: PBEditViewRecuder,
    navbar: navbarReducer,
    cooperative: cooperativeReducer,
    cooperativeEnrollment: cooperativeEnrollmentReducer
})