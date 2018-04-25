import { Table } from 'antd';
import axios from 'axios';

const columns = [{
  title: '日期',
  dataIndex: 'Date',
  sorter: true,
  width: '20%',
}, {
  title: '标准期限说明',
  dataIndex: 'MaturityInstruction',
  width: '20%',
}, {
  title: '标准期限（年）',
  dataIndex: 'Maturity',
  width: '20%'
},{
  title: '收益率（%）',
  dataIndex: 'Yield'
}];

class App extends React.Component {
  state = {
    data: [],
    pagination: {},
    loading: false,
  };
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  }
  fetch = (params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    axios.get('/ChinaBonds').then((data) => {
      const pagination = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      pagination.total = 200;
      this.setState({
        loading: false,
        data: data.results,
        pagination,
      });
    });
  }
  componentDidMount() {
    this.fetch();
  }
  render() {
    return (
      <Table columns={columns}
        rowKey={record => record.registered}
        dataSource={this.state.data}
        pagination={this.state.pagination}
        loading={this.state.loading}
        onChange={this.handleTableChange}
      />
    );
  }
}