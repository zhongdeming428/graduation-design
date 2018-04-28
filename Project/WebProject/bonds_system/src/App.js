import React, { Component } from 'react';
import './App.css';
import { Layout } from 'antd';
import { HashRouter, Route } from 'react-router-dom';
import LeftMenu from './Components/LeftMenu';
import News from './Components/News';
import ChinaBonds from './Components/ChinaBonds';
import AmericaBonds from './Components/AmericanBonds';
import SHIBOR from './Components/SHIBOR';
import LIBOR from './Components/LIBOR';
import DetailData from './Components/DetailData';
import ZZValuation from './Components/ZZValuation';
import ZZVaR from './Components/ZZVaR';
import VaRCalculator from './Components/VaRCalculator';

const { Header, Content, Sider } = Layout;

class App extends Component {
	constructor() {
		super();
	}
	render() {
		return (
			<HashRouter>
				<Layout className="App">
					<Header className="header">
						<h1 style={{ color: 'white' }}><i>Bonds Data Analysis System</i></h1>
					</Header>
					<Layout className="App_Content">
						<Sider width={200} style={{ background: '#fff', height: '568' }} collapsible={true}>
							<LeftMenu />
						</Sider>
						<Layout style={{ padding: '24px' }}>
							<Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
								<Route exact path='/' component={News} />
								<Route exact path='/BondsData/ChinaBonds' component={ChinaBonds} />
								<Route exact path='/BondsData/AmericaBonds' component={AmericaBonds}/>
								<Route exact path='/BondsData/SHIBOR' component={SHIBOR}/>
								<Route exact path='/BondsData/LIBOR' component={LIBOR}/>
								<Route exact path='/DetailData' component={DetailData}/>
								<Route exact path='/ValuationData' component={ZZValuation}/>
								<Route exact path='/VaRData' component={ZZVaR} />
								<Route exact path='/VaRCalculator' component={VaRCalculator} />
							</Content>
						</Layout>
					</Layout>
				</Layout>
			</HashRouter>
		);
	}
}

export default App;
