import React from 'react';
import { connect } from 'react-redux';
import { Upload, Button, Icon } from 'antd';
import UploadButton from './buttons/UploadButton';

class PBUpload extends React.Component {
    state = {
    fileList: [],
  };
    render() {
        let fileList = this.state.fileList.slice(-this.props.maxfiles);

        const props = {
            onRemove: file => {
                this.setState(state => {
                const index = state.fileList.indexOf(file);
                const newFileList = state.fileList.slice();
                newFileList.splice(index, 1);
                return {
                    fileList: newFileList,
                };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
        };

        return (
            <div style={{ margin: '3%' }}>
                <Upload {...props}>
                <Button>
                    <Icon type="upload" /> Select File
                </Button>
                </Upload>
                <UploadButton files={this.state.fileList.slice(-this.props.maxfiles)} length={this.state.fileList.length} />
            </div>
        );
    }
}

const mapStateToPros = (state) => {
    return { upload: state.upload, auth: state.user.auth };
}

export default connect(mapStateToPros)(PBUpload);