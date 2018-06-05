import React from 'react';
import axios from 'axios';
import { Icon, Button, message } from 'antd';

const refreshAll = function() {
    this.setState({refreshing: true});
    axios.get('/RefreshAll').then(res => {
        if(res.data == '1') {
            message.success('刷新成功！');
            this.setState({refreshing: false});
        }
    }, err => {
        message.error('刷新失败！\r' + err.message);
        this.setState({refreshing: false});
    });
};

class Dashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            refreshing: false
        };
        this.refreshAll = refreshAll.bind(this);
    }
    render() {
        return <div>
            <h1>刷新所有数据</h1>
            <Button onClick={this.refreshAll} type='primary' style={{width:'100px', height:'60px', position:'relative', left:'50%', transform:'translateX(-50%)'}}>
                {
                    !this.state.refreshing ? <Icon style={{fontSize: '20px'}} type='loading-3-quarters'/> : null
                }
                {
                    this.state.refreshing ? <Icon style={{fontSize: '20px'}} type='loading'/> : null
                }
            </Button>
        </div>
    }
}

export default Dashboard;