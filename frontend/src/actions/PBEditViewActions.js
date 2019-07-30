import { message } from 'antd';
import con from '../apis';
import history from '../history';
import {
    FETCH_POST_START,
    FETCH_POST_SUCCESS,
    FETCH_POST_FAIL,
    UPDATE_POST_START,
    UPDATE_POST_SUCCESS,
    UPDATE_POST_FAIL,
    ADD_POST_START,
    ADD_POST_SUCCESS,
    ADD_POST_FAIL
} from './types'

export const FetchPost = (postId) => (dispatch, getState) => {
    dispatch(FetchPostStart());
    const { user } = getState();

    fetch(`http://localhost:8000/api/competency/${postId}`, {
        method: 'GET',
        headers: {
            'Authorization': `${user.auth.token.token_type} ${user.auth.token.access_token}`
        }
    })
    .then(res => {
        if (res.status !== 200) {
            dispatch(FetchPostFail("Error trying to fetch post"));
            message.error("Error trying to fetch post.");
            return;
        }
        return res.json();
    })
    .then(data => {
        console.log("PBEditViewActions - Fetch data: ", data);
        if (data === undefined)
            return;
        // let mydata = {
        //     data: data,
        //     column_names: ['owner', 'name', 'upload_date'],
        //     column_types: ['Foreign Key', 'String', 'Date (without time)']
        // }

        dispatch(FetchPostSuccess(data));
        message.success("Successfully fetched post data.");
    });
}

export const UpdatePost = (postId, postData) => (dispatch, getState) => {
    dispatch(UpdatePostStart(postData));
    const { user } = getState();

    const saveUri = `api/competency/${postId}`;
    const conConfig = {
      headers:{
        Authorization: `${user.auth.token.token_type} ${user.auth.token.access_token}`,
      }
    }
    con.put(saveUri, postData, conConfig)
    .then(res => {
        dispatch(UpdatePostSuccess(postData));
        message.success("Successfully updated post.");
    })
    .catch(err => {
        dispatch(UpdatePostFail(postData));
        message.error("Error trying to update post.");
    })
}

export const AddPost = (postData) => (dispatch, getState) => {
    dispatch(AddPostStart(postData));
    const { user } = getState();

    postData = {
        ...postData,
        organization: 1,
        id: 0
    }

    console.log("PREPAPRED FOR ADD", postData);

    const saveUri = `api/competency/`;
    const conConfig = {
      headers:{
        Authorization: `${user.auth.token.token_type} ${user.auth.token.access_token}`,
      }
    }
    con.post(saveUri, postData, conConfig)
    .then(res => {
        dispatch(AddPostSuccess(postData));
        history.push(`${history.location.pathname}/${res.data.id}`);
        message.success("Successfully added post.");
    })
    .catch(err => {
        dispatch(AddPostFail(postData));
        message.error("Error trying to add post.");
    })
}

export const FetchPostStart = () => {
    return {
        type: FETCH_POST_START,
        payload: {
            data: [],
            loadingPost: true,
            loadingUpdate: false,
            loadingAdd: false
        }
    }
}

export const FetchPostSuccess = (postData) => {
    return {
        type: FETCH_POST_SUCCESS,
        payload: {
            data: postData,
            loadingPost: false,
            loadingUpdate: false,
            loadingAdd: false
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
            loadingPost: false,
            loadingUpdate: true,
            loadingAdd: false
        }
    }
}

export const UpdatePostSuccess = (postData) => {
    return {
        type: UPDATE_POST_SUCCESS,
        payload: {
            data: postData,
            loadingPost: false,
            loadingUpdate: false,
            loadingAdd: false
        }
    }
}

export const UpdatePostFail = (postData) => {
    return {
        type: UPDATE_POST_FAIL,
        payload: {
            data: postData,
            loadingPost: false,
            loadingUpdate: false,
            loadingAdd: false
        }
    }
}

export const AddPostStart = (postData) => {
    return {
        type: ADD_POST_START,
        payload: {
            data: postData,
            loadingPost: false,
            loadingUpdate: false,
            loadingAdd: true
        }
    }
}

export const AddPostSuccess = (postData) => {
    return {
        type: ADD_POST_SUCCESS,
        payload: {
            data: postData,
            loadingPost: false,
            loadingUpdate: false,
            loadingAdd: false
        }
    }
}

export const AddPostFail = (postData) => {
    return {
        type: ADD_POST_FAIL,
        payload: {
            data: postData,
            loadingPost: false,
            loadingUpdate: false,
            loadingAdd: false
        }
    }
}