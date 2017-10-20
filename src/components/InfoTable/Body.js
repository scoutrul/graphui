import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';

export default class Body extends Component {

    static propTypes = {
        values: PropTypes.array
    }

    static defaultProps = {
        values: []
    }

    /**
     * @todo this.props.values и prevProps.values всегда равны (хотя не должны), из-за чего нельзя правильно составить условие
     * 
     * @param {any} prevProps 
     * @returns 
     * @memberof Body
     */
    shouldComponentUpdate(prevProps) {
        if (this.props.values !== prevProps.values) {
            return true;
        }
        return true;
    }

    render() {
        return (
            <TableBody>
                {this.props.values.map((rows, i) =>
                    <TableRow key={rows.id}>
                        {rows.row.map((column, i2) =>
                            <TableColumn key={i2} className="prevent-grow">{column}</TableColumn>)}
                    </TableRow>
                )}
            </TableBody>);
    }
}