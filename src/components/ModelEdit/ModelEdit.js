import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-md/lib/Buttons/Button';
import Errors from '../Errors';
import EntityEdit from '../EntityEdit';
import DialogContainer from 'react-md/lib/Dialogs';
import Toolbar from 'react-md/lib/Toolbars';
import TextField from 'react-md/lib/TextFields';

import Alerts from '../Alerts';

import { CREATE_API_URL } from '../../constants';
import "./ModelEdit.css";

const DEFAULT_MODEL = {
  entities: [],
  dataList: [],
  description: "",
  name: "",
  id: null,
  tasks: []
};

export default class ModelEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // dialogVisible: false,
      model: DEFAULT_MODEL

    };
  }

  static propTypes = {
    id: PropTypes.number,
    onHideClick: PropTypes.func,
    onAddRow: PropTypes.func,
    dialogVisible: PropTypes.bool
  }

  static defaultProps = {
    id: null
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id && nextProps.id !== this.props.id) {
      this.getModel(nextProps.id);
    } else {
      this.setState({ model: DEFAULT_MODEL });
    }
    this.getTypes();
  }

  componentDidMount() {

  }

  shouldComponentUpdate(prevProps, prevStates) {
    return true;
  }

  convertTypes = (data) => {
    let newTypes = [];
    data.values.forEach(v => newTypes.push(v.name));
    return newTypes;
  }

  onClickAddEntity = () => {
    let newEntities = [...this.state.model.entities];
    newEntities.push({
      name: '',
      attributes: []
    });

    this.setState({
      // dialogVisible: true,
      model: {
        ...this.state.model,
        entities: newEntities
      },
      appStatus: "loading"
    });
  }

  handlerDeleteEntity = (i) => {
    let newEntities = [...this.state.model.entities];
    delete newEntities[i];

    this.setState({
      model: {
        ...this.state.model,
        entities: newEntities
      },
      appStatus: "loading"
    });
  }

  handlerDeleteAttribute = (entityId, attributeId) => {
    let newEntities = [...this.state.model.entities];
    let newAttributes = [...newEntities[entityId].attributes];

    delete newAttributes[attributeId];
    newEntities[entityId].attributes = newAttributes;

    this.setState({
      model: {
        ...this.state.model,
        entities: newEntities
      },
      appStatus: "loading"
    });
  }

  getTypes = () => {
    this.setState({ appStatus: "loading" });

    fetch(CREATE_API_URL({ path: `import-service/api/model/entity/attribute/type` }), { method: 'GET' })
      .then(response => {
        if (response.status === 200) {
          this.setState({ appStatus: 'loaded' });
        } else {
          this.setState({ appStatus: `error: ${response}` });
        }
        return response.json();
      })
      .then(types => this.setState({ types }))
      .catch(response => this.setState({ appStatus: 'error', lastError: response }));
  }

  getModel = (modelId) => {
    this.setState({ appStatus: "loading" });

    fetch(CREATE_API_URL({ path: `import-service/api/model/${modelId}` }), { method: 'GET' })
      .then(response => {
        if (response.status === 200) {
          this.setState({ appStatus: 'loaded' });
        } else {
          this.setState({ appStatus: `error: ${response}` });
        }
        return response.json();
      })
      .then(model => this.setState({ model }))
      .catch(response => this.setState({ appStatus: 'error', lastError: response }));
  }

  handlerSave = (model) => {
    console.log('handlerSave');
    console.log(model);
    console.log(this.state);
    // this.setState({ ...this.state, name: value })

    fetch(CREATE_API_URL({ path: 'import-service/api/model' }), {
      method: 'post',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state.model)
    })
      .then(response => {
        if (response.status === 200) {
          this.setState({ appStatus: 'loaded' });
          this.props.onHideClick();
          this.props.onAddRow();
        } else {
          this.setState({ appStatus: `error: ${response}` });
        }
        return response.json();
      })
      .then(response => {
        if (response.errors) {
          let alerts = response.errors.map(alert => { alert.level = "error"; return alert; });
          this.setState({ alerts });
        }
      })
      .catch(response => this.setState({ appStatus: 'error', lastError: response }));
  }

  handlerEntityChange = (entityId, entity) => {
    let entities = this.state.model.entities.slice(0);

    entities[entityId] = entity;

    this.setState({
      model: {
        ...this.state.model,
        entities
      }

      // });
      // this.props.onEntityChange(entityId, this.state);

    });
  }

  handlerAlertShow = () => this.setState({ alerts: [] });

  handlerChangeName = (name) => {
    this.setState({
      model: {
        ...this.state.model,
        name
      }
    });
  }

  handlerChangeDescription = (description) => {
    this.setState({
      model: {
        ...this.state.model,
        description
      }
    });
  }

  //onHideClick = () => this.setState({ dialogVisible: false, name: '', type: '', id: null, params: {}, fields: [] });
  render() {
    let { model, types } = this.state;
    let { dialogVisible } = this.props;

    return (
      <DialogContainer
        id="add-dialog"
        aria-labelledby="add-dialog-title"
        visible={dialogVisible}
        onHide={this.props.onHideClick}
        fullPage
      >
        <Toolbar
          nav={<Button icon onClick={this.props.onHideClick}>arrow_back</Button>}
          title="Модель данных"
          titleId="add-dialog-title"
          fixed
          colored
          actions={<Button type="submit" onClick={this.handlerSave} flat>Сохранить</Button>}
        />
        <section className="md-grid md-cell--12" aria-labelledby={`group-title`}>
          <h2 id={`group-title`} className="md-cell md-cell--12">
            {`Модель данных`}
          </h2>
          <section className="md-cell--12">
            <h2 className="md-cell md-cell--12">&nbsp;</h2>
            <div>
              <Button className='model-add-entity-button' onClick={this.onClickAddEntity} floating fixed fixedPosition='tl' primary swapTheming tooltipLabel={'Добавить сущность'} tooltipPosition={'right'}>add</Button>
            </div>
            <div className="md-grid ">
              <section className="md-cell md-cell--12" style={{ marginLeft: "5%" }}>
                <TextField
                  id="floating-center-title"
                  label="Название модели"
                  fullWidth={true}
                  value={this.state.model.name}
                  onChange={this.handlerChangeName}
                  lineDirection="center"
                />
                <TextField
                  id="floating-center-title"
                  label="Описание модели"
                  fullWidth={true}
                  value={this.state.model.description}
                  rows={2}
                  onChange={this.handlerChangeDescription}
                  lineDirection="center"
                />
              </section>
            </div>
            <div>
              {model && model.entities.map((entity, i) => entity && <EntityEdit
                key={i}
                model={model}
                entity={entity}
                entityId={i}
                types={types}
                onDeleteEntity={this.handlerDeleteEntity}
                onDeleteAttribute={this.handlerDeleteAttribute}
                onEntityChange={this.handlerEntityChange}
              />)}
            </div>
          </section>
        </section>
        <Alerts alerts={this.state.alerts} onShow={this.handlerAlertShow} />
      </DialogContainer>
    );
  }
}