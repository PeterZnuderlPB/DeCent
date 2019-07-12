import React from 'react';
import { Modal, Button, Input, Form, Checkbox, Icon, message } from 'antd';
import { connect } from 'react-redux';
import con from '../../apis';
import './styles/contact.css';

const checkBoxData = [
    {label: 'Subject', value: 'subject'},
    {label: 'File', value: 'file'}
]

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
            message.error("Content is required!", 1);
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
                message.success("Successfully sent message.");
            }
        })
        .catch(err => {
            if (err.response.status === 401) {
                message.error("You need to be logged in in order to send message!");
            }

            if (err.response.status === 404) {
                message.error("You need to fill the content!");
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

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
        }

        let renderSubject = this.state.checked.indexOf('subject') != -1
        ? <Form.Item label="Subject" {...formItemLayout}> <Input name="subject" value={this.state.subject} onChange={this.handleInputChange} placeholder="Subject" {...formItemLayout} /> </Form.Item>
        : <div className="contact-empty">&nbsp;</div>;

        let rendeFile = this.state.checked.indexOf('file') != -1
        ? <Form.Item label="File" className="contact-file-wrapper" {...formItemLayout}>
            <Button type="primary"><Icon type="upload" /> Select file</Button>
            <p style={{ display: 'inline', marginLeft: '2%' }}>{this.state.file === null ? 'Please a select file' : `${this.state.file.name.slice(0, 15)}... ${this.state.file.name.substr(this.state.file.name.lastIndexOf('.') + 1)}`}</p>
            <Input onChange={this.handleFileChange} type="file" placeholder="File" {...formItemLayout} /> 
          </Form.Item>
        : <div>&nbsp;</div>;

        return (
            <div>
                <div className="contact-us" onClick={this.showModal}>Contact us</div>
                <Modal
                centered
                style={{ userSelect: 'none' }}
                title="Contact"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <div className="contact-center">
                    <Button key="back" onClick={this.handleCancel}>
                      Return
                    </Button>,
                    <Button key="submit" type="primary" onClick={this.handleOk}>
                      Submit
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
                        <Form.Item label="Content" {...formItemLayout} >
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
        user: state.user.auth
    }
}

export default connect(mapStateToProps)(PBMail);