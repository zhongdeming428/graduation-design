import React from 'react';
import axios from 'axios';
import { Form, Icon, Input, Button, Checkbox, Modal } from 'antd';
import WrappedNormalLoginForm from './Login';
import Dashboard from './Dashboard';

const FormItem = Form.Item;
const setModalVisible = function(modalVisible) {
    this.setState({ modalVisible });
};
const login = function(isLogin) {
    this.setState({
        isLogin,
        modalVisible: !isLogin
    });
};

class Admin extends React.Component {
    constructor() {
        super();
        this.state = {
            modalVisible: false,
            isLogin: false
        };
        this.login = login.bind(this);
        this.setModalVisible = setModalVisible.bind(this);
    }
    componentWillMount() {
        this.setState({
            modalVisible: true,
            isLogin: false  
        });
    }
    render() {
        return <div>
            {
                this.state.isLogin ? <Dashboard/> : null
            }
			<Modal
				title="管理员登录"
				visible={this.state.modalVisible}
				width = {400}
				onCancel={() => this.setModalVisible(false)}
				closable = {true}
				footer = {null}
				>
				<WrappedNormalLoginForm login={this.login}/>
			</Modal>
        </div>
    }
}

export default Admin;