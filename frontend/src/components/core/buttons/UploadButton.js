import React from 'react';
import { Upload, Button, Icon } from 'antd';
import { connect } from 'react-redux';
import { UploadFile } from '../../../actions/PBUploadActions';

class UploadButton extends React.Component {
    handleUpload = () => {
        console.log(this.props.upload);
        const filesToUpload = this.props.files; // Add files from store
        this.props.UploadFile(filesToUpload);
    }

    render() {
        return (
            <Button
            type="primary"
            onClick={this.handleUpload}
            disabled={this.props.length === 0}
            loading={this.props.upload.loading}
            style={{ marginTop: 16 }}
            >
            {this.props.upload.loading ? 'Uploading' : 'Start Upload'}
            </Button>
        );
    }
}

const mapStateToProps = state => {
    return { upload: state.upload }
}

export default connect(mapStateToProps, { UploadFile })(UploadButton);