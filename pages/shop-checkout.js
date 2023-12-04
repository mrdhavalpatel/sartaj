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
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { API_BASE_URL, api } from "../lib/api";
import axios from "axios";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const [cartItemsData, setCartItemsData] = useState([]);
  const price = () => {
    let price = 0;
    cartItems.forEach((item) => (price += item.price * item.quantity));

    return price;
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
  const handleCoupencode = async () => {
    let token = localStorage.getItem("token");
    let payload = {
      code: coupenCode,
    };
    const response = await axios.post(`${API_BASE_URL}coupon/apply`, payload, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    // coupenCode(response);
    if (response?.status === 200) {
      setCoupenCodeDis(response?.data?.discount);
    }
  };

  const placeOrder = async () => {
    let token = localStorage.getItem("token");

    let payload = {
      order_amount: price() + 600,
      payment_method: "cash_on_delivery",
      delivery_address_id: address?.billing_address?.[0]?.id,
      order_type: "delivery",
      coupon_discount_amount: coupenCodeDis,
      cart: [cartItemsData],
    };
    // let payload = {
    //   order_amount: 1461,
    //   payment_method: "cash_on_delivery",
    //   delivery_address_id: "1",
    //   order_type: "delivery",
    //   distance: "3",
    //   coupon_discount_amount: 10,
    //   cart: [
    //     {
    //       product_id: 24,
    //       quantity: 1,
    //       special_price: "0.00",
    //       sub_total: "861.00",
    //       updated_at: "2023-12-01T11:54:27.000000Z",
    //       user_id: 2,
    //       created_at: "2023-12-01T11:54:27.000000Z",
    //       discount: "0.00",
    //       discount_type: "amount",
    //       id: 55,
    //       price: "861.00",
    //       product: {
    //         attributes: "[]",
    //         capacity: 1,
    //         category_ids: [
    //           { id: "62", position: 1 },
    //           { id: "64", position: 2 },
    //         ],
    //         choice_options: "[]",
    //         created_at: "2023-12-01T09:54:09.000000Z",
    //         d_height: null,
    //         d_length: null,
    //         d_width: null,
    //         daily_needs: 0,
    //         date_available: null,
    //         description:
    //           "Amchur (Dry Mango Powder) SARTAJ | आमचूर पाउडर - 500gm\r\n\r\nDried mango powder, or commonly known as Amchur, is a common household spice in India and neighboring middle eastern countries. It is mainly used to add a strong flavor to the curries, chutneys, soups, and marinades. It is rich in antioxidants, amchur not only boosts metabolism but also aids in weight loss and skin conditions. It is a fruity spice powder made from dried unripe green mangoes and is used as a citrusy seasoning. It is mostly produced in India and is used to flavor foods and add the nutritional benefits of mangoes when the fresh fruit is out of season.\r\n\r\nHow To Store: Store in a tightly sealed container in a cool and dry place away from any direct heat.\r\nCountry of Origin: India\r\nManufacturer: Sartaj Co. Ltd\r\nItem Weight: 500 gm",
    //         discount: 0,
    //         discount_type: "percent",
    //         downloads: "[]",
    //         ena: null,
    //         filters: "[]",
    //         id: 24,
    //         image: [
    //           "https://phplaravel-941212-4027573.cloudwaysapps.com/storage/product/2023-12-01-6569ad73d9f52.png",
    //         ],
    //         is_featured: 0,
    //         isbn: null,
    //         jan: null,
    //         length_class: "Centimeter",
    //         location: null,
    //         manufacturer: null,
    //         manufacturer_id: 37,
    //         maximum_order_quantity: 1,
    //         meta_tag_description:
    //           "AMCHUR POWDER (आमचूर पाउडर) SARTAJ\r\nIt is a fruity spice powder made from dried unripe green mangoes and is used as a citrusy seasoning. It is mostly produced in India and is used to flavor foods and add the nutritional benefits of mangoes.",
    //         meta_tag_keywords:
    //           "ドライマンゴーパウダー（アムチュール）500g, Dried mango powder, Amchur powder, amchur, mango powder, Indian spices in japan",
    //         meta_title: "AMCHUR POWDER (आमचूर पाउडर) SARTAJ",
    //         model: "2002",
    //         mpn: null,
    //         name: "Amchur (Dry Mango Powder) SARTAJ | आमचूर पाउडर - 500gm",
    //         out_of_stock_status: "2-3 days",
    //         overall_rating: 0,
    //         popularity_count: 1,
    //         price: 861,
    //         product_mark: "Veg",
    //         product_tag: null,
    //         product_type: null,
    //         rating: [],
    //         releted_product: null,
    //         requires_shipping: "yes",
    //         sale_end_date: null,
    //         sale_price: null,
    //         sale_start_date: null,
    //         seo_en: "eng/buy-amchur-powder-sartaj-500g-at-sartajfoods.jp",
    //         seo_ja: "jp/buy-amchur-powder-sartaj-500g-at-sartajfoods.jp",
    //         sku: null,
    //         sort_order: null,
    //         status: 1,
    //         stores: null,
    //         substrack_stock: "yes",
    //         tax: 8,
    //         tax_type: "percent",
    //         total_reviews: 0,
    //         total_stock: 58,
    //         translations: [],
    //         unit: "kg",
    //         upc: null,
    //         updated_at: "2023-12-01T11:46:20.000000Z",
    //         variations: "[]",
    //         view_count: 1,
    //         weight: "500.000000",
    //         weight_class: "Gram",
    //       },
    //     },
    //   ],
    // };

    const response = await axios.post(
      `${API_BASE_URL}customer/order/place`,
      payload,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("responseresponseresponseresponse", response?.status);
    if (response?.status == 200) {
      router.push("/OrderReceived");
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

  const getCartData = (token) => {
    const response = axios
      .get(`${API_BASE_URL}customer/cart`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCartItemsData(res?.data?.cartProducts?.[0]);
      })
      .catch((error) => {
        console.log("error", error?.code === "ERR_NETWORK");
      });
  };
  useEffect(() => {
    let encodedToken = localStorage.getItem("token");
    if (encodedToken) {
      getUserDetails(encodedToken);
      getAddress(encodedToken);
      getCartData(encodedToken);
    }
  }, []);
  return (
    <>
      <Layout parent="Home" sub="Shop" subChild="Checkout">
        <section className="mt-50 mb-50">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mb-40">
                <h1 className="heading-2 mb-10">Checkout</h1>
                <div className="d-flex justify-content-between">
                  <h6 className="text-body">
                    Carefully check the information before checkout
                  </h6>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-7">
                <div className="row mb-50">
                  <div className="col-lg-6 mb-sm-15 mb-lg-0 mb-md-3">
                    {/* <div className="toggle_info">
                      <span>
                        <i className="fi-rs-user mr-10"></i>
                        <span className="text-muted font-lg">
                          Already have an account?
                        </span>{" "}
                        <a
                          href="#loginform"
                          data-bs-toggle="collapse"
                          className="collapsed font-lg"
                          aria-expanded="false"
                        >
                          Click here to login
                        </a>
                      </span>
                    </div> */}
                    <div className="">
                      <form method="post" className="apply-coupon">
                        <input
                          type="text"
                          onChange={(e) => {
                            setCoupenCode(e?.target?.value);
                          }}
                          value={coupenCode}
                          placeholder="Enter Coupon Code..."
                        />
                        <button
                          className="btn  btn-md"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCoupencode();
                          }}
                        >
                          Apply Coupon
                        </button>
                      </form>
                    </div>
                    <div
                      className="panel-collapse collapse login_form"
                      id="loginform"
                    >
                      <div className="panel-body">
                        <p className="mb-30 font-sm">
                          If you have shopped with us before, please enter your
                          details below. If you are a new customer, please
                          proceed to the Billing &amp; Shipping section.
                        </p>
                        <form method="post">
                          <div className="form-group">
                            <input
                              type="text"
                              name="email"
                              placeholder="Username Or Email"
                            />
                          </div>
                          <div className="form-group">
                            <input
                              type="password"
                              name="password"
                              placeholder="Password"
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
                                  <span>Remember me</span>
                                </label>
                              </div>
                            </div>
                            <a href="#">Forgot password?</a>
                          </div>
                          <div className="form-group">
                            <button className="btn btn-md" name="login">
                              Log in
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-25">
                  <h4>Billing Details</h4>
                </div>
                <Formik
                  enableReinitialize
                  initialValues={{
                    fname: userDetails?.f_name,
                    lname: userDetails?.l_name,
                    // cname: "",
                    billing_address: address?.billing_address?.[0]?.address,
                    billing_address2: address?.billing_address?.[0]?.road,
                    city: address?.billing_address?.[0]?.city,
                    state: address?.billing_address?.[0]?.state,
                    zipcode: address?.billing_address?.[0]?.post_code,
                    phone: userDetails?.phone,
                    email: userDetails?.email,
                    // password: "",
                  }}
                  onSubmit={(values) => {
                    console.log(values);
                  }}
                >
                  <Form method="post">
                    <div className="form-group">
                      <Field
                        type="text"
                        required=""
                        name="fname"
                        placeholder="First name *"
                      />
                    </div>
                    <div className="form-group">
                      <Field
                        type="text"
                        required=""
                        name="lname"
                        placeholder="Last name *"
                      />
                    </div>
                    {/* <div className="form-group">
                      <Field
                        required=""
                        type="text"
                        name="cname"
                        placeholder="Company Name"
                      />
                    </div> */}

                    <div className="form-group">
                      <Field
                        type="text"
                        name="billing_address"
                        required=""
                        placeholder="Address *"
                      />
                    </div>
                    <div className="form-group">
                      <Field
                        type="text"
                        name="billing_address2"
                        required=""
                        placeholder="Address line2"
                      />
                    </div>
                    <div className="form-group">
                      <Field
                        required=""
                        type="text"
                        name="city"
                        placeholder="City / Town *"
                      />
                    </div>
                    <div className="form-group">
                      <Field
                        required=""
                        type="text"
                        name="state"
                        placeholder="State / County *"
                      />
                    </div>
                    <div className="form-group">
                      <Field
                        required=""
                        type="text"
                        name="zipcode"
                        placeholder="Postcode / ZIP *"
                      />
                    </div>
                    <div className="form-group">
                      <Field
                        required=""
                        type="text"
                        name="phone"
                        placeholder="Phone *"
                      />
                    </div>
                    <div className="form-group">
                      <Field
                        required=""
                        type="text"
                        name="email"
                        placeholder="Email address *"
                      />
                    </div>
                    <div
                      id="collapsePassword"
                      className="form-group create-account collapse in"
                    >
                      <Field
                        required=""
                        type="password"
                        placeholder="Password"
                        name="password"
                      />
                    </div>
                    {/* <div className="form-group">
                    <div className="checkbox">
                      <div className="custome-checkbox">
                        <Field
                          className="form-check-input"
                          type="checkbox"
                          name="checkbox"
                          id="createaccount"
                        />
                        <label
                          className="form-check-label label_info"
                          data-bs-toggle="collapse"
                          href="#collapsePassword"
                          data-target="#collapsePassword"
                          aria-controls="collapsePassword"
                          htmlFor="createaccount"
                        >
                          <span>Create an account?</span>
                        </label>
                      </div>
                    </div>
                  </div> */}

                    {/* <div className="ship_detail">
                    <div className="form-group">
                      <div className="chek-form">
                        <div className="custome-checkbox">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="checkbox"
                            id="differentaddress"
                          />
                          <label
                            className="form-check-label label_info"
                            data-bs-toggle="collapse"
                            data-target="#collapseAddress"
                            href="#collapseAddress"
                            aria-controls="collapseAddress"
                            htmlFor="differentaddress"
                          >
                            <span>Ship to a different address?</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div
                      id="collapseAddress"
                      className="different_address collapse in"
                    >
                      <div className="form-group">
                        <input
                          type="text"
                          required=""
                          name="fname"
                          placeholder="First name *"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          required=""
                          name="lname"
                          placeholder="Last name *"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          required=""
                          type="text"
                          name="cname"
                          placeholder="Company Name"
                        />
                      </div>

                      <div className="form-group">
                        <input
                          type="text"
                          name="billing_address"
                          required=""
                          placeholder="Address *"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          name="billing_address2"
                          required=""
                          placeholder="Address line2"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          required=""
                          type="text"
                          name="city"
                          placeholder="City / Town *"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          required=""
                          type="text"
                          name="state"
                          placeholder="State / County *"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          required=""
                          type="text"
                          name="zipcode"
                          placeholder="Postcode / ZIP *"
                        />
                      </div>
                    </div>
                  </div> */}
                    {/* <div className="form-group mb-30">
                      <textarea rows="5" placeholder="Order notes"></textarea>
                    </div> */}
                  </Form>
                </Formik>
              </div>
              <div className="col-lg-5">
                <div className="border p-40 cart-totals ml-30 mb-50">
                  <div className="d-flex align-items-end justify-content-between mb-30">
                    <h4>Your Order</h4>
                    <h6 className="text-muted">Subtotal</h6>
                  </div>
                  <div className="divider-2 mb-30"></div>
                  <div className="table-responsive order_table">
                    {cartItems.length <= 0 && "No Products"}
                    <table
                      className={
                        cartItems.length > 0 ? "table no-border" : "d-none"
                      }
                    >
                      <tbody>
                        {cartItems.map((item, i) => (
                          <tr key={i}>
                            <td className="image product-thumbnail">
                              <img src={item?.image?.[0]} alt="#" />
                            </td>
                            <td>
                              {console.log("item", item)}
                              <h6 className="w-160 mb-5">
                                <a>{item?.name}</a>
                                <div className="product-rate-cover">
                                  <div className="product-rate d-inline-block">
                                    <div
                                      className="product-rating"
                                      style={{
                                        width: `${
                                          item?.overall_rating
                                            ? item?.overall_rating
                                            : 0
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="font-small ml-5 text-muted">
                                    {`(
                                    ${
                                      item?.total_reviews
                                        ? item.total_reviews
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
                                {(item.quantity ? item.quantity : 1) *
                                  item.price}
                              </h4>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bt-1 border-color-1 mt-30 mb-30"></div>
                  <div className="payment_method">
                    <div className="mb-25">
                      <h5>Payment</h5>
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
                          COD
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
                  <button
                    onClick={() => {
                      placeOrder();
                    }}
                    className="btn btn-fill-out btn-block mt-30"
                  >
                    Place Order
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
