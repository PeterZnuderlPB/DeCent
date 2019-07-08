import React from 'react';
import { connect } from 'react-redux';
import {
    Form,
    Input,
    Checkbox,
    Button,
  } from 'antd';
  
  import { RegistrationStart } from '../../../actions'

  class RegisterForm extends React.Component {
    state = {
      confirmDirty: false,
      autoCompleteResult: [],
    };
  
    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          this.props.RegistrationStart(values);
          this.props.closeDrawer();
        }
      });
    };
  
    handleConfirmBlur = e => {
      const value = e.target.value;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
  
    compareToFirstPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter is inconsistent!');
      } else {
        callback();
      }
    };
  
    validateToNextPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    };

    validateAgreement = (rule, value, callback) =>{
        if (!value)
            callback('You ahave accept the agreement to be bale to compete registration.')
        callback();
    }
  
    handleWebsiteChange = value => {
      let autoCompleteResult;
      if (!value) {
        autoCompleteResult = [];
      } else {
        autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
      }
      this.setState({ autoCompleteResult });
    };
  
    render() {
      const { getFieldDecorator } = this.props.form;
  
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      };
 
      return (
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item
            label={
              <span>
                Username&nbsp;
              </span>
            }
            >
            {getFieldDecorator('username', {
              rules: [
                    { 
                      required: true,
                       message: 'Please input your username!'
                    }, 
                    {
                        whitespace: false,
                        message:"No whitespaces allowed"
                    }],
            })(<Input />)}
          </Form.Item>
          
          <Form.Item label="Email">
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'Please input a valid email address!',
                },
                {
                  required: true,
                  message: 'Please input your email!',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Password" hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your password!',
                },
                {
                  validator: this.validateToNextPassword,
                },
                {
                    min: 8,
                    message: "Password needs to be at least 8 characters long."
                }
              ],
            })(<Input.Password />)}
          </Form.Item>
          <Form.Item label="Confirm Password" hasFeedback>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input.Password onBlur={this.handleConfirmBlur} />)}
          </Form.Item>
          
          <Form.Item {...tailFormItemLayout}>
            {getFieldDecorator('agreement', {
              valuePropName: 'checked',
              rules:[
                  {required: true},
                  { validator: this.validateAgreement}
                ]
            })(
              <Checkbox>
                I have read the <a href="">agreement</a>
              </Checkbox>,
            )}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      );
    }
  }
  
  const mapStateToProps = state =>{
    return { user: state.auth}
}

  const WrappedRegisterForm = Form.create({ name: 'register' })(RegisterForm);
  
  export default connect(mapStateToProps, { RegistrationStart })(WrappedRegisterForm);