import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import IconSeparator from 'react-md/lib/Helpers/IconSeparator';
import FontIcon from 'react-md/lib/FontIcons';

export default class Header extends Component {

  static propTypes = {
    headers: PropTypes.array,
    sortedIndex: PropTypes.number,
    sortIconClass: PropTypes.string,
    onSort: PropTypes.func,
    ASC: PropTypes.bool,
    sortable: PropTypes.bool
  }

  static defaultProps = {
    headers: [],
    sortable: true
  }

  shouldComponentUpdate(prevProps) {
    if (this.props.sortedIndex !== prevProps.sortedIndex || this.props.ASC !== prevProps.ASC || this.props.headers !== prevProps.headers) {
      return true;
    }

    return true;
  }

  render() {
    const { sortable } = this.props;
    let sortIconClass = this.props.ASC ? 'rotate-90' : 'rotate-270';
    return (
      <TableHeader>
        <TableRow>
          {this.props.headers.map((header, i) => <TableColumn
            key={i}
            onClick={this.props.onSort.bind({}, i)}
            className="cursor-pointer"
          >
            <IconSeparator label={header.name} iconBefore>
              {sortable && <FontIcon className={this.props.sortedIndex === i ? sortIconClass + ' md-background--secondary round' : ''}>arrow_forward</FontIcon>}
            </IconSeparator>
          </TableColumn>)}
        </TableRow>
      </TableHeader>);
  }
}