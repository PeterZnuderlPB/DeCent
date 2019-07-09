import { CHANGE_LANG } from './types';

const ChangeLang = (lang) => {
    localStorage.setItem('lang', lang);
};

export const ChangeLangAction = (lang) => {
    ChangeLang(lang);
    return {
        type: CHANGE_LANG,
        payload: lang
    }
}