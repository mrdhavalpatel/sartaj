import Link from "next/link";
import { useEffect, useState } from "react";
import Timer from "./Timer";
import { ApiCall } from "../../lib/other/other";
import { useIntl } from "react-intl";
const IntroPopup = () => {
  const intl = useIntl();
  const [openClass, setOpenClass] = useState(1);
  const [PopData, setPopData] = useState({});
  const handleRemove = () => {
    setOpenClass(!openClass);
  };
  const getPopData = async () => {
    try {
      let res = await ApiCall("get", intl, "hot-deals");
      let data = res?.data;
  
//      console.log("API Response:", data);
  
      // Assuming `data.start_date` and `data.end_date` are received correctly
      let startDate = new Date(data.start_date);
      let endDate = new Date(data.end_date);
      let currentDate = new Date();
  
//      console.log("Start Date:", startDate);
//      console.log("End Date:", endDate);
//      console.log("Current Date:", currentDate);
  
      // Check if the current date is between start and end dates
      if (startDate <= currentDate && currentDate <= endDate) {
        setPopData(data);
        setOpenClass(0);
      }
    } catch (error) {
      console.error("Error fetching pop-up data:", error);
    }
  };
  useEffect(() => {
    getPopData();
  }, []);
  return (
    <>
      <div
        className={
          openClass
            ? "modal fade custom-modal d-none"
            : "modal fade custom-modal  show d-block"
        }
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <button
              type="button"
              className="btn-close"
              onClick={handleRemove}
            ></button>
            <div className="modal-body">
              <div
                className="deal"
                style={{
                  backgroundImage: `url(${
                    PopData?.image ? PopData?.image : "#"
                  })`,
                }}
              >
                <div className="deal-top">
                  <h2 className="text-brand">
                    {intl.formatMessage({ id: "Deal of the Month" })}
                  </h2>
                  <h5>{intl.formatMessage({ id: "Limited Offer." })}</h5>
                </div>
                <div className="deal-content  detail-info">
                  <h6 className="product-title">
                    <Link href="/" className="text-heading">
                      {PopData?.title}
                    </Link>
                  </h6>
                  <div className="clearfix product-price-cover">
                    <div className="product-price primary-color float-left">
                      <span className="current-price text-brand">
                        ¥{PopData?.product_discounted_price}
                      </span>
                      <span>
                        <span className="save-price font-md color3 ml-15">
                          {PopData?.discount}%{" "}
                          {intl.formatMessage({ id: "Off" })}
                        </span>
                        <span className="old-price font-md ml-15">
                          ¥{PopData?.product_price}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="deal-bottom">
                  <p className="mb-20">
                    {intl.formatMessage({ id: "Hurry Up! Offer End In:" })}
                  </p>
                  {/* <Timer endDateTime="2024-11-27 00:00:00" /> */}
                  {PopData?.end_date ? (
                    <Timer
                      endDateTime={PopData?.end_date ? PopData?.end_date : null}
                    />
                  ) : null}
                  {/* <div className="product-detail-rating">
                    <div className="product-rate-cover text-end">
                      <div className="product-rate d-inline-block">
                        <div
                          className="product-rating"
                          style={{ width: "90%" }}
                        ></div>
                      </div>
                      <span className="font-small ml-5 text-muted">
                        {" "}
                        (32 rates)
                      </span>
                    </div>
                  </div> */}
                  <Link
                    href={`/${
                      intl?.locale == "eng"
                        ? PopData?.product?.seo_en
                        : PopData?.product?.seo_ja
                    }`}
                    className="btn hover-up"
                  >
                    {intl.formatMessage({ id: "Shop Now" })}{" "}
                    <i className="fi-rs-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={
          openClass ? "modal-backdrop fade d-none" : "modal-backdrop fade show"
        }
      ></div>
    </>
  );
};

export default IntroPopup;
