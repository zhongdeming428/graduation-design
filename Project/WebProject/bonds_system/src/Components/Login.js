import React from 'react';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import axios from 'axios';

const getCookie = function (name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
} 

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
	state = {
		loading: false
	};
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({loading: true});
				console.log('Received values of form: ', values);
				axios({
					method: 'post',
					url: '/Admin',
					data: { ...values }
				}).then(res => {
					if(res.data == 0) {
						//psw wrong
						message.error('您所输入的密码不正确！');
						this.props.login(false);
					}
					else if(res.data == -1) {
						//account does not exist
						message.error('您所输入的账户不存在');
						this.props.login(false);
					}
					else if(res.data == 1) {
						//success
						message.success('登录成功！');
						this.props.login(true);
					}
					else {
						//exception
						message.error('出现了不可预知的异常！');
						this.props.login(false);
					}
					this.setState({loading: false});
				}, err => {
					message.error(err);
					this.setState({loading: false});
				});
			}
		});
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<Form onSubmit={this.handleSubmit} className="login-form">
				<FormItem>
					{getFieldDecorator('userName', {
						initialValue: getCookie('userName'),
						rules: [{ required: true, message: 'Please input your username!' }],
					})(
						<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
						)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('password', {
						initialValue: getCookie('password'),
						rules: [{ required: true, message: 'Please input your Password!' }],
					})(
						<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
						)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('remember', {
						valuePropName: 'checked',
						initialValue: true,
					})(
						<Checkbox>Remember me</Checkbox>
						)}
					<Button type="primary" htmlType="submit" className="login-form-button">
						{
							this.state.loading ? <Icon type='loading'/> : null
						}
						Log in
          			</Button>
				</FormItem>
			</Form>
		);
	}
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
export default WrappedNormalLoginForm;