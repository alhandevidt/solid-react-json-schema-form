import React, { Component } from "react";
import PropTypes from "prop-types";
import fields from "../components/fields";
import {
  getDefaultFormState,
  shouldRender,
  toIdSchema,
  setState,
  getDefaultRegistry,
} from "../utils";
import validateFormData from "../validate";
import forms from "..";
import { rangeSpec } from "../utils";
import widgets from "../components/widgets";

console.log(widgets.MultiSelectWidget);

function SolidDescriptionField(props) {
  const { id, description } = props;
  if (!description) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  if (typeof description === "string") {
    return (
      <p id={id} className="field-description xs-pb1">
        {description}
      </p>
    );
  } else {
    return (
      <div id={id} className="field-description xs-pb1">
        {description}
      </div>
    );
  }
}

function SolidCheckboxWidget(props) {
  const {
    schema,
    id,
    value,
    required,
    disabled,
    readonly,
    label,
    autofocus,
    onChange,
  } = props;
  return (
    <div className={`checkbox-field ${disabled || readonly ? "disabled" : ""}`}>
      {schema.description &&
        <fields.DescriptionField description={schema.description} />}
        <input
          type="checkbox"
          className="checkbox"
          id={id}
          checked={typeof value === "undefined" ? false : value}
          required={required}
          disabled={disabled || readonly}
          autoFocus={autofocus}
          onChange={event => onChange(event.target.checked)}
        />
        <label htmlFor={id}>
          {label}
      </label>
    </div>
  );
}

SolidCheckboxWidget.defaultProps = {
  autofocus: false,
};

function selectValue(value, selected, all) {
  const at = all.indexOf(value);
  const updated = selected.slice(0, at).concat(value, selected.slice(at));
  // As inserting values at predefined index positions doesn't work with empty
  // arrays, we need to reorder the updated selection to match the initial order
  return updated.sort((a, b) => all.indexOf(a) > all.indexOf(b));
}

function deselectValue(value, selected) {
  return selected.filter(v => v !== value);
}

function SolidCheckboxesWidget(props) {
  const { id, disabled, options, value, autofocus, readonly, onChange } = props;
  const { enumOptions, inline } = options;
  return (
    <div className="CheckboxesWidget" id={id}>
      {enumOptions.map((option, index) => {
        const checked = value.indexOf(option.value) !== -1;
        const disabledCls = disabled || readonly ? "disabled" : "";
        const checkbox = (
          <span>
            <input
              type="checkbox"
              className="checkbox"
              id={`${id}_${index}`}
              checked={checked}
              disabled={disabled || readonly}
              autoFocus={autofocus && index === 0}
              onChange={event => {
                const all = enumOptions.map(({ value }) => value);
                if (event.target.checked) {
                  onChange(selectValue(option.value, value, all));
                } else {
                  onChange(deselectValue(option.value, value));
                }
              }}
            />
            <label htmlFor={`${id}_${index}`}>{option.label}</label>
          </span>
        );
        return <div key={index} className={`checkbox-inline ${disabledCls}`}>
              {checkbox}
            </div>
      })}
    </div>
  );
}

function SolidTextareaWidget(props) {
  const {
    id,
    options,
    placeholder,
    value,
    required,
    disabled,
    readonly,
    autofocus,
    onChange,
    onBlur,
  } = props;
  const _onChange = ({ target: { value } }) => {
    return onChange(value === "" ? options.emptyValue : value);
  };
  return (
    <textarea
      id={id}
      className="textarea"
      value={typeof value === "undefined" ? "" : value}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      autoFocus={autofocus}
      rows={options.rows}
      onBlur={onBlur && (event => onBlur(id, event.target.value))}
      onChange={_onChange}
    />
  );
};

SolidTextareaWidget.defaultProps = {
  autofocus: false,
  options: {},
};

function SolidSelectWidget(props) {
  const {
    schema,
    id,
    options,
    value,
    required,
    disabled,
    readonly,
    multiple,
    autofocus,
    onChange,
    onBlur,
    placeholder,
  } = props;
  const { enumOptions } = options;
  const emptyValue = multiple ? [] : "";
  return (
    <select
      id={id}
      multiple={multiple}
      className="select"
      value={typeof value === "undefined" ? emptyValue : value}
      required={required}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      onBlur={
        onBlur &&
        (event => {
          const newValue = getValue(event, multiple);
          onBlur(id, processValue(schema, newValue));
        })
      }
      onChange={event => {
        const newValue = getValue(event, multiple);
        onChange(processValue(schema, newValue));
      }}>
      {!multiple &&
        !schema.default &&
        <option value="">
          {placeholder}
        </option>}
      {enumOptions.map(({ value, label }, i) => {
        return (
          <option key={i} value={value}>
            {label}
          </option>
        );
      })}
    </select>
  );
}

SolidSelectWidget.defaultProps = {
  autofocus: false,
};

