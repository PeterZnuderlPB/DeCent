import { TOGGLE_NAVBAR } from './types';

export const ToggleNavbarAction = () => (dispatch, getState) => {
    const { navbar } = getState();
    console.log("OK", navbar)

    return {
        type: TOGGLE_NAVBAR,
        payload: true
    }
}