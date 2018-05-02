import React from 'react';
import { Table, Select, Spin, Modal, Button } from 'antd';
import axios from 'axios';
const Option = Select.Option;

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
    CreditLevel: '信用级别'
};

let columns = [{
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

const handleChange = function(value) {
	this.setState({
		loading: true,
		excelName: value + 'DetailData.xlsx',
		excelPath: 'http://localhost:8000/Download?type=' + value
	});
	axios({
		method: 'get',
		url: '/DetailData' + '?type=' + value,
		dataType: 'json'
	}).then(res => {
        var data = res.data;
        if(data.length == 0) {
            warning('No Data!')
            this.setState({loading: false});
            return 0;
        }
        var colNames = Object.keys(data[0]);
        var index = colNames.indexOf('_id');
        colNames.splice(index, 1);
        index = colNames.indexOf('Convexity');
        colNames.splice(index, 1);
        index = colNames.indexOf('ModifiedDuration');
        colNames.splice(index, 1);
        var newColumns = colNames.map(name => {
            if(name !== 'Convexity' && name !== 'ModifiedDuration') {
                return {
                    title: Dictionary[name],
                    dataIndex: name,
                    key: name
                }
            }
        });
        data.forEach(d => {
            d.key = d._id;
        });
        this.setState({
            data: data,
            loading: false,
            columns: newColumns,
        });
    }, err => {
        this.setState({
            loading: false
        });
        alert(err);
    });
}

const warning = function(title, content) {
    Modal.warning({
      title,
      content
    });
}

class DetailData extends React.Component {
	constructor() {
		super();
		this.state = {
            type: 'GZ',
			data: [],
			loading: true,
			columns,
			excelName:'GZDetailData.xlsx',
			excelPath:'http://localhost:8000/Download?type=GZ'
		};
		this.handleChange = handleChange.bind(this);
	}
	componentDidMount() {
		axios({
			url: '/DetailData' + '?type=' + this.state.type,
			method:'get',
			dataType: 'json'
		}).then(res => {
			var data = res.data;
            if(data.length == 0) {
                warning('No Data!')
                this.setState({loading: false});
                return 0;
            }
			var colNames = Object.keys(data[0]);
			var index = colNames.indexOf('_id');
            colNames.splice(index, 1);
            index = colNames.indexOf('Convexity');
            colNames.splice(index, 1);
            index = colNames.indexOf('ModifiedDuration');
            colNames.splice(index, 1);
			var newColumns = colNames.map(name => {
                if(name !== 'Convexity' && name !== 'ModifiedDuration') {
                    return {
                        title: Dictionary[name],
                        dataIndex: name,
                        key: name
                    }
                }
			});
			data.forEach(d => {
				d.key = d._id;
			});
			this.setState({
				data: data,
				loading: false,
				columns: newColumns
			});
		}, err => {
			this.setState({
				loading: false
			});
			alert(err);
		});
	}
	render() {
		return <div>
			<h2>最新债券数据</h2>
			<div style={{margin:'0px 0px 10px 0px'}}>
				<Select defaultValue='GZ'  style={{ width: 120 }} onChange={this.handleChange}>
                    <Option key='GZ' value='GZ'>国债数据</Option>
                    <Option key='SH' value='SH'>沪企债数据</Option>
                    <Option key='SZ' value='SZ'>深企债数据</Option>
				</Select>
				<a href={this.state.excelPath}
					style={{display:'inline-block', padding:'5px', boxSizing:'border-box'}}
					download={this.state.excelName}>
					<Button type="primary">下载Excel</Button>
				</a>
				<span style={{display: 'block'}}>数据来源:<a target='_blank' href='http://bond.money.hexun.com/data/bond_nationaldebt_list.htm'>和讯网</a></span>
			</div>
			{
				!this.state.loading ? <Table columns={this.state.columns} dataSource={this.state.data} /> : null
			}
			{ 
				this.state.loading ? <Spin size="large" style={{ zIndex:'10000', position:'relative', display:'block', left:'50%',top:'50%', transform:'translate(-50%, -50%)'}}/> : null 
			}
		</div>
	}
}

export default DetailData