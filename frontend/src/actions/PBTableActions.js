import {
    FETCH_POSTS_START,
    FETCH_TABLE_SUCCESS,
    FETCH_TABLE_FAIL,
} from './types'
import { message } from 'antd'

export const FetchTableStart = (url, name) => {
    message.info("Logout failed. Please try again.", 2);
    return { type: FETCH_POSTS_START, payload: err_msg}
}

export const FetchTableSuccess = (name, data) => {
    message.success("Successfully fetched the table - " + name, 2);
    const info= {name: name, data: data}
    return { type: FETCH_TABLE_SUCCESS, payload: info}
}

export const FetchTableFail = (err_msg) => {
    message.error("Fetching table failed. " + err_msg, 2);
    return { type: FETCH_TABLE_FAIL, payload: err_msg}
}