import React, { useEffect, useState } from "react";
import {
  clearCart,
  getCartItems,
  closeCart,
  decreaseQuantity,
  deleteFromCart,
  increaseQuantity,
  openCart,
} from "../redux/action/cart";
import { connect } from "react-redux";
import Link from "next/link";
import { API_BASE_URL, api } from "../lib/api";
import Layout from "../components/layout/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { ApiCall } from "../lib/other/other";
import { useIntl } from "react-intl";
const OrderReceived = ({ cartItems }) => {
  const intl = useIntl();
  const [userDetails, setUserDetails] = useState([]);
  const [address, setAddress] = useState("");
  const [cartItemsData, setCartItemsData] = useState([]);
  const [shippingData, setShippingData] = useState([]); // State to manage popup visibility

  const router = useRouter();
  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     if (showConfirmation) {
  //       const confirmationMessage = "Are you sure you want to leave?";
  //       event.returnValue = confirmationMessage;
  //       return confirmationMessage;
  //     }
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [router.pathname, showConfirmation]);

  // useEffect(() => {
  //   setShowConfirmation(true);
  //   let token = localStorage.getItem("token");
  //   const confirmationTimeout = setTimeout(() => {
  //     setShowConfirmation(false);

  //     const res = axios
  //       .delete(`${API_BASE_URL}customer/cart/clear-cart`, {
  //         headers: {
  //           "Access-Control-Allow-Origin": "*",
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then(() => {
  //         localStorage.setItem("dokani_cart", "[]");
  //       });
  //   });

  //   return () => clearTimeout(confirmationTimeout);
  // }, [router.pathname]);

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
  const getCartsItem = async (token) => {
    const response = await axios
      .get(`${API_BASE_URL}customer/cart`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCartItemsData(response?.data);
      })
      .catch((error) => {
        console.log("error", error?.code === "ERR_NETWORK");
      });
  };

  const getShippingDetails = async (token) => {
    const response = await axios
      .get(
        `${API_BASE_URL}customer/order/shipping_list/${router.query.order_id}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setShippingData(response?.data?.data);
      })
      .catch((error) => {
        console.log("error", error?.code === "ERR_NETWORK");
      });
  };
  useEffect(() => {
    let encodedToken = localStorage.getItem("token");
    // getCartsItem(encodedToken);
    // getUserDetails(encodedToken);
    // getAddress(encodedToken);
    getShippingDetails(encodedToken);
  }, []);
  return (
    <Layout parent="Home" sub="Shop" subChild="Checkout">
      <section className="mt-50 mb-50">
        <div className="container">
          <div style={{ margin: "0 auto", fontFamily: "Montserrat" }}>
            <div style={{ pageBreakAfter: "always" }}>
              <h1>
                {intl.formatMessage({ id: "Order Received - Thank You!" })}
              </h1>
              <h3>
                {intl.formatMessage({ id: "Order id" })}{" "}
                {router?.query?.order_id}
              </h3>
              <p>
                {intl.formatMessage({
                  id: "Your order has been successfully received. Thank you for your purchase!",
                })}
              </p>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <td style={{ width: "50%" }}>
                      <b>{intl.formatMessage({ id: "Shipping Address" })}</b>
                    </td>
                    <td style={{ width: "50%" }}>
                      <b>{intl.formatMessage({ id: "Contact" })}</b>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {console.log(
                    "thank you for order shipping address object",
                    shippingData
                  )}
                  <tr>
                    <td>
                      {shippingData?.delivery_address?.address}
                      <br />
                      {shippingData?.delivery_address?.road}{" "}
                      {shippingData?.delivery_address?.state}{" "}
                      {shippingData?.delivery_address?.city}{" "}
                      {shippingData?.delivery_address?.post_code}
                      <br />
                    </td>
                    <td>
                      {shippingData?.delivery_address?.contact_person_name}{" "}
                      <br />
                      {shippingData?.delivery_address?.contact_person_number}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <td className="text-left">
                      {intl.formatMessage({ id: "Product" })}
                    </td>
                    <td className="text-left">
                      {intl.formatMessage({ id: "Model" })}
                    </td>
                    <td className="text-right">
                      {intl.formatMessage({ id: "Quantity" })}
                    </td>
                    <td className="text-right">
                      {intl.formatMessage({ id: "Unit Price" })}
                    </td>
                    <td className="text-right">
                      {intl.formatMessage({ id: "Total" })}
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {/* {shippingData?.products?.map((item, i) => (
                    <tr>
                      <td class="text-left">
                        <Link
                          href="/products/[slug]"
                          as={`/products/${item?.id}`}
                        >
                          {item?.name}
                        </Link>
                        {console.log("item",item)}
                      </td>
                      <td class="text-left">{item?.model}</td>
                      <td class="text-right"> {item?.quantity}</td>
                      <td class="text-right">¥{item?.price}</td>
                      <td class="text-right">
                        {" "}
                        ¥{(item?.quantity ? item?.quantity : 1) * item?.price}
                      </td>
                    </tr>
                  ))} */}
                  {shippingData?.details?.map((item, i) => (
                    <tr>
                      <td class="text-left">
                        <Link
                          href="/products/[slug]"
                          as={`/products/${item?.product_id}`}
                        >
                          {item?.product.name}
                        </Link>
                      </td>
                      <td class="text-left">{item?.product.model}</td>
                      <td class="text-right"> {item?.quantity}</td>
                      <td class="text-right">
                        ¥
                        {item?.product.actual_price
                          ? item?.product.actual_price
                          : item.price}
                      </td>
                      <td class="text-right">
                        {" "}
                        ¥
                        {(item?.quantity ? item?.quantity : 1) *
                          (item?.product.actual_price
                            ? item?.product.actual_price
                            : item.price)}
                      </td>
                    </tr>
                  ))}

                  {/* <tr>
              <td colspan="4" class="text-right">
                Consumption Tax 8%
              </td>
              <td class="text-right">¥967</td>
            </tr> */}
                  <tr>
                    <td colspan="4" class="text-right">
                      {intl.formatMessage({ id: "Sub Total" })}
                    </td>
                    <td class="text-right">¥{shippingData?.total_sub_amt}</td>
                  </tr>
                  <tr>
                    <td colspan="4" class="text-right">
                      {intl.formatMessage({ id: "All Item in Dry Shipping" })}:{" "}
                    </td>
                    <td class="text-right">
                      {" "}
                      ¥{shippingData?.delivery_charge}
                    </td>
                  </tr>
                  {shippingData?.eight_percent != 0 ? (
                    <tr>
                      <td colspan="4" class="text-right">
                        {intl.formatMessage({ id: "Consumption Tax" })}{" "}
                        {shippingData?.eight_percent ? 8 : 0}%
                      </td>
                      <td class="text-right">
                        {" "}
                        ¥
                        {shippingData?.eight_percent
                          ? shippingData?.eight_percent
                          : 0}
                      </td>
                    </tr>
                  ) : null}
                  {shippingData?.ten_percent != 0 ? (
                    <tr>
                      <td colspan="4" class="text-right">
                        {intl.formatMessage({ id: "Consumption Tax" })}{" "}
                        {shippingData?.ten_percent ? 10 : 0}%
                      </td>
                      <td class="text-right">
                        {" "}
                        ¥
                        {shippingData?.ten_percent
                          ? shippingData?.ten_percent
                          : 0}
                      </td>
                    </tr>
                  ) : null}
                  {shippingData?.couponPrice ? (
                    <tr>
                      <td colspan="4" class="text-right">
                        Discount Price
                      </td>
                      <td class="text-right"> ¥{shippingData?.couponPrice}</td>
                    </tr>
                  ) : null}
                  <tr>
                    <td colspan="4" class="text-right">
                      {intl.formatMessage({ id: "Total" })}
                    </td>
                    <td class="text-right">¥{shippingData?.total_amt}</td>
                  </tr>
                </tbody>
              </table>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <td>
                      <b>{intl.formatMessage({ id: "Customer Comment" })}</b>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{shippingData?.order_note}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
const mapStateToProps = (state) => ({
  cartItems: state.cart,
});

const mapDispatchToProps = {
  closeCart,
  openCart,
  clearCart,
};
export default connect(mapStateToProps, mapDispatchToProps)(OrderReceived);
