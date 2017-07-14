import React, { Component } from "react";
import { render } from "react-dom";

import forms from "../src";

const schemas = {
  schema: {
    title: "A registration form",
    description: "A simple form example.",
    type: "object",
    required: ["firstName", "lastName", "age"],
    properties: {
      firstName: {
        type: "string",
        title: "First name",
      },
      lastName: {
        type: "string",
        title: "Last name",
      },
      age: {
        type: "integer",
        title: "Age",
      },
      animal: {
        type: "array",
        title: "Animals",
        items: {
          type: "string",
          enum: ["kitty", "puppy", "pony", "ox"],
        },
      },
      multipleChoicesList: {
        type: "array",
        title: "Boyot",
        items: {
          type: "string",
          enum: ["foo", "bar", "fuzz", "qux"],
        },
        uniqueItems: true,
      },
      bio: {
        type: "string",
        title: "Bio",
      },
      password: {
        type: "string",
        title: "Password",
        minLength: 3,
      },
      telephone: {
        type: "string",
        title: "Telephone",
        minLength: 10,
      },
    },
  },
  uiSchema: {
    firstName: {
      "ui:autofocus": true,
      "ui:emptyValue": "",
    },
    age: {
      "ui:widget": "updown",
      "ui:title": "Age of Person",
      "ui:description": "(earthian year)",
    },
    animal: {
      "ui:widget": "multiselect",
    },
    multipleChoicesList: {
      "ui:widget": "checkboxes",
    },
    bio: {
      "ui:widget": "textarea",
    },
    password: {
      "ui:widget": "password",
      "ui:help": "Hint: Make it strong!",
    },
    date: {
      "ui:widget": "alt-datetime",
    },
    telephone: {
      "ui:options": {
        inputType: "tel",
      },
    },
  },
  formData: {
    firstName: "Chuck",
    lastName: "Norris",
    age: 75,
    multipleChoicesList: ["foo", "bar"],
    bio: "Roundhouse kicking asses since 1940",
    password: "noneed"
  },
};


const log = (type) => console.log.bind(console, type);

render((
  <forms.SolidForm schema={schemas.schema}
        liveValidate={true}
        uiSchema={schemas.uiSchema}
        formData={schemas.formData}
        onChange={log("changed")}
        onSubmit={log("submitted")}
        onError={log("errors")} />
), document.getElementById("app"));
