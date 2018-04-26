//这个是layout布局的左边菜单栏部分。

import React, { Component } from 'react';
import  { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
const { SubMenu } = Menu;

const Dictionary = {
    'ChinaBonds':'2',
    'AmericaBonds':'3',
    'SHIBOR':'4',
    'LIBOR':'5',
    'SHBonds':'6',
    'SZBonds':'7',
    'PCA':'8',
    'VaRData':'9',
    'VaRCalculator':'10',
    'ValuationData':'11',
    'Search':'12',
    'CurveFit':'13'
};

class LeftMenu extends Component {
    constructor() {
        super();
        this.state = {
            selectedIndex:'1'
        }
    }
    componentWillMount() {
        let url = window.location.href;
        let currentRouter = url.substring(url.lastIndexOf('/') + 1);
        let selectedIndex = Dictionary[currentRouter];
        selectedIndex = selectedIndex === undefined ? '1' : selectedIndex;
        this.setState({
            selectedIndex
        });
    }
    render() {
        return <Menu
                    mode="inline"
                    defaultSelectedKeys={[this.state.selectedIndex]}
                    style={{ height: '100%', borderRight: 0 }}
                >
                    <Menu.Item key="1">
                        <Link to='/'><Icon type="notification" />
                        <span>新闻公告</span></Link>
                    </Menu.Item>
                    <SubMenu key="sub1" title={<span><Icon type="area-chart" /><span>收益率曲线数据</span></span>}>
                        <Menu.Item key="2"><Link to='/BondsData/ChinaBonds'><span>中国国债历年信息</span></Link></Menu.Item>
                        <Menu.Item key="3"><Link to='/BondsData/AmericaBonds'><span>美国国债历年信息</span></Link></Menu.Item>
                        <Menu.Item key="4"><Link to='/BondsData/SHIBOR'><span>SHIBOR历年信息</span></Link></Menu.Item>
                        <Menu.Item key="5"><Link to='/BondsData/LIBOR'><span>LIBOR历年信息</span></Link></Menu.Item>
                        <Menu.Item key="6"><Link to='/BondsData/SHBonds'><span>沪企债历年信息</span></Link></Menu.Item>
                        <Menu.Item key="7"><Link to='/BondsData/SZBonds'><span>深企债历年信息</span></Link></Menu.Item>
                    </SubMenu>
                    <Menu.Item key="8">
                        <Link to='/PCA'><Icon type="pie-chart" /><span>PCA主成分分析</span></Link>
                    </Menu.Item>
                    <SubMenu key="sub2" title={<span><Icon type="pay-circle" /><span>VaR在险价值</span></span>}>
                        <Menu.Item key="9"><Link to='/VaRData'><span>中债VaR</span></Link></Menu.Item>
                        <Menu.Item key="10"><Link to='/VaRCalculator'><span>VaR计算器</span></Link></Menu.Item>
                    </SubMenu>
                    <Menu.Item key="11">
                        <Link to='/ValuationData'><Icon type="solution" /><span>中债估值数据</span></Link>
                    </Menu.Item>
                    <Menu.Item key="12">
                        <Link to='/Search'><Icon type="search" /><span>数据查询</span></Link>
                    </Menu.Item>
                    <Menu.Item key="13">
                        <Link to='/CurveFit'><Icon type="line-chart" /><span>收益率曲线拟合</span></Link>
                    </Menu.Item>
                </Menu>
    }
}

export default LeftMenu;