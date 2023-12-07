import Layout from "../components/layout/Layout";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { API_BASE_URL, api } from "../lib/api";
import moment from "moment/moment";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import AddressDialog from "../components/dialogs/AddressDialog";
import { useRouter } from "next/router";

function Account() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [userDetails, setUserDetails] = useState("");
  const [orderList, setOrderList] = useState([]);
  const [orderID, setOrderId] = useState("");
  const [editData, setEditData] = useState({});
  const [address, setAddress] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();
  const handleOnClick = (index) => {
    setActiveIndex(index);
  };
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const initialValues2 = {
    current_password: "",
    new_password: "",
    confirm_password: "",
  };

  const validationSchema = yup.object().shape({
    f_name: yup.string().required("First Name is required"),
    l_name: yup.string().required("Last Name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const validationSchema2 = yup.object().shape({
    current_password: yup.string().required("Current Password is required"),
    new_password: yup.string().required("New Password is required"),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("new_password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleChangePassword = async (values) => {
    let payload = {
      old_password: values?.current_password,
      new_password: values?.new_password,
      confirm_password: values?.confirm_password,
    };
    const response = await axios.post(
      `${API_BASE_URL}auth/reset-password`,
      payload,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response?.data?.status === 200) {
      toast.success(response?.data?.meassge);
    } else {
      toast.error(response?.data?.meassge);
    }
  };

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

  const handleLogout = () => {
    localStorage.removeItem("token");
  };
  useEffect(() => {
    let encodedToken = localStorage.getItem("token");
    if (encodedToken) {
      setToken(encodedToken);
      getUserDetails(encodedToken);
      getOrderList(encodedToken);
      getAddress(encodedToken);
    } else {
      router.push("/page-login");
    }
  }, []);

  return (
    <>
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
                              activeIndex === 1 ? "nav-link active" : "nav-link"
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
                              activeIndex === 2 ? "nav-link active" : "nav-link"
                            }
                            onClick={() => handleOnClick(2)}
                          >
                            <i className="fi-rs-shopping-bag mr-10"></i>Orders
                          </a>
                        </li>

                        <li className="nav-item">
                          <a
                            className={
                              activeIndex === 4 ? "nav-link active" : "nav-link"
                            }
                            onClick={() => handleOnClick(4)}
                          >
                            <i className="fi-rs-marker mr-10"></i>My Address
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className={
                              activeIndex === 5 ? "nav-link active" : "nav-link"
                            }
                            onClick={() => handleOnClick(5)}
                          >
                            <i className="fi-rs-user mr-10"></i>Account details
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className={
                              activeIndex === 3 ? "nav-link active" : "nav-link"
                            }
                            onClick={() => handleOnClick(3)}
                          >
                            {/* <svg
                              style={{
                                opacity: 0.8,
                              }}
                              xmlns="http://www.w3.org/2000/svg"
                              id="Outline"
                              viewBox="0 0 24 24"
                              width="15"
                              height="15"
                            >
                              <path d="M19,8.424V7A7,7,0,0,0,5,7V8.424A5,5,0,0,0,2,13v6a5.006,5.006,0,0,0,5,5H17a5.006,5.006,0,0,0,5-5V13A5,5,0,0,0,19,8.424ZM7,7A5,5,0,0,1,17,7V8H7ZM20,19a3,3,0,0,1-3,3H7a3,3,0,0,1-3-3V13a3,3,0,0,1,3-3H17a3,3,0,0,1,3,3Z" />
                              <path d="M12,14a1,1,0,0,0-1,1v2a1,1,0,0,0,2,0V15A1,1,0,0,0,12,14Z" />
                            </svg> */}
                            {/* <i className="fi-rs-crossed-eye"></i> */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="26"
                              height="26"
                              fill="currentColor"
                              class="bi bi-unlock"
                              viewBox="0 0 18 18"
                            >
                              <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2M3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z" />
                            </svg>
                            Change Password
                          </a>
                        </li>
                        <li className="nav-item">
                          <Link
                            href="/page-login"
                            onClick={() => handleLogout()}
                            className="nav-link"
                          >
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
                              From your account dashboard. you can easily check
                              &amp; view your <a href="#">recent orders</a>,
                              <br />
                              manage your{" "}
                              <a href="#">
                                shipping and billing addresses
                              </a> and{" "}
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
                                          ¥{Item?.order_amount} for{" "}
                                          {Item?.details_count} item
                                        </td>
                                        <td>
                                          <a
                                            href={Item?.invoice_link}
                                            className="btn-small d-block"
                                            target="_blank" // Add this attribute
                                            rel="noopener noreferrer" // For security reasons, also include rel="noopener noreferrer"
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
                            <h3 className="mb-0">Change Password</h3>
                          </div>
                          <div className="card-body contact-from-area">
                            <Formik
                              initialValues={initialValues2}
                              validationSchema={validationSchema2}
                              onSubmit={handleChangePassword}
                            >
                              <Form>
                                <div>
                                  <label htmlFor="current_password">
                                    Current Password:
                                  </label>
                                  <Field
                                    type="password"
                                    id="current_password"
                                    name="current_password"
                                  />
                                  <ErrorMessage
                                    name="current_password"
                                    component="div"
                                    style={{ color: "red" }}
                                  />
                                </div>

                                <div>
                                  <label htmlFor="new_password">
                                    New Password:
                                  </label>
                                  <Field
                                    type="password"
                                    id="new_password"
                                    name="new_password"
                                  />
                                  <ErrorMessage
                                    name="new_password"
                                    component="div"
                                    style={{ color: "red" }}
                                  />
                                </div>

                                <div>
                                  <label htmlFor="confirm_password">
                                    Confirm Password:
                                  </label>
                                  <Field
                                    type="password"
                                    id="confirm_password"
                                    name="confirm_password"
                                  />
                                  <ErrorMessage
                                    name="confirm_password"
                                    component="div"
                                    style={{ color: "red" }}
                                  />
                                </div>

                                <button type="submit" className="mt-4">
                                  Change Password
                                </button>
                              </Form>
                            </Formik>
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
                                {address?.billing_address?.map((address) => (
                                  <>
                                    <address>
                                      {address?.house},{address?.floor},
                                      {/* <br /> */}
                                      <br />
                                      {address?.road}, <br />
                                      {address?.address}
                                    </address>
                                    <Button
                                      style={{
                                        backgroundColor: "#3e4493",
                                      }}
                                      variant="primary"
                                      onClick={() => {
                                        setEditData(address);
                                        handleShow();
                                      }}
                                    >
                                      Edit
                                    </Button>{" "}
                                  </>
                                ))}
                              </div>
                            </div>
                            <Button
                              style={{
                                backgroundColor: "#3e4493",
                              }}
                              onClick={() => {
                                handleShow();
                                setEditData({});
                              }}
                            >
                              Add New Address
                            </Button>
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

        <AddressDialog
          address={editData}
          token={token}
          show={show}
          handleClose={handleClose}
        />
      </Layout>
    </>
  );
}

export default Account;
