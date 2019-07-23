import React from 'react';
import { connect } from 'react-redux';
import { Upload, Button, Icon } from 'antd';
import UploadButton from './buttons/UploadButton';
import { UploadFileAdd } from '../../actions/PBUploadActions';
import lang from '../../translations/translations';

class PBUpload extends React.Component {
    render() {
        let fileList = this.props.upload.files.slice(-this.props.maxfiles);

        const props = {
            onRemove: file => {
                const index = this.props.upload.files.indexOf(file);
                const newFileList = this.props.upload.files.slice();
                newFileList.splice(index, 1);
                this.props.UploadFileAdd(newFileList);
            },
            beforeUpload: file => {
                this.props.UploadFileAdd([...this.props.upload.files, file])
                return false
            },
            accept: this.props.filetype,
            fileList,
        };

        return (
            <>
                <Upload {...props}>
                    <Button>
                        <Icon type="upload" /> {lang[this.props.lang]['upload.selectFile']}
                    </Button>
                </Upload>
                <UploadButton maxfiles={this.props.maxfiles} category={this.props.category}/>
            </>
        );
    }
}

PBUpload.defaultProps = {
    maxfiles: 1,
    category: "Def_Cat",
}

const mapStateToPros = (state) => {
    return { upload: state.upload, auth: state.user.auth, lang: state.lang };
}

export default connect(mapStateToPros, { UploadFileAdd })(PBUpload);