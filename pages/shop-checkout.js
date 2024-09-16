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
import { ErrorMessage, Field, Form, Formik, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { API_BASE_URL, api } from "../lib/api";
import axios from "axios";
import { useRouter } from "next/router";
import { toast, useToast } from "react-toastify";
import { ApiCall } from "../lib/other/other";
import { useIntl } from "react-intl";
import { translatedItemDetails } from "../util/util";
import * as Yup from "yup";
import { Spinner } from "react-bootstrap";
import moment from "moment";
import React, { useRef } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { set } from "date-fns";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { faL } from "@fortawesome/free-solid-svg-icons";
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
  const [balance, setbalance] = useState(0)
  const [elebal, setelebal] = useState(0)
  const [redeem, setredeem] = useState(false)
  const router = useRouter();
  const [cartItemsData, setCartItemsData] = useState([]);
  const [timeSlot, setTimeSlot] = useState([]);
  const [selectedRadioId, setSelectedRadioId] = useState(timeSlot?.[0]?.id);
  const [selectedAddressdisplay, setSelectedAddressdisplay] = useState();
  const [ip, setIp] = useState("");
  const [browserData, setBrowserData] = useState([]);
  const [selectedAddressData, setSelectedAddressData] = useState({});
  const [selectedAddressDropdown, setSelectedAddressDropdown] = useState("");
  const [orderNotes, setorderNotes] = useState();
  const [religionData, setReligionData] = useState([]);
  const [selectedregion, setSelectedRegion] = useState(-1);
  const [citydata, setCityData] = useState([]);
  const [selectedCity, setSelectedCity] = useState(-1);
  const [addressformOpen, setAddressFormOpen] = useState(false);
  const [showModaladdress, setShowModaladdress] = useState(false);
  const [regionId1, setRegionId] = useState()

  const intl = useIntl();
  const regID = useRef()
  const [showModalAddress1, setShowModalAddress1] = useState(false);

  // Toggle function to open and close the modal
  const toggleAddressModal1 = () => {
    setShowModalAddress1((prevState) => !prevState);
  };

  // const fetchWalletBalance = async (encodedToken) => {
  //   try {
  //     const response = await api.get(`customer/wallet-balance`, {
  //       headers: {
  //         "Access-Control-Allow-Origin": "*",
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${encodedToken}`,
  //       },
  //     });
  //     console.log("response wallet==>", response.data)
  //     // Update state or perform necessary actions based on response
  //   } catch (error) {
  //     console.error("API Error in wallet", error);
  //   }
  // }
  // useEffect(() => {
  //   let encodedToken = localStorage.getItem("token");
  //   fetchWalletBalance(encodedToken)
  // }, [])
  const handleAddressSelect = (addressItem) => {
    setSelectedAddressdisplay(addressItem); // Update the selected address display
    setSelectedAddressDropdown(addressItem.id); // Update the dropdown selection
    setShowModalAddress1(false); // Close the modal after selection
  };

  // console.log("intlllllllllllllllll====", intl.locale);
  const handleRadioChange = (id) => {
    setSelectedRadioId(id);
    // setorderNotes(id);
  };
  const openModal = () => {
    setShowModaladdress(true);
    document.body.classList.add("body-with-modal");
    console.log("Modal opened");
  };

  const closeModal = () => {
    document.body.classList.remove("body-with-modal");
    setShowModaladdress(false);
    console.log("Modal closed");
  };
  const handleClickOutside = () => {
    document.body.classList.remove("body-with-modal");

    closeModal();
  };
  const formRef = useRef();

  const handleReset = () => {
    formRef.current.resetForm();
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
      console.log("Regions data update", newArray);
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
                })},${intl.formatMessage({ id: "maximum discount" })} ${response?.data?.max_discount
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
  const initialOptions = {
    clientId: "test",
    currency: "USD",
    intent: "capture",
  };
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: calculateAmountToAdd().toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: calculateAmountToAdd().toFixed(2),
              },
            },
          },
          items: cartItemsData.map((item) => ({
            name: translatedItemDetails("name", intl, item?.product),
            unit_amount: {
              currency_code: "USD",
              value:
                (item?.quantity ? item?.quantity : 1) * item?.actual_price
                  ? item?.actual_price
                  : item?.product.actual_price
                    ? item?.product.actual_price
                    : 0,
            },
            quantity: item.quantity,
          })),
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      alert("Transaction completed by " + details.payer.name.given_name);
    });
  };

  const onError = (err) => {
    console.error(err);
  };
  const getAddress = async (encodedToken) => {
    const response = await api.get("customer/address/list", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${encodedToken}`,
      },
    });
    console.log(
      "address response in region id===============>",
      response?.data.billing_address[0]?.region_id
    );
    setRegionId(response?.data.billing_address[0]?.region_id)
    getCartData(response?.data.billing_address[0]?.region_id);
    setSelectedAddressdisplay(response?.data.billing_address[0]);
    setAddress(response?.data);
    // const region_id =()
  };
  const [loading, setloading] = useState(true);
  const getCartData = (data) => {
    setloading(true);
    console.log("is region id pass in get cart", regionId1, data);
    let encodedToken = localStorage.getItem("token");

    let url = `${API_BASE_URL}customer/cart`;

    if (data) {
      url += `/${data}`;
      if (redeem === true) {
        url += `/true`; // Append "/true" if reedem is true
      }
      // for use wallet amount apply 
    }
    console.log("url in get cart", url);
    const response = axios
      .get(url, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${encodedToken}`,
        },
      })
      .then((res) => {
        setCartItemsData(res?.data?.cartProducts);
        setCartTotal(res?.data);
        setbalance(res?.data?.redeem_points)
        setelebal(res?.data?.eligible_redeem_points)
        // console.log("cart data", res.data);
        setloading(false);
      })
      .catch((error) => {
        setloading(false);

        //        ////        console.log("error", error?.code === "ERR_NETWORK");
      });
  };
  // const getCartDataforRedeem = () => {
  //   setloading(true);

  //   console.log("api call for reedem", regionId);
  //   let encodedToken = localStorage.getItem("token");

  //   let url = `${API_BASE_URL}customer/cart`;

  //   if (regionId) {
  //     url += `/${regionId}`;
  //     if (redeem === true) {
  //       url += `/true`; // Append "/true" if reedem is true
  //     }
  //     // for use wallet amount apply 
  //   }
  //   console.log("url in get cart", url);
  //   const response = axios
  //     .get(url, {
  //       headers: {
  //         "Access-Control-Allow-Origin": "*",
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${encodedToken}`,
  //       },
  //     })
  //     .then((res) => {
  //       setCartItemsData(res?.data?.cartProducts);
  //       setCartTotal(res?.data);
  //       setbalance(res?.data?.redeem_points)
  //       setelebal(res?.data?.eligible_redeem_points)
  //       console.log("cart data", res.data);
  //       setloading(false);
  //     })
  //     .catch((error) => {
  //       setloading(false);

  //       //        ////        console.log("error", error?.code === "ERR_NETWORK");
  //     });
  // };
  useEffect(() => {
    getCartData(regionId1)
  }, [redeem])
  const getTimeSlot = async () => {
    //timeSlot
    const res = await ApiCall("get", intl, "timeSlot");
    const data = res.data;
    setTimeSlot(data);
  };
  // console.log("addresslist" , address.billing_address.length)

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
    // const checkaddress = address?.billing_address?.length== 0 ? "create" : "update"
    console.log("addresslist", address);
    console.log("payoad", payload);
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
          setShowModaladdress(false);
        }
      });
  };

  useEffect(() => {
    let encodedToken = localStorage.getItem("token");
    if (encodedToken) {
      // getCartData();
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

    //   is: (value) => console.log("state" ,value ),
    //   then: Yup.string().required(
    //     intl.formatMessage({ id: "City / Town is required" })
    //   ),
    //   otherwise: Yup.string(),
    // }),
    state: Yup.string().required(
      intl.formatMessage({ id: "State / County is required" })
    ),
    post_code: Yup.string()
      .matches(
        /^[0-9]{7}$/,
        intl.formatMessage({ id: "Postcode must be 7 digits" })
      )
      .required(intl.formatMessage({ id: "Postcode / ZIP is required" })),
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
        innerRef={formRef}
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
        {({ setFieldValue, values, Radio, errors, touched, dirty }) => (
          <Form method="post">
            <div className="form-group mb-20">
              <Field type="text" required="" name="full_name" placeholder="" />
              <label>{intl.formatMessage({ id: "Full Name*" })}</label>
              {errors.full_name && touched.full_name && (
                <ErrorMessage
                  name="full_name"
                  component="div"
                  style={{ color: "red", position: "absolute" }}
                />
              )}
            </div>

            <div className="form-group mb-20">
              <Field
                type="text"
                name="billing_address"
                required=""
                placeholder=""
              />
              <label>{intl.formatMessage({ id: "Address*" })}</label>
              {errors.billing_address && touched.billing_address && (
                <ErrorMessage
                  name="billing_address"
                  component="div"
                  style={{ color: "red", position: "absolute" }}
                />
              )}
            </div>
            <div className="form-group mb-20">
              <Field
                type="text"
                name="billing_address2"
                required=""
                placeholder=""
              />
              <label>{intl.formatMessage({ id: "Address Line2*" })}</label>
            </div>

            {/* <div className="form-group mb-20">
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
            <div className="form-group mb-20">
              <div className="sort-by-dropdown-wrap custom-select mb-20">
                {/* <select
                  as="select"
                  className="selectedAddress"
                  name="state"
                  style={{ color: "black" }}
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
                    getCartData(data);
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
                </select> */}
                <Dropdown
                  className="Dropdownstate"
                  name="state"
                  onSelect={(selectedOption) => {
                    // console.log("Selected option" , selectedOption)
                    setFieldValue("state", selectedOption);
                    setFieldValue("city", "");
                    // setRegionId(selectedOption)
                    setSelectedRegion(selectedOption); // This should be defined somewhere in your component
                    getCartData(selectedOption); // This should be defined somewhere in your component
                  }}
                >
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {values.state
                      ? religionData.find((option) => option.id == values.state)
                        ?.name
                      : "Select State"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {religionData?.map((option) => (
                      <Dropdown.Item
                        key={option.id}
                        eventKey={option.id}
                        disabled={option.id === -1}
                        active={option.id === values.region_id}
                      >
                        {option.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                {errors.state && touched.state && (
                  <ErrorMessage
                    name="state"
                    component="div"
                    style={{ color: "red", position: "absolute" }}
                  />
                )}
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
                <div className="sort-by-dropdown-wrap custom-select mb-20">
                  <Dropdown
                    className="Dropdownstate"
                    onSelect={(selectedCity) => {
                      console.log("selectedcity", selectedCity);
                      setFieldValue("city", selectedCity);
                      setSelectedCity(selectedCity);
                    }}
                  >
                    <Dropdown.Toggle variant="success" id="city-dropdown">
                      {values.city
                        ? citydata.find((option) => option.id == values.city)
                          ?.name
                        : "City Dropdown"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {citydata?.map((option) => (
                        <Dropdown.Item
                          key={option.id}
                          eventKey={option.id}
                          disabled={option.id === -1}
                          active={option.id === values.city}
                        >
                          {option.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              ) : null}
            </div>
            <div className="form-group mb-20">
              <Field
                required=""
                type="string"
                name="post_code"
                // value={values.post_code}
                onChange={(e) => {
                  const inputValue = e.target.value
                    .replace(/[-*\/]/g, "")
                    .slice(0, 7); // Limit to 10 characters
                  console.log("postcodedeeeeee", inputValue);
                  setFieldValue("post_code", inputValue);
                }}
                placeholder=""
              />
              <label>{intl.formatMessage({ id: "Postcode / ZIP*" })}</label>
              {errors.post_code && touched.post_code && (
                <ErrorMessage
                  name="post_code"
                  component="div"
                  style={{ color: "red", position: "absolute" }}
                />
              )}
            </div>
            <div className="form-group mb-20">
              <Field
                required=""
                type="text"
                name="contact_person_name"
                placeholder=""
              />
              <label>
                {intl.formatMessage({ id: "Contact Person Name*" })}
              </label>
              {errors.contact_person_name && touched.contact_person_name && (
                <ErrorMessage
                  name="contact_person_name"
                  component="div"
                  style={{ color: "red", position: "absolute" }}
                />
              )}
            </div>
            <div className="form-group mb-20">
              <Field
                required=""
                type="number"
                name="contact_person_number"
                onChange={(e) => {
                  let phoneNumber = e.target.value.slice(0, 10); // Limit to 10 characters
                  // Remove non-numeric characters
                  phoneNumber = phoneNumber.replace(/\D/g, "");
                  // Check if the first character is zero and if so, remove it
                  if (phoneNumber.charAt(0) === "0") {
                    let phoneNumber1 = phoneNumber.substring(1);
                    setFieldValue("contact_person_number", phoneNumber1);
                  } else {
                    setFieldValue("contact_person_number", phoneNumber);
                  }
                }}
              />
              <label>
                {intl.formatMessage({ id: "Contact Person Number*" })}
              </label>
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

            <div>
              <button type="submit">
                {intl.formatMessage({ id: "Save Changes" })}
              </button>
              <button onClick={() => closeModal()} class="submit">
                {intl.formatMessage({ id: "Close" })}
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
  const [selectedOption, setSelectedOption] = useState("cash_on_delivery");
  const handleChangeRadio = (event) => {
    console.log("event", event.target.value)
    setSelectedOption(event.target.value);
  };
  const placeOrder = async () => {
    console.log("place order called")
    setloading(true);
    try {
      let token = localStorage.getItem("token");

      let payload = {
        order_amount: coupanRes?.orderAmount
          ? coupanRes?.orderAmount
          : cartTotal?.total_amt,
        payment_method: selectedOption,
        delivery_address_id: selectedAddressDropdown,
        order_type: "delivery",
        coupon_discount_amount: coupenCodeDis,
        cart: cartItemsData,
        redeem_points: elebal,
        isredeem: redeem ? true : false,
        time_slot_id: selectedRadioId,
        order_note: orderNotes,
        local: intl.locale,
        coupon_code: coupenCode,
        ip_address: ip,
        forwarded_ip: ip,
        user_agent: browserData?.userAgent,
        accept_language: browserData?.language,
        delivery_charge: cartTotal?.delivery_charge,
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
          console.log("response of place order", response.data.payment_link);
          if (response?.status === 200) {
            selectedOption == "paypal"
              ? router.push(response.data.payment_link)
              : router.push(
                `/OrderReceived?order_id=${response?.data?.order_id}`
              );
          }
        })
        .then(() => {
          clearCart();
          setloading(false);
        });}
        catch (error) {
          setloading(false);
      
          if (error.response && error.response.data && error.response.data.errors) {
            const errorMessage = error.response.data.errors[0]?.message;
      
            // Check if the error message starts with "Stock for"
            if (errorMessage.startsWith("Stock for")) {
              toast.error(errorMessage); // Display the full dynamic stock error message
            } else {
              toast.error(errorMessage); // Display other errors as they are
            }
          } else {
            console.log("Error while placing order:", error?.response?.data?.message);
            toast.error(`An error occurred while placing the order`);
            toast.error(`${error?.response?.data?.message}`);


          }
        }
      };
  //   } catch (error) {
  //     if (error.response && error.response.data && error.response.data.errors) {
  //       const errorMessage = error.response.data.errors[0]?.message;
  //       toast.error(errorMessage + "¥");
  //       setloading(false);
  //     } else {
  //       // console.error("Error while placing order:", error);
  //       toast.error("An error occurred while placing the order");
  //       setloading(false);
  //     }
  //   }
  // };
  return (
    <>
      <Layout parent="Home" sub="Shop" subChild="Checkout">
        {showModaladdress && (
          <div className="modal-overlay" style={{ zIndex: 9999999999999 }}>
            <div className="modalAddress">
              <div className="d-flex justify-content-between">
                <h3> {intl.formatMessage({ id: "Add Address" })}</h3>
                {/* <button className="Resetbtn" onClick={()=>handleReset()}>
                  {intl.formatMessage({ id: "Reset" })}
                </button> */}
              </div>
              <div className="divider-2 mb-15 mt-15"></div>
              {formikFormData(selectedAddressData)}
            </div>
          </div>
        )}
        <section className="mt-50 mb-50">
          <div className="container">
            <div className="row checkout_row">
              <div className="col-lg-8 mb-40">
                <h3 className="heading-2 mb-10 checkout_title">
                  {intl.formatMessage({ id: "Checkout" })}
                </h3>
                <div className="d-flex justify-content-between">
                  <h6 className="text-body checkout_text">
                    {intl.formatMessage({
                      id: "Carefully check the information before checkout",
                    })}
                  </h6>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="border p-30 cart-totals mb-30 checkout_box">
                  {/* <div className="d-flex align-items-end justify-content-between mb-30">
                    <h6>{intl.formatMessage({ id: "Your Order" })}</h6>
                    <h6 className="text-muted">
                      {intl.formatMessage({ id: "Subtotal" })}
                    </h6>
                  </div>
                  <div className="divider-2 mb-30"></div> */}
                  {loading ? (
                    <div class="d-flex justify-content-center align-items-center ">
                      <Spinner animation="border" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  ) : (
                    <div className="table-responsive order_table">
                      {cartItemsData.length <= 0 && "No Products"}
                      {cartItemsData.length > 0 ? (
                        <table className="table no-border">
                          <thead>
                            <td colSpan={3}>
                              <h6>
                                {intl.formatMessage({ id: "Your Order" })}
                              </h6>
                            </td>
                            <td>
                              <h6>{intl.formatMessage({ id: "Subtotal" })}</h6>
                            </td>
                          </thead>
                          <tbody>
                            {cartItemsData?.map((item, i) => (
                              <tr key={i}>
                                <td className="image product-thumbnail">
                                  <img
                                    src={item?.product?.image?.[0]}
                                    alt="#"
                                  />
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
                                            width: `${item?.product?.overall_rating
                                              ? item?.product?.overall_rating
                                              : 0
                                              }%`,
                                          }}
                                        ></div>
                                      </div>
                                      <span className="font-small ml-5 text-muted">
                                        {`(
                                    ${item?.product?.total_reviews
                                            ? item?.product?.total_reviews
                                            : 0
                                          }
                                    )`}
                                      </span>
                                    </div>
                                  </h6>{" "}
                                </td>
                                <td>
                                  <h6 className="checkout_quantity text-muted pl-20 pr-20">
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
                  )}
                </div>
                <div className="border p-30 cart-totals mb-30 checkout_box desktop_notes">
                  <h6 className="mb-4">
                    {intl.formatMessage({ id: "Add Order Notes" })}
                  </h6>
                  <div className="px-40">
                    <textarea
                      className="orderNotes_textarea"
                      name="orderNotes"
                      as="textarea"
                      rows="3"
                      value={orderNotes}
                      // disabled={true}
                      onChange={(e) => setorderNotes(e.target.value)}
                      placeholder={intl.formatMessage({
                        id: "Customer Comment",
                      })}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="border p-30 cart-totals mb-30 checkout_box address_box">
                  <div className="address_div">
                    <div className="d-flex justify-content-between align-items-center">
                      <button
                        class="btn btn-fill-out btn-block address_div_btn"
                        onClick={toggleAddressModal1}
                      >
                        {intl.formatMessage({ id: "Select Address" })}
                      </button>
                      <button
                        class="btn btn-fill-out btn-block address_div_btn"
                        onClick={() => {
                          openModal(true);
                        }}
                      >
                        {intl.formatMessage({ id: "Add New Address" })}
                      </button>
                    </div>
                    <div>
                      {/* Modal for selecting the address */}
                      {showModalAddress1 && (
                        <div className="modal-overlay" style={{ zIndex: 9999 }}>
                          <div className="modalAddress">
                            <div className="d-flex justify-content-between">
                              <h3>
                                {" "}
                                {intl.formatMessage({ id: "Select Address" })}
                              </h3>
                            </div>
                            <div className="divider-2 mb-15 mt-15"></div>
                            {address?.billing_address?.map((addressItem) => (
                              <div
                                key={addressItem.id}
                                className="custome-radio"
                              >
                                <input
                                  type="radio"
                                  id={`address${addressItem.id}`}
                                  name="selectedAddress"
                                  className="form-check-input"
                                  value={addressItem.id}
                                  checked={
                                    selectedAddressDropdown === addressItem.id
                                  }
                                  onChange={async (e) => {
                                    // console.log("Selected address ID from map:", e); // Log the address ID
                                    // setAddressFormOpen(false)
                                    //  await   setRegionId(regionId)
                                    setRegionId(addressItem.region_id)
                                    setredeem(false) //reset reddem
                                    setSelectedAddressdisplay(addressItem);
                                    console.log("addres display data", addressItem.region_id)
                                    setSelectedAddressDropdown(addressItem.id); // Set the selected address ID

                                    // Find the selected option
                                    const selectedOption =
                                      address?.billing_address?.find(
                                        (option) =>
                                          option.id === parseInt(e.target.value)
                                      );

                                    // If the selected option is found, get the region ID and call getCartData
                                    if (selectedOption) {
                                      const regionId = selectedOption.region_id;
                                      console.log(
                                        "Selected address region id:",
                                        regionId
                                      );
                                      setRegionId(regionId)

                                      getCartData(regionId);
                                    }

                                    // Call findElementById with the selected address ID
                                    findElementById(e.target.value);
                                  }}
                                />
                                <label
                                  htmlFor={`address${addressItem.id}`}
                                  className="form-check-label"
                                >
                                  {`${addressItem.full_name !== null
                                    ? addressItem.full_name + ",\n"
                                    : ""
                                    } 
                              ${addressItem.address !== null
                                      ? addressItem.address + ",\n"
                                      : ""
                                    } 
                              ${addressItem.road !== null
                                      ? addressItem.road + ",\n"
                                      : ""
                                    } 
                              ${addressItem.city_name !== null
                                      ? addressItem.city_name + ",\n"
                                      : ""
                                    } 
                              ${addressItem.state_name !== null
                                      ? addressItem.state_name + ",\n"
                                      : ""
                                    } 
                              ${addressItem.post_code !== null
                                      ? addressItem.post_code
                                      : ""
                                    }`}
                                </label>
                              </div>
                            ))}
                            <button
                              class="submit"
                              onClick={() => setShowModalAddress1(false)}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Display the selected address */}
                      {selectedAddressdisplay && (
                        <div>
                          <h6>Selected Address:</h6>
                          <p>
                            {selectedAddressdisplay.full_name},{" "}
                            {selectedAddressdisplay.address},{" "}
                            {selectedAddressdisplay.road},{" "}
                            {selectedAddressdisplay.city_name},{" "}
                            {selectedAddressdisplay.state_name},{" "}
                            {selectedAddressdisplay.post_code}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="border p-30 cart-totals mb-30 checkout_box time_box">
                  <div className="delivery_time_div">
                    <div className="heading_s1 mb-3">
                      <h6>{intl.formatMessage({ id: "Delivery time" })}</h6>
                    </div>

                    <div className="time_box_input">
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
                              onChange={(e) => {
                                handleRadioChange(radioId);
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={radioId}
                              data-bs-toggle="collapse"
                              data-target="#timeslot"
                              aria-controls="timeslot"
                            >
                              {/* {console.log("start time", Item.start_time)} */}
                              {moment(Item.start_time, "HH:mm:ss").format(
                                "h:mm A"
                              )}{" "}
                              -{" "}
                              {moment(Item?.end_time, "HH:mm:ss").format(
                                "h:mm A"
                              )}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="border p-30 cart-totals mb-30 checkout_box payment_box">
                  <div className="payment_method">
                    <div className="heading_s1 mb-3">
                      <h6>{intl.formatMessage({ id: "Payment Method" })}</h6>
                    </div>

                    <div className="payment_option">
                      <div className="custome-radio">
                        <input
                          className="form-check-input"
                          required
                          type="radio"
                          name="payment_option"
                          id="exampleRadios3"
                          value="cash_on_delivery"
                          checked={selectedOption === "cash_on_delivery"}
                          onChange={handleChangeRadio}
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
                      </div>
                      <div className="custome-radio">
                        <input
                          className="form-check-input"
                          required
                          type="radio"
                          name="payment_option"
                          id="exampleRadios4"
                          value="paypal"
                          checked={selectedOption === "paypal"}
                          onChange={handleChangeRadio}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleRadios4"
                          data-bs-toggle="collapse"
                          data-target="#checkPayment"
                          aria-controls="checkPayment"
                        >
                          Paypal
                        </label>
                      </div>
                      {/* Add similar structure for other payment options */}

                      {/* Conditionally render content based on selectedOption */}
                      {selectedOption === "COD" && (
                        <div
                          className="form-group collapse in"
                          id="bankTranfer"
                        >
                          {/* Content for COD */}
                          <p className="text-muted mt-5">
                            {/* Information about COD */}
                          </p>
                        </div>
                      )}
                      {selectedOption === "Paypal" && (
                        <div
                          className="form-group collapse in"
                          id="checkPayment"
                        >
                          {/* Content for Paypal */}
                          <p className="text-muted mt-5">
                            {/* Information about Paypal */}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {!loading && <div className="minOrderAmount_div">
                    {(cartTotal?.befor_total <= cartTotal.minOrderAmount) ? (
                      <h6 style={{ color: "red" }}>
                        {intl.formatMessage({
                          id: "Oops! Your cart is below ¥ 2500. Please add items worth",
                        })}{" "}¥{" "}
                        {calculateAmountToAdd()}
                        {intl.formatMessage({
                          id: " or more to place your order. Happy shopping!",
                        })}
                      </h6>
                    ) : (
                      <h6 style={{ color: "green" }}>
                        {intl.formatMessage({
                          id: "Congratulations! You are eligible to place an order",
                        })}
                      </h6>
                    )}
                  </div>}
                </div>

                <div className="border p-30 cart-totals mb-30 checkout_box payment_box">
                  <div className="payment_method">
                    <div className="heading_s1 mb-3">
                      <h6>{intl.formatMessage({ id: "Reward Points" })}</h6>
                    </div>

                    {balance > 0 && <div style={{ flexDirection: "row" }} className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        disabled={selectedOption !== "paypal" && cartTotal?.befor_total <= cartTotal.minOrderAmount || balance == 0}
                        style={{ height: 20, width: 20, marginRight: 10, color: "red" }}
                        checked={redeem}  // Control checked state using `redeem` value
                        onChange={() => setredeem(prev => !prev)}  // Toggle `redeem` value on change
                      />

                      <div style={{ flexDirection: "column" }}>
                        <div>
                          <span style={{ color: "grey", fontSize: 15 }}>Sartaj {intl.formatMessage({ id: "Points" })}</span>
                          <span style={{
                            color: "white", fontSize: 10, alignSelf: "flex-start", backgroundColor: "red", paddingTop: 2, paddingBottom: 2, paddingLeft: 5, paddingRight: 5, marginLeft: 5, borderRadius: 10
                          }}>{intl.formatMessage({ id: "New" })}</span>

                        </div>
                        {console.log("payment mwthid", selectedOption)}
                        {
                          selectedOption !== "paypal" && (cartTotal?.befor_total <= cartTotal.minOrderAmount) ?
                            <> <span style={{ fontSize: 15 }}>{intl.formatMessage({ id: `Your balance is` })}</span> <span> `¥ {balance}`</span></>

                            :
                            <>
                              <span style={{ fontSize: 15 }}>{intl.formatMessage({ id: `You are eligible to use` })}</span><span> ¥ {elebal} </span>
                              <span style={{ color: "grey" }}>{intl.formatMessage({ id: `of` })}</span><span style={{ color: "grey" }}> ¥ {balance}</span>
                            </>

                        }
                      </div>
                    </div>}

                  </div>
                  <div className="minOrderAmount_div">

                    {!loading && balance > 0 && <div className="minOrderAmount_div">
                      {selectedOption !== "paypal" && (cartTotal?.befor_total <= cartTotal.minOrderAmount) ? (
                        <h6 style={{ color: "red" }}>
                          {intl.formatMessage({
                            id: "Oops! Your cart is below ¥ 2500. You are not eligible to use reward points",
                          })}


                        </h6>
                      ) : (
                        // <h6 style={{ color: "green" }}>
                        //   {intl.formatMessage({
                        //     id: `Congratulations! You are eligible to use ¥`+` ${elebal}` +`in reward points`,
                        //   })}
                        // </h6>
                        <h6 style={{ color: "green" }}>
                          {intl.formatMessage(
                            {
                              id: "Congratulations! You are eligible to use ¥ in reward points",
                            },
                            {
                              amount: elebal, // Inject dynamic value
                            }
                          )}
                        </h6>
                      )}
                    </div>}
                    {balance == 0 && <h6 style={{ color: "red" }}>
                      {intl.formatMessage({
                        id: "Your wallet balance is currently ¥0. Earn reward points by shopping",
                      })}
                    </h6>}
                  </div>
                </div>

                <div className="border p-30 cart-totals mb-30 checkout_box mobile_bottom_margin">
                  <div className="mb-20">
                    {!redeem && <form method="post" className="apply-coupon">
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
                    </form>}

                    <h6 style={{ color: "green", marginTop: "15px" }}>
                      {coupanDetails}
                    </h6>
                  </div>
                  <div className="heading_s1 mb-3">
                    <h6>{intl.formatMessage({ id: "Cart Totals" })}</h6>
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
                              id: "All Item in Dry Shipping",
                            })}
                            :
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
                              {cartTotal?.ten_percent ? 10 : 0}%
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
                      {redeem ? (
                        <tr>
                          <td
                            style={{
                              border: "1px solid #bababa",
                              padding: "5px 15px",
                            }}
                            className="text-start"
                          >
                            <strong>
                              {intl.formatMessage({ id: "Wallet" })}{" "}

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
                              - ¥{elebal}
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
                  <div className="mobile_checkout_btn">
                    {loading ? (
                      <div class="d-flex justify-content-center align-items-center ">
                        <Spinner animation="border" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </Spinner>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          placeOrder();
                        }}
                        disabled={showModaladdress == true}
                        className="w-100 btn btn-fill-out btn-block"
                      >
                        {intl.formatMessage({ id: "Place Order" })}
                      </button>
                    )}
                  </div>
                </div>

                <div className="border p-30 cart-totals mb-30 checkout_box mobile_notes mb-30 ">
                  <h6 className="mb-4">
                    {intl.formatMessage({ id: "Add Order Notes" })}
                  </h6>
                  <div className="px-40">
                    <textarea
                      className="orderNotes_textarea"
                      name="orderNotes"
                      as="textarea"
                      rows="3"
                      value={orderNotes}
                      // disabled={true}
                      onChange={(e) => setorderNotes(e.target.value)}
                      placeholder={intl.formatMessage({
                        id: "Customer Comment",
                      })}
                    />
                  </div>
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
