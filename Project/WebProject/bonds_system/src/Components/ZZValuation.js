import React from 'react';
import { Table } from 'antd';
import axios from 'axios';

const Dic = {
    'ValuationDate': '估值日期',
    'Code': '债券代码',
    'Name': '债券简称',
    'Exchange': '流通场所',
    'RepaymentPeriod': '待偿期（年）',
    'DailyValuationFullPrice': '日间估价全价(元)',
    'AccruedInterestDuringTheDay': '日间应计利息(元)',
    'ValuationNetPrice': '估价净价(元)',
    'ValuationYield': '估价收益率(%)',
    'CreditLevel': '债券债项评级'
};

const columns = [{
	title: 'Date',
	dataIndex: 'Date'
}, {
	title: '0d',
	dataIndex: 'T0d',
}, {
	title: '1m',
	dataIndex: 'T1m',
}, {
	title: '2m',
	dataIndex: 'T2m',
}, {
	title: '3m',
	dataIndex: 'T3m',
}, {
	title: '6m',
	dataIndex: 'T6m',
}, {
	title: '9m',
	dataIndex: 'T9m',
}, {
	title: '1y',
	dataIndex: 'T1y',
}, {
	title: '2y',
	dataIndex: 'T2y',
}, {
	title: '3y',
	dataIndex: 'T3y',
}, {
	title: '5y',
	dataIndex: 'T5y',
}, {
	title: '6y',
	dataIndex: 'T6y',
}, {
	title: '7y',
	dataIndex: 'T7y',
}, {
	title: '8y',
	dataIndex: 'T8y',
}, {
	title: '9y',
	dataIndex: 'T9y',
}, {
	title: '10y',
	dataIndex: 'T10y',
}];

const fetchData = function() {
    axios.get('/ZZValuation').then(data => {
        let result = data.data;
        let Columns = Object.keys(result[0]);
        result.forEach(r => {
            r.key = r.Code;
        });
        let newColumns = Columns.map(name => {
            return {
                title: Dic[name],
                dataIndex: name,
                key: name
            };
        });
        this.setState({
            data: result,
            columns: newColumns
        });
    }, err => {
        console.log(err);
    });
};

class ZZValuation extends React.Component {
    constructor() {
        super();
        this.state = {
            columns: columns,
            data: []
        };
        this.fetchData = fetchData.bind(this);
    }
    componentWillMount() {
        this.fetchData();
    }
    render() {
        return <div>
            <Table columns={this.state.columns} dataSource={this.state.data} />
        </div>
    }
}

export default ZZValuation;