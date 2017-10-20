import React, { Component } from 'react';
import InfoTable from '../InfoTable';
import Alerts from '../Alerts';

import { CREATE_API_URL } from '../../constants';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 1,
      appStatus: "calm",
      tableData: null
    };
  }

  componentDidMount = () => {
    this.getTableData();
  }

  handlerAddRow = () => {
    this.setState({ alerts: [{ message: `Модель данных успешно сохранена`, level: "success" }] });
    this.getTableData();
  }

  getTableData = () => {
    this.setState({
      appStatus: "loading"
    });

    fetch(CREATE_API_URL({ path: 'import-service/api/model' }), { method: 'GET' })
      .then(response => {
        if (response.status === 200) {
          this.setState({ appStatus: 'loaded' });
        } else {
          this.setState({ appStatus: `error: ${response}` });
        }
        return response.json();
      })
      .then(data => {
        let tableData = this.convertTableData(data);
        this.setState({ tableData });
      })
      .catch(response => this.setState({ appStatus: 'error', lastError: response }));
  }

  convertTableData = (data) => {
    let convertedHeaders = [[{ name: "Название" }, { name: "Описание" }, { name: "Использование" }, { name: "" }]];
    let convertedData = [];

    data.values.forEach((v) => {
      convertedData.push({ ...v, row: [v.name, v.description, v.tasks] });
    });

    return { headers: convertedHeaders, values: convertedData };
  }

  handlerAlertShow = () => this.setState({ alerts: [] });

  render() {
    return (
      <div>
        {this.state.tableData && <InfoTable
          tableData={this.state.tableData}
          tableSettings={{ plain: true }}
          sortable={false}
          onAddRow={this.handlerAddRow}
        />}
        <Alerts alerts={this.state.alerts} onShow={this.handlerAlertShow} />
      </div>
    );
  }
}