import React from 'react';
import { Table, Spin, Modal } from 'antd';
import axios from 'axios';

const Dic = {
    'CalculateDate': '计算日',
    'Code': '债券代码',
    'Name': '债券简称',
    'Exchange': '流通场所',
    'HoldingPeriod': '持有期',
    'VaR': 'VaR',
    'CVaR': 'CVaR',
    'ConfidenceLevel': '置信水平'
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
    axios.get('/ZZVaR').then(data => {
        this.setState({loading: true});
        let result = data.data;
        if(result.length == 0) {
            warning('No Data!');
        }
        let Columns = Object.keys(result[0]);
        let index = Columns.indexOf('_id');
        Columns.splice(index, 1);
        result.forEach(r => {
            r.key = r._id;
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
        warning('Error!', err);
        this.setState({loading: false});
    });
};

class ZZVaR extends React.Component {
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
            <span>数据来源：<a target='about_blank' href='http://yield.chinabond.com.cn/cbweb-mn/var/var_main?locale=zh_CN'>中债VaR</a></span>
            {
                this.state.loading ? null : <Table columns={this.state.columns} dataSource={this.state.data} />
            }
            {
                this.state.loading ? <Spin size="large" style={{ zIndex:'10000', position:'relative', display:'block', left:'50%',top:'50%', transform:'translate(-50%, -50%)'}}/> : null
            }
        </div>
    }
}

export default ZZVaR;