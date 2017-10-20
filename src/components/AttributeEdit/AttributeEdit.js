import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import SelectField from 'react-md/lib/SelectFields';
import EditDialogColumn from 'react-md/lib/DataTables/EditDialogColumn';
import FontIcon from 'react-md/lib/FontIcons';
import Radio from 'react-md/lib/SelectionControls/Radio';
import { ListItem } from 'react-md/lib/Lists';
import MenuButtonColumn from 'react-md/lib/DataTables/MenuButtonColumn';
import DropdownMenuColumn from 'react-md/lib/DataTables/DropdownMenuColumn';
import Subheader from 'react-md/lib/Subheaders';
import IconSeparator from 'react-md/lib/Helpers/IconSeparator';
import Button from 'react-md/lib/Buttons/Button';
import AccessibleFakeButton from 'react-md/lib/Helpers/AccessibleFakeButton';

import "./AttributeEdit.css";

export default class AttributeEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.props.attribute,
      show: false,
      constraints: this.props.attribute.constraints || []
    };
  }

  static propTypes = {
    attribute: PropTypes.object,
    model: PropTypes.object,
    onDeleteAttribute: PropTypes.func,
    onChangePrimary: PropTypes.func,
    onChangeForeign: PropTypes.func,
    onDeleteAttributeE: PropTypes.func,
    onChangeAttribute: PropTypes.func,
    types: PropTypes.array,
    entityId: PropTypes.number,
    attributeId: PropTypes.number
  }

  static defaultProps = {
    attribute: {},
    model: {},
    types: []
  }

  componentWillReceiveProps(nextProps) {

  }
  componentDidMount() {

  }
  componentWillUnmount() {

  }

  shouldComponentUpdate(prevProps, prevStates) {
    return true;
  }

  fixChange() {
    this.props.onChangeAttribute(this.props.entityId, this.props.attributeId, this.state);
  }

  handlerChangeType = (dataType) => {
    this.setState({ dataType },
      () => this.fixChange()
    );
  }

  handlerChangeText = (name) => {
    this.setState({ name },
      () => this.fixChange()
    );
  }

  handlerRemoveAttribute = () => {
    this.props.onDeleteAttribute(this.props.entityId, this.props.attributeId);
    this.props.onDeleteAttributeE(this.props.attributeId);
  }

  getLinks = () => {
    let links = [];
    this.props.model.entities.forEach((entity, i) => {
      if (entity) {
        links.push({ style: { fontWeight: 700 }, key: i, label: entity.name || " ", disabled: true });
        // links.push(<Subheader primary key={i} primaryText={entity.name || " "} />);

        let count = 0;
        entity.attributes.forEach((attribute, j) => {
          if (attribute) {
            if (!(this.state.name === attribute.name && this.props.entityId === i) && this.state.dataType === attribute.dataType) {
              count++;
              // let key = '' + i + j;
              let label = `${entity.name}.${attribute.name}`;
              let value = `${i}.${j}`;

              links.push({ value: label, key: value, active: this.isSelected(entity.name, attribute.name), label: label || " ", leftIcon: <FontIcon>link</FontIcon> });
              // links.push(<ListItem key={key} active={this.isSelected(entity.name, attribute.name)} primaryText={attribute.name || " "} leftIcon={<FontIcon>link</FontIcon>} />);
            }
          }
        });
        !count && links.pop();
      }
    });

    return links;
  }

  hasKey = key => this.state.constraints.some(v => v.type === key);

  linkTo = () => {
    // let linkName = "";
    let value = "";
    if (this.hasKey("FOREIGN_KEY")) {
      this.state.constraints.some(v => {
        if (v.type === "FOREIGN_KEY") {
          // linkName = `${v.foreignEntity}.${v.foreignEntityAttribute}`;
          value = `${v.foreignEntity}.${v.foreignEntityAttribute}`;
          return true;
        }
      });
    }
    // return linkName;
    return value;
  };

  isSelected = (entity, attribute) => this.state.constraints.some(v => v.foreignEntity === entity && v.foreignEntityAttribute === attribute);
  onDismiss = () => this.setState({ errors: [] });
  handlerChangePrimary = (v, event) => this.props.onChangePrimary(v, event, this.props.attributeId);
  handlerChangeForeign = (v, event) => {
    let [toEntity, toAttribute] = v.split(".");
    let constraints = this.state.constraints.filter(constraint => constraint.type !== "FOREIGN_KEY");

    constraints.push({
      constraint_type: "FOREIGN_KEY",
      type: "FOREIGN_KEY",
      foreignEntity: toEntity,
      foreignEntityAttribute: toAttribute
    });

    this.setState({ constraints },
      () => this.fixChange()
    );
  }

  render() {
    const { types, attribute } = this.props;
    let { name, dataType } = this.state;

    //   <TextField
    //   id="attribute"
    //   label="Название атрибута"
    //   type="text"
    //   value={attribute.name}
    //   lineDirection="center"
    //   // inlineIndicator={<FontIcon className={'cursor-default'} onClick={this.handlerClearText}>{'clear'}</FontIcon>}
    //   helpOnFocus={true}
    //   onChange={onChange}
    // />
    return (
      <TableRow>
        <TableColumn>
          <Radio
            checked={this.hasKey("PRIMARY_KEY")}
            onChange={this.handlerChangePrimary}
            label=''
            id={`${this.props.entityId}_${this.props.attributeId}`}
            name={name}
            value={name}
          />
        </TableColumn>

        <EditDialogColumn
          placeholder="Введите название атрибута"
          defaultValue={attribute.name}
          inline
          onChange={this.handlerChangeText}
        />

        <TableColumn>
          <SelectField
            id="select-field-5"
            placeholder="Тип данных"
            menuItems={types}
            value={dataType}
            position={SelectField.Positions.BELOW}
            simplifiedMenu={false}
            onChange={this.handlerChangeType}
          />
        </TableColumn>
        <TableColumn>
          <SelectField
            id="select-field-6"
            placeholder="связь"
            menuItems={this.getLinks()}
            value={this.linkTo()}
            simplifiedMenu={false}
            onChange={this.handlerChangeForeign}
          />
        </TableColumn>
        <MenuButtonColumn
          icon
          repositionOnScroll={false}
          centered
          menuItems={[
            // <Subheader key={0} primary primaryText={"Удалить атрибут" + (name && ` "${name}"`) + "?"} />,
            <ListItem key={1} primaryText="Удалить!" onClick={this.handlerRemoveAttribute} />,
            <ListItem key={2} primaryText="Отмена" />,
          ]}
        >
          <FontIcon className={'cursor-pointer'} error>delete</FontIcon>
        </MenuButtonColumn>
      </TableRow>
    );
  }
}