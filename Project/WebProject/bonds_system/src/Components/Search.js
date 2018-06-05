import React from 'react';
import axios from 'axios';
import { Select, Input, Button, Icon, message, Spin, Table } from 'antd';

const { Option } = Select;
const handleChange = function(value) {
    this.setState({type: value});
};
const Dictionary = {
    Code: '代码',
    Name: '简称',
    FullPrice: '全价',
    RateofYear: '年利率（%）',
    Maturity: '期限（年）',
    RemainingPeriod: '剩余期限',
    NetPrice: '净价',
    AccrualDays: '应计天数',
    AccruedInterest: '应计利息',
    InterestPaymentMethod: '付息方式',
    Yield: '到期收益率',
    ModifiedDuration: '修正久期',
    Convexity: '凸性',
    Exchange: '交易所',
    InterestRateDay: '计息日',
    ExpiryDate: '到期日',
    PreTaxYield: '税前到期收益率' ,
    AfterTaxYield: '税后到期收益率',
    CreditLevel: '信用级别',
    CalculateDate: '计算日',
    HoldingPeriod: '持有期',
    VaR: 'VaR',
    CVaR: 'CVaR',
    ConfidenceLevel: '置信水平',
    ValuationDate: '估值日期',
    RepaymentPeriod: '待偿期（年）',
    DailyValuationFullPrice: '日间估价全价(元)',
    AccruedInterestDuringTheDay: '日间应计利息(元)',
    ValuationNetPrice: '估价净价(元)',
    ValuationYield: '估价收益率(%)'
};
const getColumns = function(data) {
    let result = [];
    if(data.length === 0) {
        return []
    }
    data = data[0];
    let keys = Object.keys(data);
    let index = keys.indexOf('_id');
    keys.splice(index, 1);
    keys.forEach(k => {
        let obj = {};
        obj['title'] = Dictionary[k];
        obj['dataIndex'] = k;
        obj['key'] = k;
        result.push(obj);
    });
    return result;
};
const search = function() {
    this.setState({searching: true});
    if(this.state.name == '' && this.state.code == '') {
        message.warn('债券代码和债券简称不可以同时为空！')
        this.setState({searching: false});
    }
    else {
        axios.post('/Search', {
            type: this.state.type,
            code: this.state.code,
            name: this.state.name
        }).then(res => {
            // console.log(res.data)
            let data = res.data;
            if(Array.isArray(data)) {
                if(data.length === 0) {
                    message.warn('没有查询到满足条件的数据！');
                    this.setState({searching: false});
                    return false;
                }
                let columns = getColumns(data);
                this.setState({ columns, isArray: true, data });
            }
            else {
                let data1 = data['国债数据'];
                let data2 = data['沪企债'];
                let data3 = data['深企债'];
                let data4 = data['中债VaR'];
                let data5 = data['中债估值'];
                if(data1 == [] && data2 == [] && data3 == [] && data4 == [] && data5 == []) {
                    message.warn('没有查询到满足条件的数据！');
                    this.setState({searching: false});
                    return false;
                }
                let columns1 = getColumns(data1);
                let columns2 = getColumns(data2);
                let columns3 = getColumns(data3);
                let columns4 = getColumns(data4);
                let columns5 = getColumns(data5);
                this.setState({
                    data1, data2, data3, data4, data5, columns1, columns2, columns3, columns4, columns5, isArray: false
                });
            }
            this.setState({searching: false});
        }, err => {
            message.error(err.message);
            this.setState({searching: false});
        });
    }
};

class Search extends React.Component {
    constructor() {
        super();
        this.state = {
            code: '',
            name: '',
            type: 0,
            searching: false,
            isArray: true,
            columns: [],
            data: [],
            data1: [],
            data2: [],
            data3: [],
            data4: [],
            data5: [],
            columns1: [],
            columns2:  [],
            columns3: [],
            columns4: [],
            columns5: []
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
            {
                this.state.searching ? <Spin size="large" style={{ zIndex:'10000', position:'relative', display:'block', left:'50%',top:'50%', transform:'translate(-50%)'}}/> : null
            }
            {
                !this.state.searching && this.state.data.length != 0 && this.state.isArray ? <Table columns={this.state.columns} dataSource={this.state.data} /> : null
            }
            {
                !this.state.searching && !this.state.isArray && this.state.data1.length != 0 ? 
                    <div>
                        <h2>国债数据：</h2>
                        <Table columns={this.state.columns1} dataSource={this.state.data1}/> 
                    </div>
                : null
            }
            {
                !this.state.searching && !this.state.isArray && this.state.data2.length != 0 ? 
                    <div>
                        <h2>沪企债数据：</h2>
                        <Table columns={this.state.columns2} dataSource={this.state.data2}/> 
                    </div>
                : null
            }
            {
                !this.state.searching && !this.state.isArray && this.state.data3.length != 0 ? 
                    <div>
                        <h2>深企债数据：</h2>
                        <Table columns={this.state.columns3} dataSource={this.state.data3}/> 
                    </div>
                : null
            }
            {
                !this.state.searching && !this.state.isArray && this.state.data4.length != 0 ? 
                    <div>
                        <h2>中债VaR数据：</h2>
                        <Table columns={this.state.columns4} dataSource={this.state.data4}/> 
                    </div>
                : null
            }
            {
                !this.state.searching && !this.state.isArray && this.state.data5.length != 0 ? 
                    <div>
                        <h2>中债估值数据：</h2>
                        <Table columns={this.state.columns5} dataSource={this.state.data5}/> 
                    </div>
                : null
            }
        </div>
    }
}

export default Search;