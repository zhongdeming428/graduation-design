import React from 'react';
import axios from 'axios';
import { Button, Upload, Icon, message, Timeline, Select, InputNumber } from 'antd';


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
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    beforeUpload(file, fileList) {
        let type = file.name.substring(file.name.lastIndexOf('.') + 1);
        if(type !== 'xlsx') {
            message.error('当前只支持上传.xlsx文件！');
            return false;
        }
    }
};

const CLChange = function(value) {
    console.log(value);
};

const HPChange = function(value) {
    console.log(value);
};

const startCalculate = function() {

};

class VaRCalculator extends React.Component {
    constructor() {
        super();
        this.CLChange = CLChange.bind(this);
        this.HPChange = HPChange.bind(this);
        this.startCalculate = startCalculate.bind(this);
    }
    render() {
        return <div>
            <h2>VaR计算器</h2>
            <Timeline>
                <Timeline.Item>
                    <p><strong>上传债券历史收益率数据</strong></p>
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">点击区域上传文件或者拖动文件到此区域</p>
                    </Dragger>
                </Timeline.Item>
                <Timeline.Item>
                    <p><strong>选择置信水平和持有期</strong></p>
                    <span>置信水平：</span>
                    <Select defaultValue='0.95'  style={{ width: 120 }} onChange={this.CLChange}>
                        <Option key={0.95} value={0.95}>0.95</Option>
                        <Option key={0.99} value={0.99}>0.99</Option>
                    </Select>
                    &nbsp;&nbsp;&nbsp;
                    <span>持有期：</span>
                    <InputNumber min={1} max={1000} defaultValue={1} onChange={this.HPChange} />
                </Timeline.Item>
                <Timeline.Item>
                    <p><strong>确认信息，开始计算</strong></p>
                    <Button type='primary' onClick={this.startCalculate}>计算VaR</Button>
                </Timeline.Item>
                <Timeline.Item>
                    <p><strong>得到VaR值</strong></p>
                    
                </Timeline.Item>
            </Timeline>
        </div>
    }
}

export default VaRCalculator;