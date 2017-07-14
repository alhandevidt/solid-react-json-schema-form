import React from 'react';
import createClass from 'create-react-class';
import 'react-select/dist/react-select.css';
import PropTypes from 'prop-types';
import Select from 'react-select';


/*
var MultiSelectWidget = createClass({
	displayName: 'MultiSelectWidget',
	propTypes: {
		label: PropTypes.string,
	},
	getInitialState () {
		return {
			disabled: false,
			crazy: false,
			options: this.props.options.enumOptions.map(opt => ({label: opt, value: opt}) ),
			value: [],
		};
	},
	render () {
		return (
				<Select multi simpleValue disabled={this.props.disabled} value={this.state.value} placeholder="Select your favourite(s)" options={this.state.options}  />

		);
	}
});
*/

function  MultiSelectWidget(props) {
    return (
        <div>
        <Select multi simpleValue disabled={props.disabled} value={"ox"} placeholder="Select your favourite(s)" options={props.options.enumOptions.map(opt => ({label: opt, value: opt}) )}  />
        HEERREEE</div>
    )};

module.exports = MultiSelectWidget;
