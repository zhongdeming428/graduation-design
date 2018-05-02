import React from 'react';
import axios from 'axios';
import { Select, Input, Button, Icon, message } from 'antd';

const { Option } = Select;
const handleChange = function(value) {
    this.setState({type: value});
};
const search = function() {
    console.log(this.state);
    if(this.state.name == '' && this.state.code == '') {
        message.warn('债券代码和债券简称不可以同时为空！')
    }
};

class Search extends React.Component {
    constructor() {
        super();
        this.state = {
            code: '',
            name: '',
            type: 0
        };
        this.handleChange = handleChange.bind(this);
        this.search = search.bind(this);
    }
    render() {
        return <div>
            <h2>数据搜索</h2>
            代码：<Input type='number' style={{width: '135px'}} value={this.state.code} onChange={(e) => {this.setState({code: e.target.value})}} />&nbsp;&nbsp;&nbsp;
            简称：<Input style={{width: '155px'}} value={this.state.name} onChange={(e) => {this.setState({name: e.target.value})}} />&nbsp;&nbsp;&nbsp;
            分类：<Select defaultValue='全部' style={{ width: 120 }} onChange={this.handleChange}>
                <Option key='0' value={0}>全部</Option>
                <Option key='1' value={1}>国债</Option>
                <Option key='2' value={2}>沪企债</Option>
                <Option key='3' value={3}>深企债</Option>
                <Option key='4' value={4}>中债VaR</Option>
                <Option key='5' value={5}>中债估值</Option>
            </Select>&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={this.search}>
                <Icon size='large' type='search'/>搜索
            </Button>
        </div>
    }
}

export default Search;