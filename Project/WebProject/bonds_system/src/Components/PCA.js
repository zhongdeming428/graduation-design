import React from 'react';
import axios from 'axios';
import { Select, Upload, InputNumber, Table, Input, Modal, message, Icon, Timeline, Button, Spin } from 'antd';

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
        if(type !== 'csv') {
            message.error('当前只支持上传.csv文件！');
            return false;
        }
    }
};
const MethodChange = function(value) {
    //上传方式变化。
    this.setState({type: value});
};
//csv被上传了。
let fileUploaded = function(value) {
    this.setState({filename: value});
};
function info() {
    Modal.info({
        title: '数据文件上传注意事项',
        content: (
            <div>
                <p>1.上传的CSV文件，数据不要有空数据或者其他类型的数据。</p>
                <p>2.数据列不需要添加表头。</p>
            </div>
        ),
        onOk() { }
    });
}
const generateTable = function(value) {
    let theads = [];
    let tds = [];
    for(let i=0; i < value; i++) {
        theads.push(<th>{'V' + i}</th>);
        tds.push(<td><Input type='number' id={'input_' + i}/></td>);
    }
    tds.push(<td>
        <Button type='primary'><Icon type='plus-circle'/></Button>
    </td>);
    tds.push(<td>
        <Button type='danger'><Icon type='minus-circle' /></Button>
    </td>);
    theads.push(<th></th>);
    theads.push(<th></th>);
    let tbody = <tbody>
        <tr>
            {
                tds
            }
        </tr>
    </tbody>;
    let table = <table>
        <thead>
            { theads }
        </thead>
        {
            tbody
        }
    </table>;
    this.setState({table, tableColCount: value});
};
const addData = function() {
    let cols = this.state.tableColCount;
    for(let i = 0; i < cols; i++) {
        let id = 'input_' + i;
        let value = document.getElementById(id).value;
        //先不写了。
    }
};
const deleteData = function() {

};
class PCA extends React.Component {
    constructor() {
        super();
        this.state = {
            type: 2,
            table: null,
            tableColCount: 10,
            filename: ''
        };
        this.MethodChange = MethodChange.bind(this);
        this.generateTable = generateTable.bind(this);
    }
    render() {
        return <div>
            <h2>PCA主成分分析</h2>
            <Timeline>
                <Timeline.Item>
                    <p><strong>选择收益率曲线数据的上传方式</strong></p>
                    <Select defaultValue='CSV数据文件上传' disabled  style={{ width: 200 }} onChange={this.MethodChange}>
                        <Option key={1} value={1}>填写数据上传</Option>
                        <Option key={2} value={2}>CSV数据文件上传</Option>
                    </Select>
                </Timeline.Item>
                <Timeline.Item>
                    <p><strong>上传债券收益率曲线数据</strong></p>
                    {
                        this.state.type === 2 ? 
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
                        this.state.type === 1 ? 
                        <div>
                            <InputNumber min={3} max={20} defaultValue={8} onChange={this.generateTable} />
                            {
                                this.state.table
                            }
                        </div>
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

export default PCA;