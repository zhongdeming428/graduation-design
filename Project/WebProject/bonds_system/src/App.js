import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class App extends Component {
  render() {
    return (
		<Layout className="App">
			<Header className="header">
				<h1 style={{color:'white'}}><i>Bonds Data Analysis System</i></h1>
			</Header>
			<Layout className="App_Content">
				<Sider width={200} style={{ background: '#fff',height:'568' }}>
					<Menu
						mode="inline"
						defaultSelectedKeys={['1']}
						style={{ height: '100%', borderRight: 0 }}
					>
						<Menu.Item key="1"><Icon type="notification" />新闻公告</Menu.Item>
						<SubMenu key="sub1" title={<span><Icon type="area-chart" />收益率曲线数据</span>}>
							<Menu.Item key="2">中国国债历年信息</Menu.Item>
							<Menu.Item key="3">美国国债历年信息</Menu.Item>
							<Menu.Item key="4">SHIBOR历年信息</Menu.Item>
							<Menu.Item key="5">LIBOR历年信息</Menu.Item>
							<Menu.Item key="6">沪企债历年信息</Menu.Item>
							<Menu.Item key="7">深企债历年信息</Menu.Item>
						</SubMenu>
						<Menu.Item key="8"><Icon type="pie-chart" />PCA主成分分析</Menu.Item>
						<SubMenu key="sub2" title={<span><Icon type="pay-circle" />VaR在险价值</span>}>
							<Menu.Item key="9">中债VaR</Menu.Item>
							<Menu.Item key="10">VaR计算器</Menu.Item>
						</SubMenu>
						<Menu.Item key="11"><Icon type="solution" />中债估值数据</Menu.Item>
						<Menu.Item key="12"><Icon type="search" />数据查询</Menu.Item>
						<Menu.Item key="13"><Icon type="line-chart" />收益率曲线拟合</Menu.Item>
					</Menu>
				</Sider>
				<Layout style={{ padding: '24px' }}>
					<Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
						Content
          			</Content>
				</Layout>
			</Layout>
		</Layout>
    );
  }
}

export default App;
