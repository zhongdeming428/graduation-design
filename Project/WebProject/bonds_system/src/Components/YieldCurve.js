import React from 'react';
import { DatePicker, Modal, Button } from 'antd';
import moment from 'moment';
import axios from 'axios';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);

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
        // console.log(res);
        var data = res.data;
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
        warning('Error!', err);
    });
};

class YieldCurve extends React.Component {
    constructor(props) {
        super();
        this.state = {
            latestDate: props.latestDate,
            chart: null,
            type: props.type
        };
        this.dateChange = dateChange.bind(this);
        this.generateYieldCurve = generateYieldCurve.bind(this);
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
        let chart = Highcharts.chart('yield-curve', {
            chart: {
                type: 'spline'
            },
            title: {
                text: '收益率数据'
            },
            credits: {
                enabled: false
            },
            subtitle: {
                text: '数据来源: 中债网'
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
        this.setState({chart});
    }
    componentWillReceiveProps(newProps) {
        this.setState({
            latestDate: newProps.latestDate
        });
    }
    render() {
        return <div>
            <DatePicker value={moment(this.state.latestDate)} onChange={this.dateChange}/>
            <Button style={{margin:'0 5px'}} type='primary' onClick={()=>{this.generateYieldCurve(this.state.type, this.state.latestDate)}}>生成收益率曲线</Button>
            <div id='yield-curve' style={{overFlow: 'show', minHeight: '400px', margin: '5px 0', height: '400px'}}>
                
            </div>
        </div>
    }
}

export default YieldCurve;