// --------------------------------
// Detail View visibleField Consts
// --------------------------------
export const DETAIL_VIEW_EVALUATION = ['id', 'comp_question__question', 'comp_question__description', 'predefined_answer__answer', 'comment', 'competency__id', 'competency__name']
export const DETAIL_VIEW_COMPOTENCY = ['id', 'evaluation__id'];
export const DETAIL_VIEW_EVALUATION_LIST = ['id', 'evaluation_date', 'evaluation_type___type', 'subject__name'];

// ------------------------------
// Edit View visibleField Consts
// ------------------------------
export const EDIT_VIEW_ANSWERS = ['id', 'comment', 'predefined_answer__id', 'comp_question__id'];

// ----------------------------------
// User Settings visibleField Consts
// ----------------------------------
export const USER_SETTINGS_USERPERMISSIONS_LIST = ['id', 'permissions', 'organization__id', 'organization__name', 'organization__organization_type'];
export const USER_SETTINGS_PRIMARY_ORGANIZATION_LIST = ['id', 'name', 'organization_type__id'];