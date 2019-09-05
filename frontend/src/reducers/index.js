import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import modalReducer from './modalReducer';
import PBTablesReducer from './PBTablesReducer'
import userReducers from './userReducers';
import langReducer from './langReducer';
import PBUploadReducer from './PBUploadReducer';
import PBEditViewRecuder from './PBEditViewReducer';
import navbarReducer from './navbarReducer';
import cooperativeReducer from './WorkPlatform/cooperativeReducer';
import cooperativeEnrollmentReducer from './WorkPlatform/cooperativeEnrollmentReducer';
import competenciesReducer from './WorkPlatform/competenciesReducer';
import cooperativeNewsReducer from './WorkPlatform/cooperativeNewsReducer';
import cooperativeChatReducer from './WorkPlatform/cooperativeChatReducer';

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
    cooperativeEnrollment: cooperativeEnrollmentReducer,
    competencies: competenciesReducer,
    cooperativeNews: cooperativeNewsReducer,
    cooperativeChat: cooperativeChatReducer
})