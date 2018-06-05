import React from 'react';
import axios from 'axios';
import { Select, Upload, InputNumber, Table, Input, Modal, message, Icon, Timeline, Button, Spin } from 'antd';

const Option = Select.Option;
const Dragger = Upload.Dragger;
const ratesColumns = [
    {
        title: '特征值',
        dataIndex: 'eigenVals'
    },
    {
        title: '贡献度',
        dataIndex: 'rate'
    },
    {
        title: '累计贡献度',
        dataIndex: 'culmulativeRate'
    }
];
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
const PCCountChange = function(value) {
    this.setState({
        componentCount: value
    });
};
const startCalculate = function() {
    this.setState({calculating: true});
    let type = this.state.type;
    // 手写功能暂未实现，先置为空字符。
    let data = '';
    let file = this.state.filename;
    let componentCount = this.state.componentCount;
    axios.post('/CalculatePCA', {
        type,
        file,
        data,
        componentCount
    }).then(res => {
        let rates = res.data.rates;
        let loadings = res.data.loadings;
        let newLoadings = [];
        loadings.forEach(l => {
            let tmp = {};
            l.forEach((d, i) => {
                tmp['主成分' + String(i + 1)] = d;
            });
            newLoadings.push(tmp);
        });
        let obj = newLoadings[0];
        let keys = Object.keys(obj);
        let result = keys.map(k => {
            let obj = {};
            obj['title'] = k;
            obj['dataIndex'] = k;
            return obj;
        });
        this.setState({
            calculating: false,
            result: {
                rates,
                loadings: newLoadings,
                loadingsColumns: result
            }
        });
    }, err => {
        message.error(err.message);
        this.setState({calculating: false});
    });
};
class PCA extends React.Component {
    constructor() {
        super();
        this.state = {
            type: 2,
            table: null,
            data: '',
            tableColCount: 10,
            filename: '',
            componentCount: 3,
            calculating: false,
            result: null
        };
        this.MethodChange = MethodChange.bind(this);
        this.generateTable = generateTable.bind(this);
        this.PCCountChange = PCCountChange.bind(this);
        this.startCalculate = startCalculate.bind(this);
        fileUploaded = fileUploaded.bind(this);
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
                    <p><strong>填写所需主成分个数</strong></p>
                    <span>主成分个数：</span>
                    <InputNumber min={1} max={100} defaultValue={3} onChange={this.PCCountChange} />
                </Timeline.Item>
                <Timeline.Item>
                    <p><strong>确认信息，开始计算</strong></p>
                    <Button type='primary' onClick={this.startCalculate}>PCA分析</Button>
                </Timeline.Item>
                <Timeline.Item>
                    <p><strong>得到主成分分析结果</strong></p>
                    {
                        this.state.calculating ? 
                        <Spin size="large" style={{ zIndex:'10000', position:'relative', display:'block', left:'50%',top:'50%', transform:'translate(-50%, -50%)'}}/>
                        : null
                    }
                    {
                        this.state.result != null ? 
                        <div>
                            <h2>各维度贡献度</h2>
                            {
                                <Table columns={ratesColumns} dataSource={this.state.result.rates}/>
                            }
                            <h2>因子载荷矩阵</h2>
                            {
                                <Table columns={this.state.result.loadingsColumns} dataSource={this.state.result.loadings}/>
                            }
                        </div>
                        : null
                    }
                </Timeline.Item>
            </Timeline>
        </div>
    }
}

export default PCA;