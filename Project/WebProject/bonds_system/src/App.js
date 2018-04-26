import React, { Component } from 'react';
import './App.css';
import { Layout } from 'antd';
import { HashRouter, Route } from 'react-router-dom';
import LeftMenu from './Components/LeftMenu';
import News from './Components/News';
import ChinaBonds from './Components/ChinaBonds';

const { Header, Content, Sider } = Layout;

class App extends Component {
  render() {
    return (
		<HashRouter>
			<Layout className="App">
				<Header className="header">
					<h1 style={{color:'white'}}><i>Bonds Data Analysis System</i></h1>
				</Header>
				<Layout className="App_Content">
					<Sider width={200} style={{ background: '#fff',height:'568' }}>
						<LeftMenu/>
					</Sider>
					<Layout style={{ padding: '24px' }}>
						<Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
							<Route exact path='/' component={News}/>
							<Route exact path='/BondsData/ChinaBonds' component={ChinaBonds}/>
						</Content>
					</Layout>
				</Layout>
			</Layout>
		</HashRouter>
    );
  }
}

export default App;
