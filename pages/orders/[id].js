import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { api } from "../../lib/api";
import { Button, Spinner } from "react-bootstrap";

const OrderDetails = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  console.log("orderid slug id", router?.query?.id);

  const getOrderDetails = async () => {
    try {
      const orderId = router?.query?.id;
      let encodedToken = localStorage.getItem("token");
      const response = await api.get(
        `customer/order/shipping_list/${orderId}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${encodedToken}`,
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
  }, []);

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
          Go back
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
                    Order Details
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-left" style={{ width: "50%" }}>
                    {" "}
                    <b>Order ID:</b> #{orderDetails?.id}
                    <br />
                    <b>Date Added:</b> {formatDate(orderDetails.created_at)}
                  </td>
                  <td class="text-left" style={{ width: "50%" }}>
                    {" "}
                    <b>Payment Method:</b> Cash On Delivery
                    <br />
                    <b>Shipping Method:</b> All Item in Dry Shipping
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
                    Payment Address
                  </td>
                  <td
                    class="text-left"
                    style={{ width: "50%", verticalAlign: "top" }}
                  >
                    Shipping Address
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-left">
                    {orderDetails.delivery_address.contact_person_name}
                    <br />
                    {orderDetails.delivery_address.road}
                    <br />
                    {orderDetails.delivery_address.address}
                    <br />
                    {orderDetails.delivery_address.state}
                    {orderDetails.delivery_address.country && (
                      <>
                        <br /> {orderDetails.delivery_address.country}{" "}
                      </>
                    )}
                    <br />
                    Postal code: {orderDetails.delivery_address.post_code}
                  </td>
                  <td class="text-left">
                    {orderDetails.delivery_address.contact_person_name}
                    <br />
                    {orderDetails.delivery_address.road}
                    <br />
                    {orderDetails.delivery_address.address}
                    <br />
                    {orderDetails.delivery_address.state}
                    {orderDetails.delivery_address.country && (
                      <>
                        <br /> {orderDetails.delivery_address.country}{" "}
                      </>
                    )}
                    <br />
                    Postal code: {orderDetails.delivery_address.post_code}
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="table-responsive">
              <table class="table table-bordered table-hover">
                <thead>
                  <tr>
                    <td class="text-left">Product Name</td>
                    <td class="text-right">Quantity</td>
                    <td class="text-right">Price</td>
                    <td class="text-right">Total</td>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails?.details?.map((details) => {
                    return (
                      <>
                        <tr>
                          <td class="text-left">
                            <span
                              dangerouslySetInnerHTML={{
                                __html: details.product.name,
                              }}
                            />
                          </td>
                          <td class="text-right">{details?.quantity}</td>
                          <td class="text-right">
                            ¥{details?.product?.actual_price}
                          </td>
                          <td class="text-right">
                            ¥{details?.product?.actual_price * details.quantity}
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2"></td>
                    <td class="text-right">
                      <b>Sub-Total</b>
                    </td>
                    <td class="text-right">¥{orderDetails?.total_sub_amt}</td>
                  </tr>
                  {orderDetails?.delivery_charge && (
                    <tr>
                      <td colspan="2"></td>
                      <td class="text-right">
                        <b>All Item in Dry Shipping</b>
                      </td>
                      <td class="text-right">¥600</td>
                    </tr>
                  )}
                  {orderDetails.eight_percent &&
                  orderDetails.eight_percent !== 0 ? (
                    <tr>
                      <td colspan="2"></td>
                      <td class="text-right">
                        <b>Consumption Tax 8%</b>
                      </td>
                      <td class="text-right">¥{orderDetails.eight_percent}</td>
                    </tr>
                  ) : (
                    ""
                  )}
                  {orderDetails.ten_percent &&
                  orderDetails.ten_percent !== 0 ? (
                    <tr>
                      <td colspan="2"></td>
                      <td class="text-right">
                        <b>Consumption Tax 10%</b>
                      </td>
                      <td class="text-right">¥{orderDetails.ten_percent}</td>
                    </tr>
                  ) : (
                    ""
                  )}
                  <tr>
                    <td colspan="2"></td>
                    <td class="text-right">
                      <b>Total</b>
                    </td>
                    <td class="text-right">¥{orderDetails.total_amt}</td>
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
