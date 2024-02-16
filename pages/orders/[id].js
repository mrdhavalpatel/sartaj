import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { API_BASE_URL, api } from "../../lib/api";
import { Button, Spinner } from "react-bootstrap";
import { useIntl } from "react-intl";
import { translatedItemDetails } from "../../util/util";

const OrderDetails = () => {
  const router = useRouter();
  const intl = useIntl();
  const orderId = router?.query?.id;

  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  console.log("orderid slug id", router?.query?.id);

  const getOrderDetails = async () => {
    try {
      if (!orderId) return;
      let encodedToken = localStorage.getItem("token");
      const response = await api.get(
        `${API_BASE_URL}customer/order/shipping_list/${orderId}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${encodedToken}`,
            "X-localization": intl.locale == "eng" ? "en" : "ja",
          },
        }
      );
      setOrderDetails(response?.data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOrderDetails();
  }, [orderId]);

  const formatDate = function (unformatedDate) {
    const date = new Date(unformatedDate);
    let day = date.getDate().toString().padStart(2, "0");
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Layout parent="Home">
      <div className="container" style={{ maxWidth: "70%", marginTop: 20 }}>
        <Button
          variant="primary"
          onClick={() => router.push(`/my-account?activeIndex=2`)}
          size="sm"
        >
          {intl.formatMessage({ id: "Go Back" })}
        </Button>
        {isLoading ? (
          <div
            style={{ height: "60vh" }}
            className="d-flex justify-content-center align-items-center"
          >
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <div class="account_order">
            <table class="table table-bordered table-hover">
              <thead>
                <tr>
                  <td class="text-left" colspan="2">
                    {intl.formatMessage({ id: "Order Details" })}
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-left" style={{ width: "50%" }}>
                    <b>{intl.formatMessage({ id: "Order ID" })}:</b> #
                    {orderDetails?.id}
                    <br />
                    <b>{intl.formatMessage({ id: "Date Added" })}:</b>{" "}
                    {formatDate(orderDetails?.created_at)}
                  </td>
                  <td className="text-left" style={{ width: "50%" }}>
                    <b>{intl.formatMessage({ id: "Payment Method" })}:</b>{orderDetails?.payment_method =="cash_on_delivery" ? intl.formatMessage({ id: "Cash On Delivery" }) : intl.formatMessage({ id: "Online"})} <br />
                    <b>{intl.formatMessage({ id: "Shipping Method" })}:</b>{intl.formatMessage({ id: "All Item in Dry Shipping"})}
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="table table-bordered table-hover">
              <thead>
                <tr>
                  <td
                    class="text-left"
                    style={{ width: "50%", verticalAlign: "top" }}
                  >
                    {intl.formatMessage({ id: "Payment Address" })}
                  </td>
                  <td
                    class="text-left"
                    style={{ width: "50%", verticalAlign: "top" }}
                  >
                    {intl.formatMessage({ id: "Shipping Address" })}
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-left">
                    {orderDetails?.delivery_address?.contact_person_name}
                    <br />
                    {orderDetails?.delivery_address?.road}
                    <br />
                    {orderDetails?.delivery_address?.address}
                    <br />
                    {orderDetails?.delivery_address?.state}
                    {orderDetails?.delivery_address?.country && (
                      <>
                        <br /> {orderDetails?.delivery_address?.country}{" "}
                      </>
                    )}
                    <br />
                    {intl.formatMessage({ id: "Postal code" })}: {orderDetails?.delivery_address?.post_code}
                  </td>
                  <td class="text-left">
                    {orderDetails?.delivery_address?.contact_person_name}
                    <br />
                    {orderDetails?.delivery_address?.road}
                    <br />
                    {orderDetails?.delivery_address?.address}
                    <br />
                    {orderDetails?.delivery_address?.state}
                    {orderDetails?.delivery_address?.country && (
                      <>
                        <br /> {orderDetails?.delivery_address?.country}{" "}
                      </>
                    )}
                    <br />
                    Postal code: {orderDetails?.delivery_address?.post_code}
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="table-responsive">
              <table class="table table-bordered table-hover">
                <thead>
                  <tr>
                    <td class="text-left">
                      {intl.formatMessage({ id: "Product Name" })}
                    </td>
                    <td class="text-right">
                      {intl.formatMessage({ id: "Quantity" })}
                    </td>

                    <td class="text-right">
                      {intl.formatMessage({ id: "Price" })}
                    </td>

                    <td class="text-right">
                      {intl.formatMessage({ id: "Total" })}
                    </td>
                  </tr>
                </thead>
                <tbody>
  {orderDetails?.details?.map((details) => {
    return (
      <tr key={details.product.id}>
        <td className="text-left">
          {/* <span dangerouslySetInnerHTML={{ __html: details.product.name }} /> */}
         
          <span dangerouslySetInnerHTML={{ __html: translatedItemDetails("name", intl, details.product) }} />

        </td>
        <td className="text-right">{details.quantity}</td>
        <td className="text-right">¥{details.product.actual_price}</td>
        <td className="text-right">¥{details.product.actual_price * details.quantity}</td>
      </tr>
    );
  })}
</tbody>
<tfoot>
  <tr>
    <td colSpan="2"></td>
    <td className="text-right">
      <b>{intl.formatMessage({ id: "Sub-Total" })}</b>
    </td>
    <td className="text-right">¥{orderDetails?.total_sub_amt}</td>
  </tr>
  {orderDetails?.delivery_charge && (
    <tr>
      <td colSpan="2"></td>
      <td className="text-right">
        <b>{intl.formatMessage({ id: "All Item in Dry Shipping" })}</b>
      </td>
      <td className="text-right">¥600</td>
    </tr>
  )}
  {orderDetails?.eight_percent && orderDetails?.eight_percent !== 0 ? (
    <tr>
      <td colSpan="2"></td>
      <td className="text-right">
        <b>{intl.formatMessage({ id: "Consumption Tax 8%" })}</b>
      </td>
      <td className="text-right">¥{orderDetails?.eight_percent}</td>
    </tr>
  ) : null}
  {orderDetails?.ten_percent && orderDetails?.ten_percent !== 0 ? (
    <tr>
      <td colSpan="2"></td>
      <td className="text-right">
        <b>{intl.formatMessage({ id: "Consumption Tax 10%" })}</b>
      </td>
      <td className="text-right">¥{orderDetails?.ten_percent}</td>
    </tr>
  ) : null}
  <tr>
    <td colSpan="2"></td>
    <td className="text-right">
      <b>{intl.formatMessage({ id: "Total" })}</b>
    </td>
    <td className="text-right">¥{orderDetails?.total_amt}</td>
  </tr>
</tfoot>

              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrderDetails;
