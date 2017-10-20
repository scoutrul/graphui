import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableCardHeader from 'react-md/lib/DataTables/TableCardHeader';
import Card from 'react-md/lib/Cards/Card';
import Button from 'react-md/lib/Buttons/Button';
import FontIcon from 'react-md/lib/FontIcons';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import { ListItem } from 'react-md/lib/Lists';

import Alerts from '../Alerts';
import Errors from '../Errors';
import ModelEdit from '../ModelEdit';

import Header from './Header';
import Body from './Body';

import { CREATE_API_URL } from '../../constants';
import "./InfoTable.css";


export default class InfoTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortedData: this.props.tableData.values,
      sortedIndex: 0,
      ASC: true,
      dialogVisible: false,
      types: [],
      type: '',
      id: null,
      fields: [],
      name: '',
      params: {},
      searchText: ''
    };
  }

  static propTypes = {
    tableData: PropTypes.object,
    tableSettings: PropTypes.object,
    sortable: PropTypes.bool,
    onAddRow: PropTypes.func
  }

  static defaultProps = {
    tableData: {},
    tableSettings: {},
    sortable: true
  }

  componentWillReceiveProps(nextProps) {
    this.renderRows(nextProps.tableData);
    this.setState({ sortedData: this.sort(this.renderRows(nextProps.tableData), 0, true) });
  }

  componentDidMount() {
    this.setState({ sortedData: this.renderRows(this.props.tableData) });
  }

  renderRows(tableData) {
    tableData.values.map((v, i) => {
      let column;
      if (v.tasks.length) {
        column = <i className="md-text--disabled">используется</i>;
      } else {
        column = <div className="">
          <Button
            tooltipLabel="Изменить модель"
            tooltipPosition="left"
            primary
            key={v.id}
            icon
            id={i}
            onClick={this.onClickEdit}
          >edit</Button>
          <MenuButton
            tooltipLabel="Удалить модель"
            tooltipPosition="top"
            secondary
            key={v.id * 100}
            id={i}
            icon
            menuItems={[
              // <Subheader key={0} primary primaryText={"Удалить атрибут" + (name && ` "${name}"`) + "?"} />,
              <ListItem key={1} id={i} primaryText="Удалить!" onClick={this.handlerRemoveModel} />,
              <ListItem key={2} primaryText="Отмена" />,
            ]}
            simplifiedMenu={false}
            repositionOnScroll={false}
          >delete</MenuButton>
        </div>;
      }
      let row = v.row.push(column);
      return { ...v, row };
    });

    return tableData.values;
  }

  shouldComponentUpdate(prevProps, prevStates) {
    // if (this.props.tableData !== prevProps.tableData) {
    //   return true;
    // }
    // if (this.state.sortedIndex$ prevStates.sortedIndex || this.state.ASC !== prevStates.ASC || this.state.searchText !== prevStates.searchText) {
    //   return true;
    // }
    return true;
  }

  sort = (ar, i, ASC) => ar.sort((a, b) => (a[i] - b[i]) * (ASC ? 1 : -1));

  onClickEdit = (e) => {
    let row = this.props.tableData.values[e.currentTarget.id];

    this.setState({
      name: row.name,
      id: row.id,
      type: row.type ? row.type.name : null,
      params: row.params
    },
      this.onAddClick
    );
  }

  handlerRemoveModel = (e) => {
    let id = e.currentTarget.id;
    let row = this.props.tableData.values[id];

    fetch(CREATE_API_URL({ path: `import-service/api/model/${row.id}` }), { method: 'DELETE' })
      .then(response => {
        if (response.status === 200) {
          this.state.sortedData.splice(id, 1);
        } else {
          this.setState({ appStatus: `error: ${response}` });
        }
        return response.json();
      })
      .catch(response => this.setState({ appStatus: 'error', lastError: response }));
  }

  handlerChangeText = searchText => {
    var filteredData = [...this.sort(this.props.tableData.values, this.state.sortedIndex, this.state.ASC)];
    var sortedData = filteredData.filter(obj => {
      let find = 0;
      obj.forEach(v => {
        if (v.indexOf(searchText) + 1) {
          find++;
        }
      });
      return find;
    });

    this.setState({ searchText, sortedData });
  }

  handlerClearText = () => this.setState({ searchText: "", sortedData: this.sort(this.props.tableData.values, this.state.sortedIndex, this.state.ASC) });

  handlerSort = (sortedIndex) => {
    if (this.props.sortable === false) {
      return;
    }
    let ASC = this.state.sortedIndex === sortedIndex ? !this.state.ASC : true;

    this.setState({
      sortedData: this.sort(this.state.sortedData, sortedIndex, ASC),
      sortedIndex,
      ASC
    });
  };

  convertTypes = (data) => {
    let newTypes = [];
    data.values.forEach(v => newTypes.push(v.name));
    return newTypes;
  }

  getTypes = () => {
    this.setState({ appStatus: "loading" });

    fetch(CREATE_API_URL({ path: 'import-service/api/connector/type' }), { method: 'GET' })
      .then(response => {
        if (response.status === 200) {
          this.setState({ appStatus: 'loaded' });
        } else {
          this.setState({ appStatus: `error: ${response}` });
        }
        return response.json();
      })
      .then(data => {
        this.setState({ types: this.convertTypes(data) });
        if (this.state.type) {
          this.getTypeFields();
        }
      })
      .catch(response => this.setState({ appStatus: 'error', lastError: response }));
  }

  getTypeFields = () => {
    this.setState({ appStatus: "loading" });

    fetch(CREATE_API_URL({ path: `import-service/api/connector/type/${this.state.type}/params` }), { method: 'GET' })
      .then(response => {
        if (response.status === 200) {
          this.setState({ appStatus: 'loaded' });
        } else {
          this.setState({ appStatus: `error: ${response}` });
        }
        return response.json();
      })
      .then(data => this.setState({ fields: data }))
      .catch(response => this.setState({ appStatus: 'error', lastError: response }));
  }

  onAddClick = () => {
    // this.getTypes();
    this.setState({ id: null, dialogVisible: true });
  };

  onChangeType = type => this.setState({ type }, this.getTypeFields);
  handlerDialogHide = () => this.setState({ dialogVisible: false, name: '', type: '', id: null, params: {}, fields: [] });

  paramsChangeHandler = (value, e) => {
    this.setState({
      params: { ...this.state.params, [e.target.name]: value }
    });
  };

  render() {
    const { tableSettings, sortable, onAddRow } = this.props;
    let { dialogVisible, sortedData, id, sortedIndex, ASC } = this.state;

    return <Card tableCard>
      <TableCardHeader
        title={"Модели данных"}
        visible={false}
      >
        <Button raised primary onClick={this.onAddClick} iconChildren="add">Добавить</Button>
      </TableCardHeader>
      <DataTable baseId="import-source-list" {...tableSettings}>
        <Header headers={this.props.tableData.headers[0]} onSort={this.handlerSort} sortable={sortable} sortedIndex={sortedIndex} ASC={ASC} />
        <Body values={sortedData} />
      </DataTable>

      <ModelEdit id={id} dialogVisible={dialogVisible} onAddRow={onAddRow} onHideClick={this.handlerDialogHide} />

      <Alerts alerts={this.state.alerts} onShow={this.handlerAlertShow} />
    </Card>;
  }
}