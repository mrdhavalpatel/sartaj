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
import { useIntl } from "react-intl";
import ViewOrderDetails from "../components/ecommerce/ViewOrderDetails";
import { Pagination, Spinner } from "react-bootstrap";
import ConfirmationDialog from "../components/dialogs/ConfirmationDialog";
function Account() {
  const intl = useIntl();
  const [userDetails, setUserDetails] = useState("");
  const [orderList, setOrderList] = useState([]);
  const [orderPDFURL, setOrderPDFURL] = useState("");
  const [isOrderPDFOpen, setIsOrderPDFOpen] = useState(false);
  const [showOrderCancel, setShowOrderCancel] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [editData, setEditData] = useState({});
  const [address, setAddress] = useState("");
  const [isOrderListLoading, setIsOrderListLoading] = useState(true);
  const [token, setToken] = useState("");
  const router = useRouter();
  const handleOnClick = (index) => {
    setActiveIndex(index);
  };
  const [show, setShow] = useState(false);
  const initialActiveIndex = router.query.activeIndex
    ? parseInt(router.query.activeIndex, 10)
    : 1;
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const initialValues2 = {
    current_password: "",
    new_password: "",
    confirm_password: "",
  };
  const pageNumbers = [];

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsperpage, setItemsPerPage] = useState(5);
  const indexOfLastItem = currentPage * itemsperpage;
  const indexOfFirstItem = indexOfLastItem - itemsperpage;
  const currentItems = orderList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(orderList.length / itemsperpage);
  const maxPageNumbers = 5;

  let startPage = 1;
  let endPage = totalPages;

  if (totalPages > maxPageNumbers) {
    const halfMaxPages = Math.floor(maxPageNumbers / 2);
    if (currentPage <= halfMaxPages + 1) {
      endPage = maxPageNumbers;
    } else if (currentPage >= totalPages - halfMaxPages) {
      startPage = totalPages - maxPageNumbers + 1;
    } else {
      startPage = currentPage - halfMaxPages;
      endPage = currentPage + halfMaxPages;
    }
  }

  if (startPage > 1) {
    pageNumbers.push("<");
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  if (endPage < totalPages) {
    pageNumbers.push(">");
  }
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  // for (let i = 1; i <= Math.ceil(orderList.length / itemsperpage); i++) {
  //   pageNumbers.push(i);
  // }
  const validationSchema = yup.object().shape({
    f_name: yup
      .string()
      .required(intl.formatMessage({ id: "First name is required" })),
    l_name: yup
      .string()
      .required(intl.formatMessage({ id: "Last name is required" })),
    email: yup
      .string()
      .email(intl.formatMessage({ id: "Invalid email address" }))
      .required(intl.formatMessage({ id: "Email is required" })),
  });

  const validationSchema2 = yup.object().shape({
    current_password: yup
      .string()
      .required(intl.formatMessage({ id: "Current Password is required" })),
    new_password: yup
      .string()
      .min(
        8,
        intl.formatMessage({ id: "New Password must be at least 8 characters" })
      )
      .required(intl.formatMessage({ id: "New Password is required" })),
    confirm_password: yup
      .string()
      .oneOf(
        [yup.ref("new_password"), null],
        intl.formatMessage({ id: "Passwords must match" })
      )
      .required(intl.formatMessage({ id: "Confirm password is required" })),
  });
  const handleViewOrder = (url) => {
    setIsOrderPDFOpen(true);
    setOrderPDFURL(url);
  };

  const handleChangePassword = async (values ,{resetForm}) => {
    let payload = {
      old_password: values?.current_password,
      new_password: values?.new_password,
      confirm_password: values?.confirm_password,
    };
    const response = await axios
      .post(`${API_BASE_URL}auth/reset-password`, payload, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response?.data?.status === 200) {
          toast.success(response?.data?.message);
          resetForm()
        } else {
          toast.error(response?.data?.message);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred while processing your request.");
      });
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
    setIsOrderListLoading(true);
    const response = await api.get("customer/order/list", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${encodedToken}`,
      },
    });
    setOrderList(response?.data);
    setIsOrderListLoading(false);
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

  const handleOrderCancel = async (id) => {
    let encodedToken = localStorage.getItem("token");
    const response = await api.put(
      "customer/order/cancel",
      { order_id: id },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${encodedToken}`,
        },
      }
    );

    if (response?.status === 200) {
      toast.success(response?.data?.message);
      setShowOrderCancel(false);
      setOrderId(null);
      await getOrderList(encodedToken);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  const handleOrderPDFClose = () => {
    setOrderPDFURL(null);
    setIsOrderPDFOpen(false);
  };

  useEffect(() => {
    let encodedToken = localStorage.getItem("token");
    if (encodedToken) {
      setToken(encodedToken);
      getUserDetails(encodedToken);
      getOrderList(encodedToken);
      getAddress(encodedToken);
    } else {
      router.push("/sign-in");
    }
  }, [show]);

  return (
    <>
      {/* <ViewOrderDetails
        isOpen={isOrderPDFOpen}
        pdfUrl={orderPDFURL}
        onClose={handleOrderPDFClose}
      /> */}
      <ConfirmationDialog
        showModal={() => setShowOrderCancel(true)}
        modalShow={showOrderCancel}
        hideModal={() => setShowOrderCancel(false)}
        handleConfirm={handleOrderCancel}
        orderId={orderId}
      />
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
                            {intl.formatMessage({ id: "Dashboard" })}
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className={
                              activeIndex === 2 ? "nav-link active" : "nav-link"
                            }
                            onClick={() => handleOnClick(2)}
                          >
                            <i className="fi-rs-shopping-bag mr-10"></i>
                            {intl.formatMessage({ id: "Orders" })}
                          </a>
                        </li>

                        <li className="nav-item">
                          <a
                            className={
                              activeIndex === 4 ? "nav-link active" : "nav-link"
                            }
                            onClick={() => handleOnClick(4)}
                          >
                            <i className="fi-rs-marker mr-10"></i>
                            {intl.formatMessage({ id: "My Address" })}
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className={
                              activeIndex === 5 ? "nav-link active" : "nav-link"
                            }
                            onClick={() => handleOnClick(5)}
                          >
                            <i className="fi-rs-user mr-10"></i>
                            {intl.formatMessage({ id: "Account details" })}
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
                              className="bi bi-unlock"
                              viewBox="0 0 18 18"
                            >
                              <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2M3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z" />
                            </svg>
                            {intl.formatMessage({ id: "Change Password" })}
                          </a>
                        </li>
                        <li className="nav-item">
                          <Link
                            href="/sign-in"
                            onClick={() => handleLogout()}
                            className="nav-link"
                          >
                            <i className="fi-rs-sign-out mr-10"></i>
                            {intl.formatMessage({ id: "Logout" })}
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
                              {intl.formatMessage({ id: "Hello" })}{" "}
                              {userDetails?.f_name}!{" "}
                            </h3>
                          </div>
                          <div className="card-body">
                            <p>
                              {intl.formatMessage({
                                id: "From your account dashboard. you can easily check",
                              })}
                              &amp; {intl.formatMessage({ id: "view your" })}{" "}
                              <a href="#">
                                {intl.formatMessage({ id: "recent orders" })}
                              </a>
                              ,
                              <br />
                              {intl.formatMessage({ id: "manage your" })}{" "}
                              <a href="#">
                                {intl.formatMessage({
                                  id: "shipping and billing addresses",
                                })}
                              </a>{" "}
                              {intl.formatMessage({ id: "and" })}{" "}
                              <a href="#">
                                {intl.formatMessage({
                                  id: "edit your password and account details.",
                                })}
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
                          <div className="card-header d-flex justify-content-between">
                            <h3 className="mb-0">
                              {intl.formatMessage({ id: "Your Orders" })}
                            </h3>
                            {isOrderListLoading && (
                              <Spinner animation="border" role="status">
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </Spinner>
                            )}
                          </div>
                          <div className="card-body">
                            <div className="table-responsive ordetable_div">
                              <table className="ordetable table">
                                <thead>
                                  <tr>
                                    <th>
                                      {intl.formatMessage({ id: "Order" })}
                                    </th>
                                    <th>
                                      {intl.formatMessage({ id: "Date" })}
                                    </th>
                                    <th>
                                      {intl.formatMessage({ id: "Status" })}
                                    </th>
                                    <th>
                                      {intl.formatMessage({ id: "Total" })}
                                    </th>
                                    <th>
                                      {intl.formatMessage({ id: "Actions" })}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {currentItems.map((Item) => {
                                    return (
                                      <tr key={Item?.id}>
                                        <td>#{Item?.id}</td>
                                        <td>
                                          {moment(Item?.created_at).format(
                                            "MMMM DD YYYY"
                                          )}
                                        </td>
                                        <td>{Item?.order_status}</td>
                                        <td>
                                          ¥{Item?.order_amount}{" "}
                                          {intl.formatMessage({ id: "for" })}{" "}
                                          {Item?.details_count}{" "}
                                          {intl.formatMessage({ id: "item" })}
                                        </td>
                                        <td className="d-flex align-items-center justify-content-between">
                                          <Link
                                            href={{
                                              pathname: "/orders/[id]",
                                              query: {
                                                id: Item?.id,
                                                locale: intl?.locale,
                                              },
                                            }}
                                            as={`${intl.locale}/orders/${Item?.id}`}
                                          >
                                            {intl.formatMessage({
                                              id: "View",
                                            })}
                                          </Link>
                                          {Item?.order_status === "pending" && (
                                            <Button
                                              variant="primary"
                                              className="ordertable_btn"
                                              onClick={() => {
                                                setOrderId(Item?.id);
                                                setShowOrderCancel(true);
                                              }}
                                            >
                                              {intl.formatMessage({
                                                id: "Cancel",
                                              })}
                                            </Button>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                            <Pagination
                              itemsperpage={itemsperpage}
                              totalitems={orderList.length}
                              paginate={setCurrentPage}
                            />
                            <ul className="pagination">
                            {pageNumbers.map((pageNumber, index) => (
            <span key={index}>
                {pageNumber === '<' && (
                    <button className="pagination-button large" onClick={handlePrevPage}>&lt;</button>
                )}
                {pageNumber === '>' && (
                    <button className="pagination-button large" onClick={handleNextPage}>&gt;</button>
                )}
                {pageNumber !== '<' && pageNumber !== '>' && (
                    <button
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`pagination-button ${currentPage === pageNumber ? 'active' : ''}`}
                    >
                        {pageNumber}
                    </button>
                )}
            </span>
        ))}
                            </ul>
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
                            <h3 className="mb-0">
                              {intl.formatMessage({ id: "Change Password" })}
                            </h3>
                          </div>
                          <div className="card-body contact-from-area">
                            <Formik
                              initialValues={initialValues2}
                              validationSchema={validationSchema2}
                              // onSubmit={(value)=>handleChangePassword(value,{resetForm})}
                              onSubmit={(values, {  resetForm }) => {
                                // Handle form submission here
                                handleChangePassword(values , {resetForm});
                                setSubmitting(false);}}
                            >
                              <Form>
                                <div>
                                  <label htmlFor="current_password">
                                    {intl.formatMessage({
                                      id: "Current Password:",
                                    })}
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
                                    {intl.formatMessage({
                                      id: "New Password:",
                                    })}
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
                                    {intl.formatMessage({
                                      id: "Confirm Password:",
                                    })}
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
                                  {intl.formatMessage({
                                    id: "Change Password",
                                  })}
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
                          <div className="col-lg-12">
                            <div className="card mb-3 mb-lg-0">
                              <div className="card-header">
                                <h3 className="mb-0">
                                  {intl.formatMessage({
                                    id: "Billing Address",
                                  })}
                                </h3>
                              </div>
                              <div className="address_row row">
                                {address?.billing_address?.map((address) => (
                                  <div className="mb-3 col-md-4">
                                    <div className="address_card">
                                      <>
                                        <address>
                                          {address?.house
                                            ? `${address?.house}, `
                                            : null}
                                          {address?.floor
                                            ? `${address?.floor} `
                                            : null}
                                          <br />
                                          {address?.address
                                            ? `${address?.address} `
                                            : null}
                                          <br />
                                          {address?.city
                                            ? `${address?.city} - `
                                            : null}{" "}
                                          {address?.post_code
                                            ? `${address?.post_code} `
                                            : null}
                                          <br />
                                          {address?.state
                                            ? `${address?.state} `
                                            : null}
                                          <br />
                                        </address>
                                        <Button
                                          style={{
                                            backgroundColor: "#3e4493",
                                          }}
                                          className="address_btn"
                                          variant="primary"
                                          onClick={() => {
                                            setEditData(address);
                                            handleShow();
                                          }}
                                        >
                                          {intl.formatMessage({ id: "Edit" })}
                                        </Button>{" "}
                                      </>
                                    </div>
                                  </div>
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
                              {intl.formatMessage({ id: "Add New Address" })}
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
                            <h5>
                              {intl.formatMessage({ id: "Account Details" })}
                            </h5>
                          </div>
                          <div className="card-body">
                            <p>
                              {intl.formatMessage({
                                id: "Already have an account?",
                              })}{" "}
                              <Link href="/sign-in">
                                {" "}
                                {intl.formatMessage({ id: "Log in instead!" })}
                              </Link>
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
                                      {intl.formatMessage({ id: "First Name" })}{" "}
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
                                      {intl.formatMessage({ id: "Last Name" })}{" "}
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
                                      {intl.formatMessage({
                                        id: "Display Name",
                                      })}{" "}
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
                                      {intl.formatMessage({
                                        id: "Email Address",
                                      })}{" "}
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
                                      {intl.formatMessage({
                                        id: "Save Change",
                                      })}
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
