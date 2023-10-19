import React from "react";
import { Field, ErrorMessage } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateInput = ({ field, form, ...props }) => {
  const { name, value } = field;
  const { touched, errors, setFieldValue } = form;

  const handleChange = (date) => {
    setFieldValue(name, date);
  };

  // Parse the value into a Date object if it's a string
  //   const parsedValue = typeof value === "string" ? new Date(value) : value;

  return (
    <div className="form-group">
      <div className="input-group custom-date-picker-container">
        <DatePicker
          selected={value}
          onChange={handleChange}
          name={name}
          dateFormat="MM/dd/yyyy" // You can customize the date format
          placeholderText={props.placeholder}
          className={`form-control  ${
            touched[name] && errors[name] ? "is-invalid" : ""
          }`}
        />
      </div>
      <ErrorMessage name={name} component="div" className="text-danger" />
    </div>
  );
};

export default DateInput;
