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
                        新闻公告</Link>
                    </Menu.Item>
                    <SubMenu key="sub1" title={<span><Icon type="area-chart" />收益率曲线数据</span>}>
                        <Menu.Item key="2"><Link to='/BondsData/ChinaBonds'>中国国债历年信息</Link></Menu.Item>
                        <Menu.Item key="3"><Link to='/BondsData/AmericaBonds'>美国国债历年信息</Link></Menu.Item>
                        <Menu.Item key="4"><Link to='/BondsData/SHIBOR'>SHIBOR历年信息</Link></Menu.Item>
                        <Menu.Item key="5"><Link to='/BondsData/LIBOR'>LIBOR历年信息</Link></Menu.Item>
                        <Menu.Item key="6"><Link to='/BondsData/SHBonds'>沪企债历年信息</Link></Menu.Item>
                        <Menu.Item key="7"><Link to='/BondsData/SZBonds'>深企债历年信息</Link></Menu.Item>
                    </SubMenu>
                    <Menu.Item key="8">
                        <Link to='/PCA'><Icon type="pie-chart" />PCA主成分分析</Link>
                    </Menu.Item>
                    <SubMenu key="sub2" title={<span><Icon type="pay-circle" />VaR在险价值</span>}>
                        <Menu.Item key="9"><Link to='/VaRData'>中债VaR</Link></Menu.Item>
                        <Menu.Item key="10"><Link to='/VaRCalculator'>VaR计算器</Link></Menu.Item>
                    </SubMenu>
                    <Menu.Item key="11">
                        <Link to='/ValuationData'><Icon type="solution" />中债估值数据</Link>
                    </Menu.Item>
                    <Menu.Item key="12">
                        <Link to='/Search'><Icon type="search" />数据查询</Link>
                    </Menu.Item>
                    <Menu.Item key="13">
                        <Link to='/CurveFit'><Icon type="line-chart" />收益率曲线拟合</Link>
                    </Menu.Item>
                </Menu>
    }
}

export default LeftMenu;