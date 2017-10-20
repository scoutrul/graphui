import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableBody from 'react-md/lib/DataTables/TableBody';
import Button from 'react-md/lib/Buttons/Button';
import TableCardHeader from 'react-md/lib/DataTables/TableCardHeader';
import { ListItem } from 'react-md/lib/Lists';
import MenuButton from 'react-md/lib/Menus/MenuButton';

import Errors from '../Errors';
import AttributeEdit from '../AttributeEdit';
import { Card, CardActions } from 'react-md/lib/Cards/';
import "./EntityEdit.css";
import TextField from 'react-md/lib/TextFields';


export default class EntityEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.props.entity,
      description: ''
    };
  }

  static propTypes = {
    entity: PropTypes.object,
    types: PropTypes.object,
    model: PropTypes.object,
    onDeleteEntity: PropTypes.func,
    onEntityChange: PropTypes.func,
    onDeleteAttribute: PropTypes.func,
    entityId: PropTypes.number
  }

  static defaultProps = {
    model: {},
    entity: {},
    types: {}
  }

  componentWillReceiveProps(nextProps) {

  }
  componentDidMount() {

  }

  shouldComponentUpdate(prevProps, prevStates) {
    return true;
  }

  handlerChangeText = (v) => {

  }

  handlerRemoveEntity = () => {
    this.props.onDeleteEntity(this.props.entityId);
  }

  handlerAddAttribute = () => {
    var attributes = [...this.state.attributes];
    attributes.push({
      name: '',
      constraints: [],
      description: '',
      dataType: ''
    });
    this.setState({ attributes });
  }

  handlerChangeName = name => this.setState({ name }, this.fixChange);
  handlerChangeDescription = description => this.setState({ description }, this.fixChange);


  handlerDeleteAttributeE = attributeId => {
    let attributes = [...this.state.attributes];

    delete attributes[attributeId];

    this.setState({
      attributes,
      appStatus: "loading"
    });
  }

  handlerChangePrimary = (v, event, attributeId) => {
    let attributes = this.state.attributes.slice(0);

    attributes.forEach((attribute, i) => {
      attribute.constraints.forEach((constraint, i2) => {
        if (constraint && constraint.type === "PRIMARY_KEY") {
          attributes[i].constraints.splice(i2, 1);
        }
      });
    });

    attributes[attributeId].constraints.push({
      constraint_type: "PRIMARY_KEY",
      type: "PRIMARY_KEY"
    });

    this.setState({ attributes });
  }

  fixChange = () => {
    this.props.onEntityChange(this.props.entityId, this.state);
  }

  handlerChangeAttribute = (entityId, attributeId, attribute) => {
    let attributes = this.state.attributes.slice(0);

    attributes[attributeId] = attribute;

    this.setState({ attributes }, this.fixChange);
  }

  onDismiss = () => this.setState({ errors: [] });

  render() {
    const { types, model, entityId, onDeleteAttribute } = this.props;
    let { attributes, name, description } = this.state;

    return (
      <Card className={"entity-holder"} raise={false} tableCard={true}>

        <MenuButton
          secondary
          key="deleteAttribute"
          id="deleteAttribute"
          icon
          tooltipLabel="Удалить сущность"
          tooltipPosition="left"
          style={{ float: "right" }}
          menuStyle={{ float: "right", margin: "-40px -10px 0 0" }}
          menuItems={[
            // <Subheader key={0} primary primaryText={"Удалить атрибут" + (name && ` "${name}"`) + "?"} />,
            <ListItem key={1} primaryText="Удалить!" onClick={this.handlerRemoveEntity} />,
            <ListItem key={2} primaryText="Отмена" />,
          ]}
          simplifiedMenu={false}
          repositionOnScroll={false}
        >clear</MenuButton>

        <TextField
          id="entity-name"
          className="entity-text-field-title"
          value={name}
          placeholder="Название сущности"
          onChange={this.handlerChangeName}
        />
        <TextField
          id="entity-description"
          className="entity-text-field-description"
          value={description}
          rows={1}
          placeholder="Описание сущности"
          onChange={this.handlerChangeDescription}
        />
        <DataTable baseId="simple-selectable-table" plain >
          <TableBody>
            {attributes && attributes.map((attribute, i) => attribute && <AttributeEdit
              key={i}
              model={model}
              entityId={entityId}
              attributeId={i}
              attribute={attribute}
              types={types.values}
              onChange={this.handlerChangeText}
              onChangePrimary={this.handlerChangePrimary}
              onChangeAttribute={this.handlerChangeAttribute}
              onDeleteAttribute={onDeleteAttribute}
              onDeleteAttributeE={this.handlerDeleteAttributeE}
            />)}
          </TableBody>
        </DataTable>
        <CardActions style={{ float: 'right' }}>
          <Button onClick={this.handlerAddAttribute} flat primary iconChildren={'add_circle'}>Добавить атрибут</Button>
        </CardActions>
        <Errors errors={this.state.errors} onDismiss={this.onDismiss} />
      </Card>
    );
  }
}