import React from 'react';
import { Table, Select, Spin, Modal, Button, message } from 'antd';
import axios from 'axios';
const Option = Select.Option;


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

const warn = '由于官方数据格式问题，暂无对应年份数据下载，如有需要，请移步官网。';

const handleChange = function(value) {
	this.setState({
		loading: true
	});
	axios({
		method: 'post',
		url: '/BondsData',
		dataType: 'json',
		data: {
			type: 4,
			year: String(value)
		}
	}).then(res => {
        var data = res.data;
        if(data.data.length == 0) {
            warning('No Data!')
            this.setState({loading: false});
            return 0;
        }
        var colNames = Object.keys(data.data[0]);
        var index = colNames.indexOf('_id');
        colNames.splice(index, 1);
        var newColumns = colNames.map(name => {
            return {
                title: name,
                dataIndex: name,
                key: name
            }
        });
        data.data.forEach(d => {
            d.key = d._id;
            colNames.forEach(name => {
                if(name != 'Date') {
                    var num = Number(d[name]);
                    if(num == num)
                        d[name] = num.toFixed(2);
                }
            });
        });
        this.setState({
            years: data.dates,
            data: data.data,
            loading: false,
            columns: newColumns,
        });
    }, err => {
        this.setState({
            loading: false
        });
        message.error(err.message);
    });
}

const warning = function(title, content) {
    Modal.warning({
      title,
      content
    });
}

class LIBOR extends React.Component {
	constructor() {
		super();
		this.state = {
			years: [],
			data: [],
			loading: true,
			columns
		};
		this.handleChange = handleChange.bind(this);
	}
	componentDidMount() {
		axios({
			url: '/BondsData',
			method:'post',
			data: {
				type: 4,
				year: 2013
			},
			dataType: 'json'
		}).then(res => {
			var data = res.data;
            if(data.data.length == 0) {
                warning('No Data!')
                this.setState({loading: false});
                return 0;
            }
			var colNames = Object.keys(data.data[0]);
			var index = colNames.indexOf('_id');
			colNames.splice(index, 1);
			var newColumns = colNames.map(name => {
                return {
                    title: name,
                    dataIndex: name,
                    key: name
                }
			});
			data.data.forEach(d => {
				d.key = d._id;
				colNames.forEach(name => {
					if(name != 'Date') {
						var num = Number(d[name]);
						if(num == num)
							d[name] = num.toFixed(2);
					}
				});
			});
			this.setState({
				years: data.dates,
				data: data.data,
				loading: false,
				columns: newColumns
			});
		}, err => {
			this.setState({
				loading: false
			});
			message.error(err.message);
		});
	}
	render() {
		return <div>
			<h2>LIBOR日收益率历史数据</h2>
			<div style={{margin:'0px 0px 10px 0px'}}>
				<Select defaultValue='2013'  style={{ width: 120 }} onChange={this.handleChange}>
					{
						this.state.years.map(year => {
							return <Option key={year} value={year}>{year}</Option>
						})
					}
				</Select>
				<Button style={{margin: '5px'}} type="primary" onClick={()=>{warning('File Not Exist!', warn)}}>下载Excel</Button>
				<span style={{display: 'block'}}>数据来源:<a target='_blank' href='https://www.bankrate.com/rates/interest-rates/libor.aspx'>Bankrate</a></span>
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

export default LIBOR