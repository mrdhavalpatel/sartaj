import { connect } from "react-redux";
import Layout from "../components/layout/Layout";
import {
  clearCart,
  closeCart,
  decreaseQuantity,
  deleteFromCart,
  increaseQuantity,
  openCart,
} from "../redux/action/cart";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { API_BASE_URL, api } from "../lib/api";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { ApiCall } from "../lib/other/other";
import { useIntl } from "react-intl";
import { translatedItemDetails } from "../util/util";
import * as Yup from "yup";

const Cart = ({
  openCart,
  cartItems,
  activeCart,
  closeCart,
  increaseQuantity,
  decreaseQuantity,
  deleteFromCart,
  clearCart,
}) => {
  const [userDetails, setUserDetails] = useState([]);
  const [address, setAddress] = useState([]);
  const [coupenCode, setCoupenCode] = useState("");
  const [coupenCodeDis, setCoupenCodeDis] = useState("");
  const [cartTotal, setCartTotal] = useState([]);
  const [coupanDetails, setCoupanDetails] = useState("");
  const [coupanRes, setCoupanRes] = useState("");
  const router = useRouter();
  const [cartItemsData, setCartItemsData] = useState([]);
  const [timeSlot, setTimeSlot] = useState([]);
  const [selectedRadioId, setSelectedRadioId] = useState(timeSlot?.[0]?.id);
  const [selectedAddressPrefillData, setSelectedAddressPrefillData] = useState(
    []
  );
  const [ip, setIp] = useState("");
  const [browserData, setBrowserData] = useState([]);
  const [selectedAddressData, setSelectedAddressData] = useState({});

  const [selectedAddressDropdown, setSelectedAddressDropdown] = useState("");
  const [orderNotes, setorderNotes] = useState();
  const [religionData, setReligionData] = useState([]);
  const [selectedregion, setSelectedRegion] = useState(-1);
  const [citydata, setCityData] = useState([]);
  const [selectedCity, setSelectedCity] = useState(-1);
  const intl = useIntl();

  const handleRadioChange = (id) => {
    setSelectedRadioId(id);
    setorderNotes(id);
  };
  const calculateAmountToAdd = () => {
    return Math.round(
      cartTotal.minOrderAmount -
        (coupanRes ? coupanRes?.orderAmount : cartTotal?.total_amt || 0)
    );
  };
  //  ////  console.log(cartTotal);
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
      // console.error("API Error:", error);
    }
  };
  let objectToAdd = {
    id: -1,
    name: "Select your Region",
  };
  let objectToAdd1 = {
    id: -1,
    name: "Select your City",
  };
  const getRegionsdata = async (encodedToken) => {
    try {
      const response = await api.get("regions", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${encodedToken}`,
        },
      });
      //      console.log("regions data:", response?.data?.regions);
      let newArray = [objectToAdd].concat(response?.data?.regions);
      setReligionData(
        // { id: -1, value: "", name: "--Choose an option--", disabled: true },
        newArray
      );
      //      console.log("Regions data update", newArray);
    } catch (error) {
      console.error("API Error in regions:", error);
    }
  };
  const getCitydata = async (encodedToken) => {
    if (!selectedregion || selectedregion.length === 0) {
      return; // Don't make the API call if selectedregion is undefined or has a length of 0
    }

    //    console.log("id pass in city api", selectedregion);
    try {
      const response = await api.get(`city/${selectedregion}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${encodedToken}`,
        },
      });
      //      console.log("response of city api", response?.data?.city);
      let newArray = [objectToAdd1].concat(response?.data?.city);
      setCityData(newArray);
      // Update state or perform necessary actions based on response
    } catch (error) {
      console.error("API Error in regions:", error);
    }
  };
  useEffect(() => {
    let encodedToken = localStorage.getItem("token");

    getCitydata(encodedToken);
  }, [selectedregion]);
  const handleCoupencode = async () => {
    let token = localStorage.getItem("token");
    try {
      let payload = {
        code: coupenCode,
      };

      const response = await axios
        .post(`${API_BASE_URL}coupon/apply`, payload, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response?.status == 200) {
            setCoupanRes(response?.data);
            setCoupenCodeDis(response?.data?.discount_price);
            if (response.data.discount_type == "percent") {
              setCoupanDetails(
                `${response?.data?.title} ${intl.formatMessage({
                  id: "coupon applied successfully",
                })},${intl.formatMessage({ id: "maximum discount" })} ${
                  response?.data?.max_discount
                }¥`
              );
            } else if (response.data.discount_type == "amount") {
              setCoupanDetails(
                `${response?.data?.discount}¥ ` +
                  intl.formatMessage({
                    id: "discount applied successfully",
                  })
              );
            }

            toast.success(
              intl.formatMessage({ id: "coupon applied successfully" })
            );
            // getCartData(token);
          }
        });
    } catch (error) {
      // Log and handle the error
      // console.error("Error applying coupon:", error);
      setCoupanDetails("");
      toast.error("Please enter valid coupan");
    }
  };
  //  ////  console.log("cart prodyct detail", cartItemsData);
  const placeOrder = async () => {
    try {
      let token = localStorage.getItem("token");

      let payload = {
        order_amount: coupanRes?.orderAmount
          ? coupanRes?.orderAmount
          : cartTotal?.total_amt,
        payment_method: "cash_on_delivery",
        delivery_address_id: address?.billing_address?.[0]?.id,
        order_type: "delivery",
        coupon_discount_amount: coupenCodeDis,
        cart: cartItemsData,
        time_slot_id: selectedRadioId,
        order_note: orderNotes,
        coupon_code: coupenCode,
        ip_address: ip,
        forwarded_ip: ip,
        user_agent: browserData?.userAgent,
        accept_language: browserData?.language,
        delivery_charge:cartTotal?.delivery_charge

      };

      const response = await axios
        .post(`${API_BASE_URL}customer/order/place`, payload, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response?.status === 200) {
            router.push(`/OrderReceived?order_id=${response?.data?.order_id}`);
          }
        })
        .then(() => {
          clearCart();
        });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessage = error.response.data.errors[0]?.message;
        toast.error(errorMessage + "¥");
      } else {
        // console.error("Error while placing order:", error);
        toast.error("An error occurred while placing the order");
      }
    }
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

  const getCartData = (token, data) => {
    let url = `${API_BASE_URL}customer/cart`;

    if (data?.length > 0) {
      url += `/${data}`;
    }

    const response = axios
      .get(url, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCartItemsData(res?.data?.cartProducts);
        setCartTotal(res?.data);
      })
      .catch((error) => {
        //        ////        console.log("error", error?.code === "ERR_NETWORK");
      });
  };

  const getTimeSlot = async () => {
    //timeSlot
    const res = await ApiCall("get", intl, "timeSlot");
    const data = res.data;
    setTimeSlot(data);
  };
  const handleAddressSubmit = async (values) => {
    let encodedToken = localStorage.getItem("token");
    let token = localStorage.getItem("token");
    let payload = {
      address: values?.billing_address,
      full_name:
        values?.full_name != undefined || values?.full_name != null
          ? values?.full_name
          : selectedAddressData?.full_name,
      road:
        values?.billing_address2 != undefined ||
        values?.billing_address2 != null
          ? values?.billing_address2
          : selectedAddressData?.billing_address2,
      house:
        values?.house != undefined || values?.house != null
          ? values?.house
          : selectedAddressData?.house,
      floor:
        values?.floor != undefined || values?.floor != null
          ? values?.floor
          : selectedAddressData?.floor,
      city:
        values?.city != undefined || values?.city != null
          ? values?.city
          : selectedAddressData?.city,
      region_id:
        values?.state != undefined || values?.state != null
          ? values?.state
          : selectedAddressData?.region_id,
      post_code: values?.post_code
        ? values?.post_code
        : selectedAddressData?.post_code,
      contact_person_name: values?.contact_person_name
        ? values?.contact_person_name
        : selectedAddressData?.contact_person_name,
      contact_person_number: values?.contact_person_number
        ? values?.contact_person_number
        : selectedAddressData?.contact_person_number,
    };
    const response = await axios
      .put(`${API_BASE_URL}customer/address/update`, payload, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        //        ////        console.log("response", response);
        if (response.status == 200) {
          toast.success("address updated successfully");
          getAddress(encodedToken);
        }
      });
  };

  useEffect(() => {
    let encodedToken = localStorage.getItem("token");
    if (encodedToken) {
      getCartData(encodedToken);
      getUserDetails(encodedToken);
      getAddress(encodedToken);
      getTimeSlot();
      getRegionsdata(encodedToken);
    }
  }, []);
  const findElementById = async (id) => {
    const selectedData = await address?.billing_address?.map((element) => {
      if (element.id == id) {
        setSelectedAddressData(element || {});
      }
    });
    return selectedData;
  };
  useEffect(() => {
    formikFormData(selectedAddressData);
  }, [selectedAddressData, setSelectedAddressData]);

  const handlePrefillAddress = async () => {
    if (address?.billing_address?.length > 0) {
      const defaultAddress = address.billing_address[0];
      setSelectedAddressDropdown(defaultAddress.id);
      findElementById(defaultAddress.id);
    }
  };
  useEffect(() => {
    handlePrefillAddress();
  }, [address]);
  const validationSchema = Yup.object().shape({
    full_name: Yup.string().required(
      intl.formatMessage({ id: "Full Name is required" })
    ),
    billing_address: Yup.string().required(
      intl.formatMessage({ id: "Address is required" })
    ),
    // city: Yup.string().when("state", {
    //   is: (value) => value?.length > 1,
    //   then: Yup.string().required(
    //     intl.formatMessage({ id: "City / Town is required" })
    //   ),
    //   otherwise: Yup.string(),
    // }),
    // state: Yup.string().required(
    //   intl.formatMessage({ id: "State / County is required" })
    // ),
    post_code: Yup.string().required(
      intl.formatMessage({ id: "Postcode / ZIP is required" })
    ),
    contact_person_name: Yup.string().required(
      intl.formatMessage({ id: "Contact Person Name is required" })
    ),
    contact_person_number: Yup.string()
      .matches(
        /^\d{10}$/,
        intl.formatMessage({ id: "Contact Person Number must be 10 digits" })
      )
      .required(
        intl.formatMessage({ id: "Contact Person Number is required" })
      ),
    // password: Yup.string().required(
    //   intl.formatMessage({ id: "Password is required" })
    // ),
  });
  //  console.log("selectedAddress",selectedAddressData.region_id  )
  const formikFormData = (selectedAddressData) => {
    return (
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{
          full_name: selectedAddressData?.full_name,
          billing_address: selectedAddressData?.address,
          billing_address2: selectedAddressData?.road,
          state: selectedAddressData.region_id,
          city: selectedAddressData.city,
          post_code: selectedAddressData?.post_code,
          contact_person_number: selectedAddressData?.contact_person_number,
          contact_person_name: selectedAddressData?.contact_person_name,
        }}
        onSubmit={(values, { setSubmitting }) => {
          handleAddressSubmit(values);
        }}
        // onSubmit={(values, { setSubmitting, errors }) => {
        //   handleAddressSubmit(values)
        //     .then(() => {
        //        //       console.log("Submission successful");
        //       setSubmitting(false);
        //     })
        //     .catch((error) => {
        //       console.error("Submission error:", error, errors);
        //       // Handle the error here, set an error state, or display a message to the user
        //       setSubmitting(false);
        //     });
        // }}
      >
        {({ setFieldValue, values, handleChange, errors, touched }) => (
          <Form method="post">
            <div className="form-group mb-40">
              <Field
                type="text"
                required=""
                name="full_name"
                placeholder={intl.formatMessage({ id: "Full Name*" })}
              />
              {errors.full_name && touched.full_name && (
                <ErrorMessage
                  name="full_name"
                  component="div"
                  style={{ color: "red", position: "absolute" }}
                />
              )}
            </div>

            <div className="form-group mb-40">
              <Field
                type="text"
                name="billing_address"
                required=""
                placeholder={intl.formatMessage({ id: "Address *" })}
              />
              {errors.billing_address && touched.billing_address && (
                <ErrorMessage
                  name="billing_address"
                  component="div"
                  style={{ color: "red", position: "absolute" }}
                />
              )}
            </div>
            <div className="form-group mb-40">
              <Field
                type="text"
                name="billing_address2"
                required=""
                placeholder={intl.formatMessage({ id: "Address line2" })}
              />
            </div>

            {/* <div className="form-group mb-40">
              <Field
                required=""
                type="text"
                name="state"
                placeholder={intl.formatMessage({ id: "State / County *" })}
              />
              {errors.state && touched.state && (
                <ErrorMessage
                  name="state"
                  component="div"
                  style={{ color: "red", position: "absolute" }}
                />
              )}
            </div> */}
            <div className="form-group mb-40">
              <div className="sort-by-dropdown-wrap custom-select mb-40">
                <select
                  as="select"
                  className="selectedAddress"
                  name="state"
                  value={values.state}
                  onChange={(e) => {
                    // setSelectedAddressDropdown(e.target.value);
                    // findElementById(e.target.value);
                    let encodedToken = localStorage.getItem("token");
                    //                    console.log("selected region", e.target.value);
                    const data = e.target.value;
                    setFieldValue("state", data);
                    setFieldValue("city", "");
                    setSelectedRegion(e.target.value);
                    getCartData(encodedToken, data);
                  }}
                >
                  {religionData?.map((option) => (
                    <option
                      key={option.id}
                      value={option.id}
                      disabled={option.id === -1 ? true : false}
                      selected={option.id == values.region_id}
                    >
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* <Field
                required=""
                type="text"
                name="city"
                placeholder={intl.formatMessage({ id: "City / Town *" })}
              />
              {errors.city && touched.city && (
                <ErrorMessage
                  name="city"
                  component="div"
                  style={{ color: "red", position: "absolute" }}
                />
              )} */}
          
              {citydata.length !== 1 ? (
                <div className="sort-by-dropdown-wrap custom-select mb-40">
                  <select
                    as="select"
                    className="selectedAddress"
                    name="city"
                    value={values.city}
                    onChange={(e) => {
                      // setSelectedAddressDropdown(e.target.value);
                      // findElementById(e.target.value);
                      //                      console.log("selected city", e.target.value);
                      setFieldValue("city", e?.target?.value);

                      setSelectedCity(e.target.value);
                    }}
                  >
                    {citydata?.map((option) => (
                      <option
                        key={option.id}
                        value={option.id}
                        disabled={option.id === -1 ? true : false}
                      >
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>
            <div className="form-group mb-40">
              <Field
                required=""
                type="number"
                name="post_code"
                onChange={(e) => {
                  const inputValue = e.target.value.slice(0, 6); // Limit to 10 characters
                  setFieldValue("post_code", inputValue);
                }}
                placeholder={intl.formatMessage({ id: "Postcode / ZIP *" })}
              />
              {errors.post_code && touched.post_code && (
                <ErrorMessage
                  name="post_code"
                  component="div"
                  style={{ color: "red", position: "absolute" }}
                />
              )}
            </div>
            <div className="form-group mb-40">
              <Field
                required=""
                type="text"
                name="contact_person_name"
                placeholder={intl.formatMessage({ id: "Contact Person Name*" })}
              />
              {errors.contact_person_name && touched.contact_person_name && (
                <ErrorMessage
                  name="contact_person_name"
                  component="div"
                  style={{ color: "red", position: "absolute" }}
                />
              )}
            </div>
            <div className="form-group mb-40">
              <Field
                required=""
                type="number"
                name="contact_person_number"
                onChange={(e) => {
                  const inputValue = e.target.value.slice(0, 10); // Limit to 10 characters
                  setFieldValue("contact_person_number", inputValue);
                }}
                placeholder={intl.formatMessage({
                  id: "Contact Person Number*",
                })}
              />
              {errors.contact_person_number &&
                touched.contact_person_number && (
                  <ErrorMessage
                    name="contact_person_number"
                    component="div"
                    style={{ color: "red", position: "absolute" }}
                  />
                )}
            </div>

            {/* <div
              id="collapsePassword"
              className="form-group create-account collapse in"
            >
              <Field
                required=""
                type="password"
                placeholder={intl.formatMessage({ id: "Password" })}
                name="password"
              />
            </div> */}
            {/* <div className="form-group mb-40">
              <textarea
                name="orderNotes"
                as="textarea"
                rows="5"
                value={orderNotes}
                disabled={true}
                onChange={(e) => setorderNotes(e.target.value)}
                placeholder={intl.formatMessage({ id: "Delivery time" })}
              />
            </div> */}
            <div>
              <button type="submit">
                {intl.formatMessage({ id: "Save Changes" })}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    );
  };
  useEffect(() => {
    const fnBrowserDetect = () => {
      fetch("https://geolocation-db.com/json/")
        .then((response) => response.json())
        .then((data) => {
          setIp(data?.IPv4);
          setBrowserData(navigator);
        });
    };
    // Call the browser detection function
    fnBrowserDetect();
  }, []);
  return (
    <>
      <Layout parent="Home" sub="Shop" subChild="Checkout">
        <section className="mt-50 mb-50">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mb-40">
                <h1 className="heading-2 mb-10">
                  {intl.formatMessage({ id: "Checkout" })}
                </h1>
                <div className="d-flex justify-content-between">
                  <h6 className="text-body">
                    {intl.formatMessage({
                      id: "Carefully check the information before checkout",
                    })}
                  </h6>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-7">
                <div className="row mb-50">
                  <div className="col-lg-6 mb-sm-15 mb-lg-0 mb-md-3">
                    <div
                      className="panel-collapse collapse login_form"
                      id="loginform"
                    >
                      <div className="panel-body">
                        <p className="mb-30 font-sm">
                          {intl.formatMessage({
                            id: "If you have shopped with us before, please enter your details below. If you are a new customer, please proceed to the Billing",
                          })}{" "}
                          &amp;{" "}
                          {intl.formatMessage({ id: "Shipping section." })}
                        </p>
                        <form method="post">
                          <div className="form-group">
                            <input
                              type="text"
                              name="email"
                              placeholder={intl.formatMessage({
                                id: "Username Or Email",
                              })}
                            />
                          </div>
                          <div className="form-group">
                            <input
                              type="password"
                              name="password"
                              placeholder={intl.formatMessage({
                                id: "Password",
                              })}
                            />
                          </div>
                          <div className="login_footer form-group">
                            <div className="chek-form">
                              <div className="custome-checkbox">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="checkbox"
                                  id="remember"
                                  value=""
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="remember"
                                >
                                  <span>
                                    {intl.formatMessage({ id: "Remember me" })}
                                  </span>
                                </label>
                              </div>
                            </div>
                            {/* <a href="#">
                              {intl.formatMessage({ id: "Forgot password?" })}
                            </a> */}
                          </div>
                          <div className="form-group">
                            <button className="btn btn-md" name="login">
                              {intl.formatMessage({ id: "Login" })}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-25">
                  <h4>{intl.formatMessage({ id: "Billing Details" })}</h4>
                </div>
                <div className="form-group">
                  <label htmlFor="selectedDropdownOption">
                    {intl.formatMessage({ id: "Select Address" })}
                  </label>
                  <select
                    as="select"
                    className="selectedAddress"
                    name="selectedAddress"
                    value={selectedAddressDropdown}
                    onChange={(e) => {
                      setSelectedAddressDropdown(e.target.value);
                      findElementById(e.target.value);
                    }}
                  >
                    {address?.billing_address?.map((option) => (
                      <option key={option.id} value={option.id}>
                        {`${
                          option?.full_name !== null
                            ? option.full_name + ","
                            : ""
                        } ${
                          option?.address !== null ? option.address + "," : ""
                        }${
                          option?.post_code !== null
                            ? option?.post_code + ","
                            : ""
                        }${option?.city !== null ? option?.city + "," : ""}${
                          option?.region_id !== null ? option?.region_id : ""
                        }`}
                      </option>
                    ))}
                  </select>
                </div>
                {formikFormData(selectedAddressData)}
              </div>
              <div className="col-lg-5">
                <div className="border p-40 cart-totals ml-30 mb-50 checkout_box mt-30">
                  <div className="d-flex align-items-end justify-content-between mb-30">
                    <h4>{intl.formatMessage({ id: "Your Order" })}</h4>
                    <h6 className="text-muted">
                      {intl.formatMessage({ id: "Subtotal" })}
                    </h6>
                  </div>
                  <div className="divider-2 mb-30"></div>
                  <div className="table-responsive order_table">
                    {cartItemsData.length <= 0 && "No Products"}
                    {cartItemsData.length > 0 ? (
                      <table className="table no-border">
                        <tbody>
                          {cartItemsData?.map((item, i) => (
                            <tr key={i}>
                              <td className="image product-thumbnail">
                                <img src={item?.product?.image?.[0]} alt="#" />
                              </td>
                              <td>
                                <h6 className="w-160 mb-5">
                                  {/* <a
                                    dangerouslySetInnerHTML={{
                                      __html: item?.product?.name,
                                    }}
                                  ></a> */}
                                  <a
                                    dangerouslySetInnerHTML={{
                                      __html: translatedItemDetails(
                                        "name",
                                        intl,
                                        item?.product
                                      ),
                                    }}
                                  ></a>
                                  <div className="product-rate-cover">
                                    <div className="product-rate d-inline-block">
                                      <div
                                        className="product-rating"
                                        style={{
                                          width: `${
                                            item?.product?.overall_rating
                                              ? item?.product?.overall_rating
                                              : 0
                                          }%`,
                                        }}
                                      ></div>
                                    </div>
                                    <span className="font-small ml-5 text-muted">
                                      {`(
                                    ${
                                      item?.product?.total_reviews
                                        ? item?.product?.total_reviews
                                        : 0
                                    }
                                    )`}
                                    </span>
                                  </div>
                                </h6>{" "}
                              </td>
                              <td>
                                <h6 className="text-muted pl-20 pr-20">
                                  x {item.quantity}
                                </h6>
                              </td>
                              <td>
                                <h4 className="text-brand">
                                  ¥
                                  {/* {(item.quantity ? item.quantity : 1) *
                                    item.price} */}
                                  {(item?.quantity ? item?.quantity : 1) *
                                  item?.actual_price
                                    ? item?.actual_price
                                    : item?.product.actual_price
                                    ? item?.product.actual_price
                                    : 0}
                                </h4>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      "No Products"
                    )}
                  </div>
                </div>
                <div className="ml-30 mb-50">
                  <form method="post" className="apply-coupon">
                    <input
                      type="text"
                      onChange={(e) => {
                        setCoupenCode(e?.target?.value);
                      }}
                      value={coupenCode}
                      placeholder={intl.formatMessage({
                        id: "Enter Coupon Code...",
                      })}
                    />
                    <button
                      className="btn  btn-md"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCoupencode();
                      }}
                    >
                      {intl.formatMessage({ id: "Apply Coupon" })}
                    </button>
                  </form>

                  <h6 style={{ color: "green", marginTop: "15px" }}>
                    {coupanDetails}
                  </h6>
                </div>
                <div className="border p-40 cart-totals ml-30 mb-50 checkout_box">
                  <div className="heading_s1 mb-3">
                    <h4>{intl.formatMessage({ id: "Cart Totals" })}</h4>
                  </div>
                  {cartTotal.cartProducts?.length > 0 ? (
                    <table
                      style={{
                        border: "1px solid #bababa",
                        width: "100%",
                        borderCollapse: "collapse",
                      }}
                      className="checkout_info_table"
                    >
                      <tr>
                        <td
                          style={{
                            border: "1px solid #bababa",
                            padding: "5px 15px",
                          }}
                          className="text-start"
                        >
                          <strong>
                            {intl.formatMessage({ id: "Sub-Total:" })}
                          </strong>
                        </td>
                        <td
                          style={{
                            border: "1px solid #bababa",
                            padding: "5px 15px",
                          }}
                          className="text-end"
                        >
                          <span className="fw-600">
                            ¥{cartTotal?.total_sub_amt}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            border: "1px solid #bababa",
                            padding: "5px 15px",
                          }}
                          className="text-start"
                        >
                          <strong>
                            {intl.formatMessage({
                              id: "All Item in Dry Shipping:",
                            })}
                          </strong>
                        </td>
                        <td
                          style={{
                            border: "1px solid #bababa",
                            padding: "5px 15px",
                          }}
                          className="text-end"
                        >
                          <span className="fw-600">
                            ¥{cartTotal?.delivery_charge}
                          </span>
                        </td>
                      </tr>
                      {cartTotal?.eight_percent ? (
                        <tr>
                          <td
                            style={{
                              border: "1px solid #bababa",
                              padding: "5px 15px",
                            }}
                            className="text-start"
                          >
                            <strong>
                              {intl.formatMessage({ id: "Consumption Tax" })}{" "}
                              {cartTotal?.eight_percent ? 8 : 0}%
                            </strong>
                          </td>
                          <td
                            style={{
                              border: "1px solid #bababa",
                              padding: "5px 15px",
                            }}
                            className="text-end"
                          >
                            <span className="fw-600">
                              ¥{cartTotal?.eight_percent}
                            </span>
                          </td>
                        </tr>
                      ) : null}
                      {cartTotal?.ten_percent ? (
                        <tr>
                          <td
                            style={{
                              border: "1px solid #bababa",
                              padding: "5px 15px",
                            }}
                            className="text-start"
                          >
                            <strong>
                              {" "}
                              {intl.formatMessage({
                                id: "Consumption Tax",
                              })}{" "}
                              {cartTotal?.eight_percent ? 10 : 0}%
                            </strong>
                          </td>
                          <td
                            style={{
                              border: "1px solid #bababa",
                              padding: "5px 15px",
                            }}
                            className="text-end"
                          >
                            <span className="fw-600">
                              ¥
                              {cartTotal?.ten_percent
                                ? cartTotal?.ten_percent
                                : 0}
                            </span>
                          </td>
                        </tr>
                      ) : null}
                      {coupanRes ? (
                        <tr>
                          <td
                            style={{
                              border: "1px solid #bababa",
                              padding: "5px 15px",
                            }}
                            className="text-start"
                          >
                            <strong>
                              {" "}
                              {intl.formatMessage({ id: "Discount price" })}
                            </strong>
                          </td>
                          <td
                            style={{
                              border: "1px solid #bababa",
                              padding: "5px 15px",
                            }}
                            className="text-end"
                          >
                            <span className="fw-600">
                              ¥{coupanRes?.discount_price}
                            </span>
                          </td>
                        </tr>
                      ) : null}
                      <tr>
                        <td
                          style={{
                            border: "1px solid #bababa",
                            padding: "5px 15px",
                          }}
                          className="text-start"
                        >
                          <strong>
                            {intl.formatMessage({ id: "Total:" })}
                          </strong>
                        </td>
                        <td
                          style={{
                            border: "1px solid #bababa",
                            padding: "5px 15px",
                          }}
                          className="text-end"
                        >
                          <span className="font-lg fw-900 text-brand">
                            ¥
                            {coupanRes
                              ? coupanRes?.orderAmount
                              : cartTotal?.total_amt}
                          </span>
                        </td>
                      </tr>
                    </table>
                  ) : null}
                </div>

                <div className="border p-40 cart-totals ml-30 mb-50 checkout_box">
                  <div className="delivery_time_div">
                    <div className="heading_s1 mb-3">
                      <h4>{intl.formatMessage({ id: "Delivery time" })}</h4>
                    </div>

                    {timeSlot?.map((Item, index) => {
                      const radioId = Item?.id;

                      return (
                        <div key={radioId} className="custome-radio">
                          <input
                            className="form-check-input"
                            required=""
                            type="radio"
                            name="timeslot"
                            id={radioId}
                            checked={
                              radioId === selectedRadioId ||
                              (index === 0 && selectedRadioId === null)
                            }
                                                       onChange={(e) =>{ handleRadioChange(radioId)}}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={radioId}
                            data-bs-toggle="collapse"
                            data-target="#timeslot"
                            aria-controls="timeslot"
                          >
                            {Item?.start_time} - {Item?.end_time}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="border p-40 cart-totals ml-30 mb-50 checkout_box">
                  <div className="payment_method">
                    <div className="heading_s1 mb-3">
                      <h4>{intl.formatMessage({ id: "Payment" })}</h4>
                    </div>

                    <div className="payment_option">
                      <div className="custome-radio">
                        <input
                          className="form-check-input"
                          required=""
                          type="radio"
                          name="payment_option"
                          id="exampleRadios3"
                          defaultChecked={true}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleRadios3"
                          data-bs-toggle="collapse"
                          data-target="#bankTranfer"
                          aria-controls="bankTranfer"
                        >
                          {intl.formatMessage({ id: "COD" })}
                        </label>
                        {/* <div
                          className="form-group collapse in"
                          id="bankTranfer"
                        >
                          <p className="text-muted mt-5">
                            There are many variations of passages of Lorem Ipsum
                            available, but the majority have suffered
                            alteration.{" "}
                          </p>
                        </div> */}
                      </div>
                      {/* <div className="custome-radio">
                        <input
                          className="form-check-input"
                          required=""
                          type="radio"
                          name="payment_option"
                          id="exampleRadios4"
                          defaultChecked={true}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleRadios4"
                          data-bs-toggle="collapse"
                          data-target="#checkPayment"
                          aria-controls="checkPayment"
                        >
                          Check Payment
                        </label>
                        <div
                          className="form-group collapse in"
                          id="checkPayment"
                        >
                          <p className="text-muted mt-5">
                            Please send your cheque to Store Name, Store Street,
                            Store Town, Store State / County, Store Postcode.{" "}
                          </p>
                        </div>
                      </div>
                      <div className="custome-radio">
                        <input
                          className="form-check-input"
                          required=""
                          type="radio"
                          name="payment_option"
                          id="exampleRadios5"
                          defaultChecked={true}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleRadios5"
                          data-bs-toggle="collapse"
                          data-target="#paypal"
                          aria-controls="paypal"
                        >
                          Paypal
                        </label>
                        <div className="form-group collapse in" id="paypal">
                          <p className="text-muted mt-5">
                            Pay via PayPal; you can pay with your credit card if
                            you don't have a PayPal account.
                          </p>
                        </div>
                      </div> */}
                    </div>
                  </div>
                  <div>
                    {cartTotal?.total_amt <= cartTotal.minOrderAmount ? (
                      <h8 style={{ color: "red" }}>
                        {intl.formatMessage({
                          id: "Oops! Your cart is below 2500 ¥. Please add items worth",
                        })}{" "}
                        {calculateAmountToAdd()} ¥
                        {intl.formatMessage({
                          id: " or more to place your order. Happy shopping!",
                        })}
                      </h8>
                    ) : (
                      <h8 style={{ color: "green" }}>
                        {intl.formatMessage({
                          id: "Congratulations, You are eligible to place an order",
                        })}
                      </h8>
                    )}
                  </div>
                </div>
                <div className="px-40 ml-30 mb-50">
                  <button
                    onClick={() => {
                      placeOrder();
                    }}
                    className="btn btn-fill-out btn-block"
                  >
                    {intl.formatMessage({ id: "Place Order" })}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

const mapStateToProps = (state) => ({
  cartItems: state.cart,
  activeCart: state.counter,
});

const mapDispatchToProps = {
  closeCart,
  increaseQuantity,
  decreaseQuantity,
  deleteFromCart,
  openCart,
  clearCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
