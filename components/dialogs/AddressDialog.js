import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { API_BASE_URL } from "../../lib/api";
import { toast } from "react-toastify";

const AddressDialog = ({ address, token, show, handleClose }) => {
  // Define the validation schema using Yup
  const validationSchema = Yup.object().shape({
    address: Yup.string().required("Address is required"),
    road: Yup.string(),
    house: Yup.string(),
    floor: Yup.string(),
    contact_person_name: Yup.string(),
    contact_person_number: Yup.string(),
  });
  console.log("address", address);
  // Initial form values
  const initialValues = {
    address: address?.billing_address?.[0]?.address,
    road: address?.billing_address?.[0]?.road,
    house: address?.billing_address?.[0]?.house,
    floor: address?.billing_address?.[0]?.floor,
    contact_person_name: address?.billing_address?.[0]?.contact_person_name,
    contact_person_number: address?.billing_address?.[0]?.contact_person_number,
  };

  const handleFormSubmit = async (values) => {
    let payload = {
      id: 1,
      address: values?.address,
      road: values?.road,
      house: values?.house,
      floor: values?.floor,
      contact_person_name: values?.contact_person_name,
      contact_person_number: values?.contact_person_number,
    };
    const response = await axios.put(
      `${API_BASE_URL}customer/address/update/${1}`,
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

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Address</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          enableReinitialize
          initialValues={initialValues}
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
                Contact Person Name
              </label>
              <Field
                type="text"
                className="form-control"
                id="contact_person_name"
                name="contact_person_name"
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
