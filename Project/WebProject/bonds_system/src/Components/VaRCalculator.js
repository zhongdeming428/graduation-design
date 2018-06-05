import React from 'react';
import axios from 'axios';
import { Button, Spin, Upload, Icon, message, Timeline, Select, InputNumber, Input, Modal } from 'antd';


const { TextArea } = Input;
const Option = Select.Option;
const Dragger = Upload.Dragger;
const props = {
    name: 'file',
    multiple: false,
    action: '/Uploads',
    onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
            fileUploaded(info.file.name);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    beforeUpload(file, fileList) {
        let type = file.name.substring(file.name.lastIndexOf('.') + 1);
        if(type !== 'xlsx' && type !== 'csv') {
            message.error('当前只支持上传.xlsx和.csv文件！');
            return false;
        }
    }
};

// 置信水平变化。
const CLChange = function(value) {
    this.setState({confidenceLevel: value});
};

//excel或者csv被上传了。
let fileUploaded = function(value) {
    this.setState({filename: value});
};

// 持有期变化。
const HPChange = function(value) {
    this.setState({holdingPeriod: value});
};

// 开始计算按钮的事件函数。
const startCalculate = function() {
    this.setState({
        calculating: true,
        result: ''
    });
    let type = this.state.method;
    let data = this.state.data;
    let file = this.state.filename;
    let confidenceLevel = this.state.confidenceLevel;
    let holdingPeriod = this.state.holdingPeriod;
    let simCount = this.state.simCount;
    if(type == 1) {
        if(!/^(\d+(\.\d+)?)([,，]\d+(\.\d+)?)*$/g.test(data)) {
            message.error('手动输入的收益率历史数据格式不正确！');
            this.setState({calculating: false});
            return false;
        }
        if(data.indexOf(',') * data.indexOf('，') > 0) {
            message.error('手动输入的收益率历史数据格式不正确！');
            this.setState({calculating: false});
            return false;
        }
    }
    axios({
        method: 'post',
        url: '/CalculateVaR',
        data: {
            type,
            data,
            file,
            confidenceLevel,
            holdingPeriod,
            simCount
        }
    }).then(res => {
        // console.log(res.data);
        this.setState({
            calculating: false,
            result: res.data
        });
    }, err => {
        message.error(err.message);
        this.setState({calculating: false});
    });
};

const MethodChange = function(value) {
    this.setState({method: value});
};

//模拟次数。
const simCountChange = function(value) {
    this.setState({simCount: value});
};

// 手动输入数据了。
const dataChange = function(e) {
    this.setState({data: e.target.value});
};

function info() {
    Modal.info({
        title: '数据文件上传注意事项',
        content: (
            <div>
                <p>1.上传的Excel或者CSV文件，数据须放在第一列，最好不要有空数据或者其他类型的数据。</p>
                <p>2.数据列不需要添加表头。</p>
                <p>3.上传的历史收益数据越多，模拟计算出的VaR越逼近真实。</p>
            </div>
        ),
        onOk() { }
    });
}

class VaRCalculator extends React.Component {
    constructor() {
        super();
        this.state = {
            method: 2,
            filename: '',
            data: '',
            confidenceLevel: 0.95,
            holdingPeriod: 1,
            simCount: 10000,
            calculating: false,
            result: ''
        };
        fileUploaded = fileUploaded.bind(this);
        this.CLChange = CLChange.bind(this);
        this.HPChange = HPChange.bind(this);
        this.startCalculate = startCalculate.bind(this);
        this.MethodChange = MethodChange.bind(this);
        this.dataChange = dataChange.bind(this);
    }
    render() {
        return <div>
            <h2>VaR计算器</h2>
            <Timeline>
                <Timeline.Item>
                    <p><strong>选择收益率历史数据的上传方式</strong></p>
                    <Select defaultValue='Excel或CSV数据文件上传'  style={{ width: 200 }} onChange={this.MethodChange}>                       
                        <Option key={2} value={2}>Excel或CSV数据文件上传</Option>
                        <Option key={1} value={1}>填写数据上传</Option>
                    </Select>
                </Timeline.Item>
                <Timeline.Item>
                    <p><strong>上传债券历史收益率数据</strong></p>
                    {
                        this.state.method === 2 ? 
                        <div>
                            <Dragger {...props}>
                                <p className="ant-upload-drag-icon">
                                    <Icon type="inbox" />
                                </p>
                                <p className="ant-upload-text">点击区域上传文件或者拖动文件到此区域</p>
                            </Dragger>
                            <span><a href='javascript:void(0)' onClick={info}>上传文件注意事项</a></span>
                        </div>
                        : null
                    }
                    {
                        this.state.method === 1 ? 
                        <TextArea onChange={this.dataChange} placeholder="输入你的所有收益率历史数据，每个数据中使用逗号分隔，要求至少有两期历史收益数据。" autosize={{ minRows: 2, maxRows: 6 }} />
                        : null
                    }
                </Timeline.Item>
                <Timeline.Item>
                    <p><strong>选择置信水平和持有期</strong></p>
                    <span>置信水平：</span>
                    <Select defaultValue='0.95' style={{ width: 120 }} onChange={this.CLChange}>
                        <Option key={0.95} value={0.95}>0.95</Option>
                        <Option key={0.99} value={0.99}>0.99</Option>
                    </Select>
                    &nbsp;&nbsp;&nbsp;
                    <span>持有期：</span>
                    <InputNumber min={1} max={1000} defaultValue={1} onChange={this.HPChange} />
                </Timeline.Item>
                <Timeline.Item>
                    <p><strong>填写Monte-Carlo模拟次数</strong></p>
                    <span>模拟次数：</span>
                    <InputNumber min={1000} max={100000} defaultValue={10000} onChange={this.simCountChange} />
                </Timeline.Item>
                <Timeline.Item>
                    <p><strong>确认信息，开始计算</strong></p>
                    <Button type='primary' onClick={this.startCalculate}>计算VaR</Button>
                </Timeline.Item>
                <Timeline.Item>
                    <p><strong>得到VaR值</strong></p>
                    {
                        this.state.calculating ? 
                        <Spin size="large" style={{ zIndex:'10000', position:'relative', display:'block', left:'50%',top:'50%', transform:'translate(-50%, -50%)'}}/>
                        : null
                    }
                    {
                        this.state.result != '' ? <h1>
                            {
                                this.state.result
                            }
                        </h1>
                        : null
                    }
                </Timeline.Item>
            </Timeline>
        </div>
    }
}

export default VaRCalculator;