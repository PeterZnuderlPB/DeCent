import React from 'react';
import { Upload, Button, Icon } from 'antd';
import { connect } from 'react-redux';
import { UploadFile } from '../../../actions/PBUploadActions';
import lang from '../../../translations/translations';

//---------------------------
// Handles all files uploads
//---------------------------

class UploadButton extends React.Component {
    handleUpload = () => {
        const filesToUpload = this.props.upload.files.slice(-this.props.maxfiles); // Adds files from store - slice by maximum length
        this.props.UploadFile(filesToUpload, this.props.category);
    }

    render() {
        return (
            <Button
            type="primary"
            onClick={this.handleUpload}
            disabled={this.props.upload.files.length === 0}
            loading={this.props.upload.loading}
            style={{ marginTop: 16 }}
            >
            {this.props.upload.loading ? lang[this.props.lang]['upload.loading'] : lang[this.props.lang]['upload.start']}
            </Button>
        );
    }
}

UploadButton.defaultProps = {
    category: "Def_Cat"
}

const mapStateToProps = state => {
    return { upload: state.upload, lang: state.lang }
}

export default connect(mapStateToProps, { UploadFile })(UploadButton);