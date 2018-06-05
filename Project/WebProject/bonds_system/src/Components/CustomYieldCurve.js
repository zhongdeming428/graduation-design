import React from 'react';
import axios from 'axios';
import { Button, InputNumber, Icon, message } from 'antd';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);

const addData = function() {
    let { maturity, yieldRate } = this.state;
    if(maturity == 0 || yieldRate == 0.0) {
        message.warn('不能有数据为空！');
        return false;
    }
    if(String(maturity).indexOf('.') != -1) {
        message.warn('到期期限请不要填写小数！');
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
    axios.post('/YieldCurve', {
        data: this.state.data
    }).then(res => {
        let data = res.data;
        data.sort((a, b) => {
            return parseFloat(a.year) - parseFloat(b.year);
        });
        let x = data.map(d => {
            return parseFloat(d.year);
        });
        let y = data.map(d => {
            return parseFloat(d.yield);
        });
        this.state.chart.update({xAxis: {categories: x}, series:[{data: y}]});
    }, err => {
        message.warn(err.message);
    });
};

class CustomYieldCurve extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            maturity: 0,
            yieldRate: 0.0,
            chart: null
        };
        this.addData = addData.bind(this);
        this.deleteData = deleteData.bind(this);
        this.startFit = startFit.bind(this);
    }
    componentDidMount() {
        Highcharts.setOptions({
            lang: {
                printChart: "打印图表",
                downloadJPEG: "下载JPEG 图片",
                downloadPDF: "下载PDF文档",
                downloadPNG: "下载PNG 图片",
                downloadSVG: "下载SVG 矢量图",
                exportButtonTitle: "导出图片",
                downloadCSV: "下载CSV格式文件",
                downloadXLS: "下载XLS格式文件"
            }
        });
        let chart = Highcharts.chart('custom-yield-curve', {
            chart: {
                type: 'spline'
            },
            title: {
                text: '收益率曲线'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: []
            },
            yAxis: {
                title: {
                    text: '收益率'
                }
            },
            tooltip: {
                crosshairs: true,
                shared: true
            },
            plotOptions: {
                spline: {
                    marker: {
                        radius: 2,
                        lineColor: '#06c',
                        lineWidth: 1
                    }
                }
            },
            series: [{
                data: []
            }]
        });
        // document.getElementsByClassName('highcharts-container')[0].style.width = '947px';
        // document.getElementsByClassName('highcharts-root')[0].style.width = '100%';
        this.setState({chart});
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
            <h2 style={{marginTop: '20px'}}>收益率曲线</h2>
            <div id='custom-yield-curve' style={{width: '947px', minHeight: '400px', margin: '50px 5%', height: '400px'}}>
                
            </div>
        </div>
    }
}

export default CustomYieldCurve;