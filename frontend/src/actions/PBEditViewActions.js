import { message } from 'antd';
import {
    FETCH_POST_START,
    FETCH_POST_SUCCESS,
    FETCH_POST_FAIL,
    UPDATE_POST_START,
    UPDATE_POST_SUCCESS,
    UPDATE_POST_FAIL,
    UPDATE_POST_CANCEL
} from './types'

export const FetchPost = (postId) => (dispatch, getState) => {
    dispatch(FetchPostStart());
    const uri = `/api/posts/${postId}`;
    const { user } = getState();

    fetch(`http://localhost:8000${uri}`, {
        method: 'GET',
        headers: {
            'Authorization': `${user.auth.token.token_type} ${user.auth.token.access_token}`
        }
    })
    .then(res => {
        if (!res.ok) {
            dispatch(FetchPostFail("Error trying to fetch post"));
            message.error("Error trying to fetch post.");
            return;
        }
        return res.json();
    })
    .then(data => {
        if (data === undefined)
            return;
        
        dispatch(FetchPostSuccess(data));
        message.success("Successfully fetched post data.");
    });
}

export const FetchPostStart = () => {
    return {
        type: FETCH_POST_START,
        payload: {
            data: [],
            loading: true
        }
    }
}

export const FetchPostSuccess = (postData) => {
    return {
        type: FETCH_POST_SUCCESS,
        payload: {
            data: postData,
            loading: false
        }
    }
}

export const FetchPostFail = (err_msg) => {
    return {
        type: FETCH_POST_FAIL,
        payload: err_msg
    }
}

export const UpdatePostStart = (postData) => {
    return {
        type: UPDATE_POST_START,
        payload: {
            data: postData,
            loading: true
        }
    }
}

export const UpdatePostSuccess = (postData) => {
    return {
        type: UPDATE_POST_SUCCESS,
        payload: {
            data: postData,
            loading: false
        }
    }
}

export const UpdatePostFail = (postData) => {
    return {
        type: UPDATE_POST_FAIL,
        payload: {
            data: postData,
            loading: false
        }
    }
}

export const UpdatePostCancel = () => {
    return {
        type: UPDATE_POST_CANCEL,
        payload: null
    }
}