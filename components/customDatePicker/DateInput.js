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

  // Get the current date
  const currentDate = new Date();

  return (
    <div className="form-group">
      <div className="input-group custom-date-picker-container">
        <DatePicker
          selected={value}
          onChange={handleChange}
          name={name}
          dateFormat="dd/MM/yyyy"
          placeholderText={props.placeholder}
          showYearDropdown
          showMonthDropdown
          maxDate={currentDate}  // Set maxDate to the current date
          dropdownMode="select"
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
