import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { API_BASE_URL } from "../../lib/api";
import { toast } from "sonner";

const AddressDialog = ({ address, token, show, handleClose }) => {
  // Define the validation schema using Yup
  const validationSchema = Yup.object().shape({
    address: Yup.string().required("Address is required"),
    road: Yup.string(),
    house: Yup.string(),
    floor: Yup.string(),
    contact_person_name: Yup.string().required(
      "Contact person name is required"
    ),
    contact_person_number: Yup.string().required(
      "Contact person number is required"
    ),
  });
  // Initial form values
  const initialValues = {
    address: address?.address,
    road: address?.road,
    house: address?.house,
    floor: address?.floor,
    city: address?.city,
    state: address?.state,
    post_code: address?.post_code,
    contact_person_name: address?.contact_person_name,
    contact_person_number: address?.contact_person_number,
  };

  const handleFormSubmit = async (values) => {
    let payload = {
      address: values?.address,
      road: values?.road,
      house: values?.house,
      floor: values?.floor,
      city: values?.city,
      state: values?.state,
      post_code: values?.post_code,
      contact_person_name: values?.contact_person_name,
      contact_person_number: values?.contact_person_number,
    };
    if (!isEmptyObject(address)) {
      payload.id = address?.id;
    }
    const response = isEmptyObject(address)
      ? await axios.post(`${API_BASE_URL}customer/address/add`, payload, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      : await axios.put(
          `${API_BASE_URL}customer/address/update/${payload?.id}}`,
          payload,
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
    handleClose();
    if (response?.status === 200) {
      toast.success("Address updated successfully");
    }
  };
  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEmptyObject(address) ? "Add Address" : "Update Address"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          enableReinitialize
          initialValues={
            isEmptyObject(address)
              ? {
                  address: "",
                  road: "",
                  house: "",
                  floor: "",
                  city: "",
                  state: "",
                  post_code: "",
                  contact_person_name: "",
                  contact_person_number: "",
                }
              : initialValues
          }
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          <Form>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Address<span className="text-danger">*</span>
              </label>

              <Field
                type="text"
                className="form-control"
                id="address"
                name="address"
              />
              <ErrorMessage
                name="address"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="road" className="form-label">
                Road
              </label>
              <Field
                type="text"
                className="form-control"
                id="road"
                name="road"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="house" className="form-label">
                House
              </label>
              <Field
                type="text"
                className="form-control"
                id="house"
                name="house"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="floor" className="form-label">
                Floor
              </label>
              <Field
                type="text"
                className="form-control"
                id="floor"
                name="floor"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="contact_person_name" className="form-label">
                City
              </label>
              <Field
                type="text"
                className="form-control"
                id="city"
                name="city"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="contact_person_name" className="form-label">
                State
              </label>
              <Field
                type="text"
                className="form-control"
                id="state"
                name="state"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="contact_person_name" className="form-label">
                Post Code
              </label>
              <Field
                type="text"
                className="form-control"
                id="state"
                name="post_code"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="contact_person_name" className="form-label">
                Contact Person Name
              </label>
              <Field
                type="text"
                className="form-control"
                id="contact_person_name"
                name="contact_person_name"
              />
              <ErrorMessage
                name="contact_person_name"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="contact_person_number" className="form-label">
                Contact Person Number
              </label>
              <Field
                type="text"
                className="form-control"
                id="contact_person_number"
                name="contact_person_number"
              />
              <ErrorMessage
                name="contact_person_number"
                component="div"
                className="text-danger"
              />
            </div>

            <Button variant="secondary" type="submit">
              Save
            </Button>
          </Form>
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default AddressDialog;
