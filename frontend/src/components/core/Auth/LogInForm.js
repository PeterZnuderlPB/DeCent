
import React from 'react';
import { connect } from 'react-redux';
import { LoginStart } from '../../../actions'
import 'antd/dist/antd.css';
//import './index.css';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { FormattedMessage } from 'react-intl';
import lang from '../../../translations/translations';

class LogInForm extends React.Component {
    
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.LoginStart(values);
        if(this.props.closeDrawer)
            this.props.closeDrawer();
      }
    });
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
      <Form {...formItemLayout} onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: <FormattedMessage id="auth.usernameEmpty" defaultMessage="Please input your username!" /> }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder={lang[this.props.lang]['auth.username']}
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: <FormattedMessage id="auth.passwordEmpty" defaultMessage="Please input your password!" /> }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder={lang[this.props.lang]['auth.password']}
            />,
          )}
        </Form.Item>
        <Form.Item >
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox><FormattedMessage id="auth.remember" defaultMessage="Remember me" /></Checkbox>)}
          <a className="login-form-forgot" href="">
            <FormattedMessage id="auth.forgotPassword" defaultMessage="Forgot password" />
          </a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            <FormattedMessage id="auth.login" defaultMessage="Log in" />
          </Button>
          <FormattedMessage id="auth.or" defaultMessage="or" /> <a href=""><FormattedMessage id="auth.register" defaultMessage="Register now!" /></a>
        </Form.Item>
      </Form>
    );
  }
}

const mapStateToProps = state =>{
    return { user: state.auth, lang: state.lang }
}

const WrappedLogInForm = Form.create({ name: 'standard_login' })(LogInForm);

export default connect(mapStateToProps, { LoginStart })(WrappedLogInForm)
          