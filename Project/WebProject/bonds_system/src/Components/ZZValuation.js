import React from 'react';
import { Table, Spin, Modal } from 'antd';
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

const warning = function(title, content) {
    Modal.warning({
      title,
      content
    });
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
        this.setState({loading: true});
        let result = data.data;
        if(result.length == 0) {
            warning('No Data!');
        }
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
            columns: newColumns,
            loading: false
        });
    }, err => {
        warning('Error!', err.message);
        this.setState({loading: false});
    });
};

class ZZValuation extends React.Component {
    constructor() {
        super();
        this.state = {
            columns: columns,
            data: [],
            loading: true
        };
        this.fetchData = fetchData.bind(this);
    }
    componentWillMount() {
        this.fetchData();
    }
    render() {
        return <div>
            <span>数据来源：<a target='about_blank' href='http://yield.chinabond.com.cn/cbweb-mn/val/val_query_list?locale=zh_CN'>中债估值</a></span>
            {
                this.state.loading ? null : <Table columns={this.state.columns} dataSource={this.state.data} />
            }
            {
                this.state.loading ? <Spin size="large" style={{ zIndex:'10000', position:'relative', display:'block', left:'50%',top:'50%', transform:'translate(-50%, -50%)'}}/> : null
            }
        </div>
    }
}

export default ZZValuation;