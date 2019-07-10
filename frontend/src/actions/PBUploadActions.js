import { UPLOAD_FILE_START, UPLOAD_FILE_SUCCESS, UPLOAD_FILE_FAIL } from './types';
import { message } from 'antd';

export const UploadFile = (filesToUpload) => (dispatch, getState) => {
    dispatch(UploadFileStart(filesToUpload));
    filesToUpload.forEach(el => {
        const { user } = getState();
        const formData = new FormData();
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;

        formData.append('name', el.name);
        formData.append('file', el);
        // formData.append('upload_date', formattedDate);
        formData.append('owner', user.auth.userInfo.id);

        fetch('http://127.0.0.1:8000/api/files/', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + user.auth.token.access_token,
            },
            body: formData
            })
            .then(res => {
                if (res.status === 400) {
                    dispatch(UploadFileFail(filesToUpload))
                    return;
                }
                return res.json();
            })
            .then(data => {
                if (data === undefined)
                    return;

                dispatch(UploadFileSuccess())
            });
        });
}

// Payload - Uploading status

export const UploadFileStart = (filesToUpload) => {
    return {
        type: UPLOAD_FILE_START,
        payload: {
            loading: true,
            files: filesToUpload
        }
    }
}

export const UploadFileSuccess = () => {
    message.success("Upload successful");
    return {
        type: UPLOAD_FILE_SUCCESS,
        payload: {
            loading: false,
            files: []
        }
    }
}

export const UploadFileFail = (filesToUpload) => {
    message.error("Upload failed");
    return {
        type: UPLOAD_FILE_FAIL,
        payload: {
            loading: false,
            files: filesToUpload
        }
    }
}