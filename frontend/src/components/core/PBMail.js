import React from 'react';
import { Modal, Button, Input, Form, Checkbox, Icon, message } from 'antd';
import { connect } from 'react-redux';
import con from '../../apis';
import './styles/contact.css';
import lang from '../../translations/translations';

class PBMail extends React.Component {
    state = { 
        visible: false,
        checked: ['subject'],
        file: null,
        subject: '',
        content: ''
        };

    showModal = () => {
        this.setState({
        visible: true,
        });
    };

    handleOk = e => {
        if (this.state.content === '') {
            message.error(lang[this.props.lang]['mail.contentError'], 1);
            return;
        }

        const formData = new FormData();
        formData.append('userId', this.props.user.userInfo.id);
        formData.append('subject', this.state.subject);
        formData.append('content', this.state.content);
        formData.append('file', this.state.file);

        const axiosConfig = {
            headers: {
                'Authorization': 'Bearer ' + this.props.user.token.access_token
            }
        }

        con.post('api/mail/', formData, axiosConfig)
        .then(res => {
            if (res.status === 204) {
                message.success(lang[this.props.lang]['mail.success']);
            }
        })
        .catch(err => {
            if (err.response.status === 401) {
                message.error(lang[this.props.lang]['mail.authError']);
            }

            if (err.response.status === 404) {
                message.error(lang[this.props.lang]['mail.contentError']);
            }
        });

        this.setState({
        visible: false,
        file: null,
        }, () => {
            setTimeout(() => {
                this.setState({ 
                    checked: ['subject'], 
                    subject: '',
                    content: '' 
                }) // Delay to sync with fadeout anim
            }, 100);
        });
    };

    handleCancel = e => {
        this.setState({
        visible: false
        });
    };

    handleFileChange = e => {
        this.setState({
            file: e.target.files[0]
        });
    }

    handleCheckChange = checked => {
        this.setState({
            checked
        });
    }

    handleInputChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        const { TextArea } = Input;

        const checkBoxData = [
            {label: lang[this.props.lang]['mail.subject'], value: 'subject'},
            {label: lang[this.props.lang]['mail.fileLabel'], value: 'file'}
        ]

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
        }

        let renderSubject = this.state.checked.indexOf('subject') != -1
        ? <Form.Item label={lang[this.props.lang]['mail.subject']} {...formItemLayout}> <Input name="subject" value={this.state.subject} onChange={this.handleInputChange} placeholder={lang[this.props.lang]['mail.subject']} {...formItemLayout} /> </Form.Item>
        : <div className="contact-empty">&nbsp;</div>;

        let rendeFile = this.state.checked.indexOf('file') != -1
        ? <Form.Item label={lang[this.props.lang]['mail.fileLabel']} className="contact-file-wrapper" {...formItemLayout}>
            <Button type="primary"><Icon type="upload" /> {lang[this.props.lang]['mail.selectFile']}</Button>
            <p style={{ display: 'inline', marginLeft: '2%' }}>{this.state.file === null ? lang[this.props.lang]['mail.selectFilePlaceholder'] : `${this.state.file.name.slice(0, 15)}... ${this.state.file.name.substr(this.state.file.name.lastIndexOf('.') + 1)}`}</p>
            <Input onChange={this.handleFileChange} type="file" placeholder="File" {...formItemLayout} /> 
          </Form.Item>
        : <div>&nbsp;</div>;

        return (
            <div>
                <div className="contact-us" onClick={this.showModal}>{lang[this.props.lang]['mail.contactUs']}</div>
                <Modal
                centered
                style={{ userSelect: 'none' }}
                title={lang[this.props.lang]['mail.contact']}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <div className="contact-center">
                    <Button key="back" onClick={this.handleCancel}>
                        {lang[this.props.lang]['mail.return']}
                    </Button>,
                    <Button key="submit" type="primary" onClick={this.handleOk}>
                        {lang[this.props.lang]['mail.submit']}
                    </Button>,
                    </div>
                  ]}
                >
                    <Checkbox.Group
                    style={{ float: 'right', marginTop: '-4.5%' }} 
                    options={checkBoxData}
                    onChange={this.handleCheckChange}
                    value={this.state.checked}
                    defaultValue={['subject']}
                    />

                    <Form style={{ userSelect: 'none' }} className="contact-transition" layout="horizontal">
                        {renderSubject}
                        <Form.Item label={lang[this.props.lang]['mail.content']} {...formItemLayout} >
                            <TextArea 
                            name="content" value={this.state.content} 
                            onChange={this.handleInputChange} 
                            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vitae pulvinar nibh. In consectetur interdum lacinia." 
                            autosize={{ minRows: 8, maxRows: 9 }} />
                        </Form.Item>
                        {rendeFile}
                    </Form>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.auth,
        lang: state.lang
    }
}

export default connect(mapStateToProps)(PBMail);