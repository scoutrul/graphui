import React, { Component } from "react";
import {array, func} from 'prop-types';
import NotificationSystem from 'react-notification-system';
import './Alerts.css';


export default class Alerts extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this._notificationSystem = null;
	}
	
	componentDidUpdate(prevProps) {
		if (prevProps.alerts !== this.props.alerts) {
			this.addToasts(this.props);
		}
	}
	
	componentDidMount() {
		this._notificationSystem = this.refs.notificationSystem;
	}
	
	addToasts = (response) => {
		let alerts = response.alerts ? response.alerts : response;
		if (!alerts) {
			return;
		}
		alerts.map(v => this.addToast(v.message, v.level));
	};
	
	addToast = (message, level = "info", position = 'tc') => { // level = success, error, warning, info
		this._notificationSystem.addNotification({
			message,
			level,
			position
		});
		this.props.onShow();
	};
	
	render() {
		return <NotificationSystem ref="notificationSystem"/>;
	}
}

Alerts.propTypes = {
	alerts: array,
	onShow: func
};
