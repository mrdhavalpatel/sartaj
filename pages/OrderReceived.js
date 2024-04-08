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
  const router = useRouter();

  const [shippingData, setShippingData] = useState([]); // State to manage popup visibility
  //console.log("orderid slug",router?.query?.order_id)
  const getShippingDetails = async (token, orderId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}customer/order/shipping_list/${orderId}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-localization": intl.locale == "eng" ? "en" : "ja",
          },
        }
      );
      setShippingData(response?.data?.data);
      clearCart();
    } catch (error) {
      console.error("Error fetching shipping details:", error);
    }
  };

  useEffect(() => {
    const orderId = router?.query?.order_id;

    // Check if orderId is defined before making the API call
    if (orderId) {
      let encodedToken = localStorage.getItem("token");
      getShippingDetails(encodedToken, orderId);

      // Clear the cart when the component is unmounted or the user navigates away
      return () => {
        clearCart();
      };
    }
  }, [router?.query?.order_id, clearCart]);

  // // Listen for changes in the browser's history
  // useEffect(() => {
  //   const handleRouteChange = (url) => {
  //     // Check if the user navigated back
  //     if (url === "/") {
  //       // Redirect to the home page
  //       router.push("/");
  //     }
  //   };

  //   // Attach the event listener
  //   router.events.on("beforeHistoryChange", handleRouteChange);

  //   // Remove the event listener when the component is unmounted
  //   return () => {
  //     router.events.off("beforeHistoryChange", handleRouteChange);
  //   };
  // }, [router]);
  return (
    <Layout parent="Home" sub="Shop" subChild="Checkout">
      <section className="mt-50 mb-50">
        <div className="container">
          <div className="order_received_div" style={{ margin: "0 auto"}}>
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
              <table className="table table-bordered thankyou-table">
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
              <table className="table table-bordered  thankyou-table thankyou-table-info">
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
//                        {console.log("item",item)}
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
                          href={
                            intl.locale == "eng"
                              ? `${
                                  item?.seo_en
                                    ? item?.seo_en
                                    : item?.product?.seo_en
                                }`
                              : `${
                                  item?.seo_ja
                                    ? item?.seo_ja
                                    : item?.product?.seo_ja
                                }`
                          }
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html: item?.name
                                ? item?.name
                                : item?.product?.name,
                            }}
                          />
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
                      ¥
                      {shippingData?.delivery_charge ||
                        shippingData?.free_delivery_amount}
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
              <table className="table table-bordered  thankyou-table">
                <thead>
                  <tr>
                    <td>
                      <b>{intl.formatMessage({ id: "Customer Comment" })}: {shippingData.order_note ? shippingData.order_note : "No Comment"}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>{intl.formatMessage({ id: "Selected time for Delivery" })}: {shippingData.time_slot}</b>
                    </td>
                  </tr>
                </thead>
                <tbody>
                 
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
