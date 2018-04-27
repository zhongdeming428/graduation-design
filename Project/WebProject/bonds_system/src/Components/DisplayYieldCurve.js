import React from 'react';
import { DatePicker, Modal, Button } from 'antd';
import moment from 'moment';
import axios from 'axios';

const dateChange = function(date, dateStr) {
    this.setState({
        latestDate: dateStr
    });
};

const warning = function(title, content) {
    Modal.warning({
      title,
      content
    });
};

const generateYieldCurve = function(Type, Date) {
    axios.get(`/YieldCurve?type=${Type}&date=${Date}`).then(res => {
        if(res.data.length === 0) 
            warning('No Data!', '你所指定的日期没有发现收益率数据！');
        console.log(res);
    }, err => {
        warning('Error!', err);
    });
};

class YieldCurve extends React.Component {
    constructor(props) {
        super();
        this.state = {
            latestDate: props.latestDate
        };
        this.dateChange = dateChange.bind(this);
        this.generateYieldCurve = generateYieldCurve.bind(this);
    }
    componentWillReceiveProps(newProps) {
        this.setState({
            latestDate: newProps.latestDate
        });
    }
    render() {
        return <div>
            <DatePicker value={moment(this.state.latestDate)} onChange={this.dateChange}/>
            <Button style={{margin:'0 5px'}} type='primary' onClick={()=>{this.generateYieldCurve('1', this.state.latestDate)}}>生成收益率曲线</Button>
            
        </div>
    }
}

export default YieldCurve;