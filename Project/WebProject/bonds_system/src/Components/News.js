import React from 'react';
import { List, Spin } from 'antd';
import axios from 'axios';

class News extends React.Component {
    constructor() {
        super();
        this.state = {
            news: [],
            loading: true
        };
    }
    componentDidMount() {
        axios.get('/News').then(news => {
            this.setState({
                news: news.data,
                loading: false
            });
        }, err => {
            console.log(err)
        })
    }
    render() {
        return <div>
            <List borderd="true"
            renderItem={item => (<List.Item>
                <a href={item.Url} target='_blank'>{item.Title}</a>
                <span style={{position:'absolute', right:'0'}}>{item.Time}</span>
            </List.Item>)}    
            dataSource={this.state.news}/>
            { this.state.loading ? <Spin size="large" style={{position:'relative', display:'block', left:'50%',top:'50%', transform:'translate(-50%, -50%)'}}/> : null }
        </div>
    }
}

export default News;