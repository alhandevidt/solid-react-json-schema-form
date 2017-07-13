import React from "react";
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import PropTypes from "prop-types";

import BaseInput from "./BaseInput";

function logChange(val) {
  console.log("Selected: " + JSON.stringify(val));
}

const FLAVOURS = [
	{ label: 'Chocolate', value: 'chocolate' },
	{ label: 'Vanilla', value: 'vanilla' },
	{ label: 'Strawberry', value: 'strawberry' },
	{ label: 'Caramel', value: 'caramel' },
	{ label: 'Cookies and Cream', value: 'cookiescream' },
	{ label: 'Peppermint', value: 'peppermint' },
];

const WHY_WOULD_YOU = [
	{ label: 'Chocolate (are you crazy?)', value: 'chocolate', disabled: true },
].concat(FLAVOURS.slice(1));

function MultiSelectWidget1(props) {
  const {
    onChange
  } = props;

function  handleSelectChange (value) {
		console.log('You\'ve selected:', value);
		this.setState({ value });
};

  return (
    <div className="col xs-col-12">
      <Select multi simpleValue
        disabled={false}
        value={'chocolate'}
        placeholder="Select your favourite(s)"
        options={FLAVOURS}
        onChange={handleSelectChange}/>
    </div>
  );
}

if (process.env.NODE_ENV !== "production") {
  MultiSelectWidget1.propTypes = {
    value: PropTypes.string,
  };
}

export default MultiSelectWidget1;
