import { TOGGLE_NAVBAR } from './types';

export const ToggleNavbar = () => (dispatch, getState) => {
    const { navbar } = getState();

    dispatch(ToggleNavbarAction(!navbar));
}

export const ToggleNavbarAction = status  => {
    return {
        type: TOGGLE_NAVBAR,
        payload: status
    }
}