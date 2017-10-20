import React, { Component } from "react";
import PropTypes from 'prop-types';
import Snackbar from 'react-md/lib/Snackbars';
import './Errors.css';

export default class Errors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toasts: [],
            autohide: false,
        };
    }

    static propTypes = {
        errors: PropTypes.array,
        response: PropTypes.object,
        onDismiss: PropTypes.func
    }

    static defaultProps = {
        errors: [],
        response: {}
    }

    componentDidUpdate(prevProps) {
        if (prevProps.errors !== this.props.errors) {
            this.addToasts(this.props);
        }
    }

    addToasts = (response) => {
        let errors = response.errors ? response.errors : response;
        if (!errors) {
            return;
        }
        errors.map(v => this.addToast(v.message));
    };

    addToast = (text = "", action, autohide = true) => {
        this.setState((state) => {
            const toasts = state.toasts.slice();
            toasts.push({ text, action });
            return { toasts, autohide };
        });
    };

    dismissToast = () => {
        const [, ...toasts] = this.state.toasts;
        this.setState({ toasts });
        if (this.props.onDismiss) {
            this.props.onDismiss();
        }
    };

    render() {
        const { toasts } = this.state;
        return <Snackbar
            id="error-snackbar"
            toasts={toasts}
            autohide={true}
            autohideTimeout={5000}
            onDismiss={this.dismissToast}
        />;
    }
}