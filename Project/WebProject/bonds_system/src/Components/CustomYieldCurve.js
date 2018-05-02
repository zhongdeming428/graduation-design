import React from 'react';
import axios from 'axios';
import { Button, InputNumber, Icon, message } from 'antd';

const addData = function() {
    let { maturity, yieldRate } = this.state;
    if(maturity == 0 || yieldRate == 0.0) {
        message.warn('不能有数据为空！');
        return false;
    }
    for(let i = 0; i < this.state.data.length; i++) {   
        if(maturity == this.state.data[i].maturity) {
            message.warn('到期期限不能重复！');
            return false;
        }
    }
    this.setState({
        data: [...this.state.data, {
            maturity,
            yieldRate
        }],
        maturity: 0,
        yieldRate: 0.0
    });
};

const deleteData = function(e) {
    let id = e.target.dataset.id;
    let data = this.state.data;
    data.splice(id, 1);
    this.setState({
        data
    });
};

const startFit = function() {
    if(this.state.data.length < 5) {
        message.warn('请至少填写5条数据！');
        return false;
    }
};

class CustomYieldCurve extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            maturity: 0,
            yieldRate: 0.0
        };
        this.addData = addData.bind(this);
        this.deleteData = deleteData.bind(this);
        this.startFit = startFit.bind(this);
    }
    render() {
        return <div>
            <h2>自定义收益率曲线拟合</h2>
            <table className='custom_table ant-table table'>
                <thead className='ant-table-thead'>
                    <tr style={{borderBottom: '1px solid #ccc', backgroundColor: '#fafafa', height: '30px'}}>
                        <th style={{width: '50%'}}>到期期限（年）</th><th style={{width: '50%'}}>到期收益率（%）</th>
                        <th>
                            <Button type='primary' onClick={this.startFit}>拟合</Button>
                        </th>
                    </tr>
                </thead>
                <tbody className="ant-table-tbody">
                    {
                        this.state.data.map((d, i) => {
                            return <tr key={d.maturity} className="ant-table-row  ant-table-row-level-0">
                                <td>{d.maturity}</td>
                                <td>{d.yieldRate}</td>
                                <td>
                                    <Button onClick={this.deleteData} type='danger' data-id={i}><Icon type='minus-circle'/></Button>
                                </td>
                            </tr>
                        })
                    }
                    <tr className="ant-table-row  ant-table-row-level-0">
                        <td><InputNumber style={{width:'90%'}} value={this.state.maturity} onChange={(value) => {this.setState({maturity: value})}}/></td>
                        <td><InputNumber style={{width:'90%'}} value={this.state.yieldRate} onChange={(value) => {this.setState({yieldRate: value})}}/></td>
                        <td>
                            <Button type='primary' onClick={this.addData}><Icon type='plus-circle'/></Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    }
}

export default CustomYieldCurve;