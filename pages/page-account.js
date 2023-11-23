import Layout from "../components/layout/Layout";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import PrivateRoute from "../components/PrivateRoute/PrivateRoute";
import { ApiCall } from "../lib/other/other";
import { API_BASE_URL, api } from "../lib/api";
import moment from "moment/moment";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import AddressDialog from "../components/dialogs/AddressDialog";
function Account() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [userDetails, setUserDetails] = useState("");
  const [orderList, setOrderList] = useState([]);
  const [orderID, setOrderId] = useState("");
  const [address, setAddress] = useState("");
  const [token, setToken] = useState("");
  const handleOnClick = (index) => {
    setActiveIndex(index); // remove the curly braces
  };
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const validationSchema = yup.object().shape({
    f_name: yup.string().required("First Name is required"),
    l_name: yup.string().required("Last Name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
  });
  const handleAccountDetailsSubmit = async (values) => {
    let payload = {
      f_name: values?.f_name,
      l_name: values?.l_name,
      email: values?.email,
    };
    const response = await axios.put(
      `${API_BASE_URL}customer/update-profile`,
      payload,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response?.status === 200) {
      toast.success("Profile updated successfully");
    }
    return response;
  };
  const getUserDetails = async (encodedToken) => {
    try {
      const response = await api.get("customer/info", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${encodedToken}`,
        },
      });
      setUserDetails(response?.data);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const getOrderList = async (encodedToken) => {
    const response = await api.get("customer/order/list", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${encodedToken}`,
      },
    });
    setOrderList(response?.data);
  };
  const getAddress = async (encodedToken) => {
    const response = await api.get("customer/address/list", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${encodedToken}`,
      },
    });
    setAddress(response?.data);
  };
  // customer/address/list
  const handleOrderTrackSubmit = async () => {
    const response = await axios.post(
      `${API_BASE_URL}customer/order/track`,
      { order_id: orderID },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };
  useEffect(() => {
    let encodedToken = localStorage.getItem("token");
    setToken(encodedToken);
    getUserDetails(encodedToken);
    getOrderList(encodedToken);
    getAddress(encodedToken);
  }, []);

  return (
    <>
      <PrivateRoute authCheck>
        <Layout parent="Home" sub="Pages" subChild="Account">
          <div className="page-content pt-150 pb-150">
            <div className="container">
              <div className="row">
                <div className="col-lg-10 m-auto">
                  <div className="row">
                    <div className="col-md-3">
                      <div className="dashboard-menu">
                        <ul className="nav flex-column" role="tablist">
                          <li className="nav-item">
                            <a
                              className={
                                activeIndex === 1
                                  ? "nav-link active"
                                  : "nav-link"
                              }
                              onClick={() => handleOnClick(1)}
                            >
                              <i className="fi-rs-settings-sliders mr-10"></i>
                              Dashboard
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className={
                                activeIndex === 2
                                  ? "nav-link active"
                                  : "nav-link"
                              }
                              onClick={() => handleOnClick(2)}
                            >
                              <i className="fi-rs-shopping-bag mr-10"></i>Orders
                            </a>
                          </li>
                          {/* <li className="nav-item">
                            <a
                              className={
                                activeIndex === 3
                                  ? "nav-link active"
                                  : "nav-link"
                              }
                              onClick={() => handleOnClick(3)}
                            >
                              <i className="fi-rs-shopping-cart-check mr-10"></i>
                              Track Your Order
                            </a>
                          </li> */}
                          <li className="nav-item">
                            <a
                              className={
                                activeIndex === 4
                                  ? "nav-link active"
                                  : "nav-link"
                              }
                              onClick={() => handleOnClick(4)}
                            >
                              <i className="fi-rs-marker mr-10"></i>My Address
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className={
                                activeIndex === 5
                                  ? "nav-link active"
                                  : "nav-link"
                              }
                              onClick={() => handleOnClick(5)}
                            >
                              <i className="fi-rs-user mr-10"></i>Account
                              details
                            </a>
                          </li>
                          <li className="nav-item">
                            <Link href="/page-login" className="nav-link">
                              <i className="fi-rs-sign-out mr-10"></i>Logout
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-9">
                      <div className="tab-content account dashboard-content pl-50">
                        <div
                          className={
                            activeIndex === 1
                              ? "tab-pane fade active show"
                              : "tab-pane fade "
                          }
                        >
                          <div className="card">
                            <div className="card-header">
                              <h3 className="mb-0">
                                Hello {userDetails?.f_name}!{" "}
                              </h3>
                            </div>
                            <div className="card-body">
                              <p>
                                From your account dashboard. you can easily
                                check &amp; view your{" "}
                                <a href="#">recent orders</a>,
                                <br />
                                manage your{" "}
                                <a href="#">
                                  shipping and billing addresses
                                </a>{" "}
                                and{" "}
                                <a href="#">
                                  edit your password and account details.
                                </a>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            activeIndex === 2
                              ? "tab-pane fade active show"
                              : "tab-pane fade "
                          }
                        >
                          <div className="card">
                            <div className="card-header">
                              <h3 className="mb-0">Your Orders</h3>
                            </div>
                            <div className="card-body">
                              <div className="table-responsive">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>Order</th>
                                      <th>Date</th>
                                      <th>Status</th>
                                      <th>Total</th>
                                      <th>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {orderList.map((Item) => {
                                      return (
                                        <tr>
                                          <td>#{Item?.id}</td>
                                          <td>
                                            {moment(Item?.created_at).format(
                                              "MMMM DD YYYY"
                                            )}
                                          </td>
                                          <td>{Item?.order_status}</td>
                                          <td>
                                            ${Item?.order_amount} for{" "}
                                            {Item?.details_count} item
                                          </td>
                                          <td>
                                            <a
                                              href="#"
                                              className="btn-small d-block"
                                            >
                                              View
                                            </a>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            activeIndex === 3
                              ? "tab-pane fade active show"
                              : "tab-pane fade "
                          }
                        >
                          <div className="card">
                            <div className="card-header">
                              <h3 className="mb-0">Orders tracking</h3>
                            </div>
                            <div className="card-body contact-from-area">
                              <p>
                                To track your order please enter your OrderID in
                                the box below and press "Track" button. This was
                                given to you on your receipt and in the
                                confirmation email you should have received.
                              </p>
                              <div className="row">
                                <div className="col-lg-8">
                                  <form
                                    className="contact-form-style mt-30 mb-50"
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      handleOrderTrackSubmit();
                                    }}
                                  >
                                    <div className="input-style mb-20">
                                      <label>Order ID</label>
                                      <input
                                        name="order-id"
                                        placeholder="Found in your order confirmation email"
                                        type="text"
                                        onChange={(e) =>
                                          setOrderId(e.target.value)
                                        }
                                        value={orderID}
                                      />
                                    </div>
                                    {/* <div className="input-style mb-20">
                                      <label>Billing email</label>
                                      <input
                                        name="billing-email"
                                        placeholder="Email you used during checkout"
                                        type="email"
                                      />
                                    </div> */}
                                    <button
                                      className="submit submit-auto-width"
                                      type="submit"
                                    >
                                      Track
                                    </button>
                                  </form>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            activeIndex === 4
                              ? "tab-pane fade active show"
                              : "tab-pane fade "
                          }
                        >
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="card mb-3 mb-lg-0">
                                <div className="card-header">
                                  <h3 className="mb-0">Billing Address</h3>
                                </div>
                                <div className="card-body">
                                  <address>
                                    {address?.billing_address?.[0]?.house},
                                    <br />
                                    {address?.billing_address?.[0]?.floor},
                                    <br />
                                    {address?.billing_address?.[0]?.road},{" "}
                                    <br />
                                    {address?.billing_address?.[0]?.address}
                                  </address>
                                  <Button
                                    style={{
                                      backgroundColor: "#3e4493",
                                    }}
                                    variant="primary"
                                    onClick={handleShow}
                                  >
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            </div>
                            {/* <div className="col-lg-6">
                              <div className="card">
                                <div className="card-header">
                                  <h5 className="mb-0">Shipping Address</h5>
                                </div>
                                <div className="card-body">
                                  <address>
                                    4299 Express Lane
                                    <br />
                                    Sarasota, <br />
                                    FL 34249 USA <br />
                                    Phone: 1.941.227.4444
                                  </address>
                                  <p>Sarasota</p>
                                  <a href="#" className="btn-small">
                                    Edit
                                  </a>
                                </div>
                              </div>
                            </div> */}
                          </div>
                        </div>
                        <div
                          className={
                            activeIndex === 5
                              ? "tab-pane fade active show"
                              : "tab-pane fade "
                          }
                        >
                          <div className="card">
                            <div className="card-header">
                              <h5>Account Details</h5>
                            </div>
                            <div className="card-body">
                              <p>
                                Already have an account?{" "}
                                <Link href="/page-login">Log in instead!</Link>
                              </p>
                              <Formik
                                enableReinitialize
                                initialValues={{
                                  f_name: userDetails?.f_name,
                                  l_name: userDetails?.l_name,
                                  dname:
                                    userDetails?.f_name + userDetails?.l_name,
                                  email: userDetails?.email,
                                }}
                                validationSchema={validationSchema}
                                onSubmit={(values) => {
                                  handleAccountDetailsSubmit(values);
                                }}
                              >
                                <Form>
                                  <div className="row">
                                    <div className="form-group col-md-6">
                                      <label>
                                        First Name{" "}
                                        <span className="required">*</span>
                                      </label>
                                      <Field
                                        required=""
                                        className="form-control"
                                        name="f_name"
                                        type="text"
                                      />
                                    </div>
                                    <div className="form-group col-md-6">
                                      <label>
                                        Last Name{" "}
                                        <span className="required">*</span>
                                      </label>
                                      <Field
                                        required=""
                                        className="form-control"
                                        name="l_name"
                                      />
                                    </div>
                                    <div className="form-group col-md-12">
                                      <label>
                                        Display Name{" "}
                                        <span className="required">*</span>
                                      </label>
                                      <Field
                                        required=""
                                        className="form-control"
                                        name="dname"
                                        type="text"
                                      />
                                    </div>
                                    <div className="form-group col-md-12">
                                      <label>
                                        Email Address{" "}
                                        <span className="required">*</span>
                                      </label>
                                      <Field
                                        required=""
                                        className="form-control"
                                        name="email"
                                        type="email"
                                      />
                                    </div>
                                    {/* <div className="form-group col-md-12">
                                    <label>
                                      Current Password{" "}
                                      <span className="required">*</span>
                                    </label>
                                    <input
                                      required=""
                                      className="form-control"
                                      name="password"
                                      type="password"
                                    />
                                  </div>
                                  <div className="form-group col-md-12">
                                    <label>
                                      New Password{" "}
                                      <span className="required">*</span>
                                    </label>
                                    <input
                                      required=""
                                      className="form-control"
                                      name="npassword"
                                      type="password"
                                    />
                                  </div>
                                  <div className="form-group col-md-12">
                                    <label>
                                      Confirm Password{" "}
                                      <span className="required">*</span>
                                    </label>
                                    <input
                                      required=""
                                      className="form-control"
                                      name="cpassword"
                                      type="password"
                                    />
                                  </div> */}
                                    <div className="col-md-12">
                                      <button
                                        type="submit"
                                        className="btn btn-fill-out submit font-weight-bold"
                                        name="submit"
                                        value="Submit"
                                      >
                                        Save Change
                                      </button>
                                    </div>
                                  </div>
                                </Form>
                              </Formik>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Update Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Formik></Formik>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleClose}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal> */}
          <AddressDialog
            address={address}
            token={token}
            show={show}
            handleClose={handleClose}
          />
        </Layout>
      </PrivateRoute>
    </>
  );
}

export default Account;