function SolidErrorListTemplate(props) {
  const { errors } = props;
  return (
    <div>
      {errors.map((error, i) => {
        return (
            <div key={i} className="page-message page-message--error">
              <div className="page-message__text">
                <svg className="page-message__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38" aria-hidden="true">
                  <title>Error</title>
                  <path d="M19 16.878l-6.364-6.363-2.12 2.12L16.878 19l-6.365 6.364 2.12 2.12L19 21.122l6.364 6.365 2.12-2.12L21.122 19l6.365-6.364-2.12-2.12L19 16.877z"/>
                </svg>
                {error.stack}
              </div>
            </div>
        )})}
    </div>);
}


function Label(props) {
  const { label, required, id } = props;
  if (!label) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  return (
    <label className="form-label" htmlFor={id}>
      {required ? label + "*" : label}
    </label>
  );
}


function SolidFieldTemplate(props) {
  const {
    id,
    classNames,
    label,
    children,
    errors,
    help,
    description,
    hidden,
    required,
    displayLabel,
  } = props;
  if (hidden) {
    return children;
  }

  const solidClassNames = classNames + " xs-pb2";
  console.log(classNames);
  return (
    <div className={solidClassNames}>
      {displayLabel && <Label label={label} required={required} id={id} />}
      {displayLabel && description ? <div className="xs-text-4"> {description} </div>: null}
      {children}
      {errors}
      {help}
    </div>
  );
};


const REQUIRED_FIELD_SYMBOL = "*";


function SolidTitleField(props) {
  const { id, title, required } = props;
  const style={
    borderBottom: '1px solid #e5e5e5'
  }
  const legend = required ? title + REQUIRED_FIELD_SYMBOL : title;
  return (
    <legend className="xs-text-1" style={style} id={id}>
      {legend}
    </legend>
  );
}

function SolidBaseInput(props) {
  // Note: since React 15.2.0 we can't forward unknown element attributes, so we
  // exclude the "options" and "schema" ones here.
  const {
    value,
    readonly,
    disabled,
    autofocus,
    onBlur,
    options,
    schema,
    formContext,
    registry,
    ...inputProps
  } = props;

  inputProps.type = options.inputType || inputProps.type || "text";
  const _onChange = ({ target: { value } }) => {
    return props.onChange(value === "" ? options.emptyValue : value);
  };
  return (
    <input
      className="text-input"
      readOnly={readonly}
      disabled={disabled}
      autoFocus={autofocus}
      value={value == null ? "" : value}
      {...inputProps}
      onChange={_onChange}
      onBlur={onBlur && (event => onBlur(inputProps.id, event.target.value))}
    />
  );
};

SolidBaseInput.defaultProps = {
  type: "text",
  required: false,
  disabled: false,
  readonly: false,
  autofocus: false,
};

function SolidRangeWidget(props) {
  const { schema, value } = props;
  return (
    <div className="field-range-wrapper">
      <SolidBaseInput className="text-input" ype="range" {...props} {...rangeSpec(schema)} />
      <span className="range-view">
        {value}
      </span>
    </div>
  );
}

function SolidTextWidget(props) {
  return <SolidBaseInput {...props} />;
}

function SolidColorWidget(props) {
  const { disabled, readonly } = props;
  return <SolidBaseInput type="color" {...props} disabled={disabled || readonly} />;
}

function SolidUpDownWidget(props) {
  return <SolidBaseInput type="number" {...props} {...rangeSpec(props.schema)} />;
}

function fromJSONDate(jsonDate) {
  return jsonDate ? jsonDate.slice(0, 19) : "";
}

function toJSONDate(dateString) {
  if (dateString) {
    return new Date(dateString).toJSON();
  }
}

function SolidDateTimeWidget(props) {
  const { value, onChange } = props;
  return (
    <SolidBaseInput
      type="datetime-local"
      {...props}
      value={fromJSONDate(value)}
      onChange={value => onChange(toJSONDate(value))}
    />
  );
}

function SolidPasswordWidget(props) {
  return <SolidBaseInput type="password" {...props} />;
}

const solidwidgets = {
  CheckboxWidget: SolidCheckboxWidget,
  SelectWidget: SolidSelectWidget,
  TextWidget: SolidTextWidget,
  ColorWidget: SolidColorWidget,
  DateTimeWidget: SolidDateTimeWidget,
  RangeWidget: SolidRangeWidget,
  UpDownWidget: SolidUpDownWidget,
  TextareaWidget: SolidTextareaWidget,
  PasswordWidget: SolidPasswordWidget,
  CheckboxesWidget: SolidCheckboxesWidget,
  multiselect: widgets.MultiSelectWidget
};

const solidFields = {
  TitleField: SolidTitleField,
  DescriptionField: SolidDescriptionField
}

export default function SolidForm(props) {
  return <forms.Form showErrorList={true}
               ErrorList={SolidErrorListTemplate}
               FieldTemplate={SolidFieldTemplate}
               widgets={solidwidgets}
               fields={solidFields} {...props}>
    <div>
      <button className="button button--secondary" type="submit">Submit</button>
    </div>
  </forms.Form>;
};
