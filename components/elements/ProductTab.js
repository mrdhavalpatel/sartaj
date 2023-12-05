import React, { useEffect, useState } from "react";
import { API_BASE_URL, api } from "../../lib/api";
import moment from "moment/moment";
import StarRating from "./StarRating";
import axios from "axios";
import { toast } from "react-toastify";

const ProductTab = ({ description, review, id, total_reviews }) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [productRating, setProductRating] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleOnClick = (index) => {
    setActiveIndex(index);
  };
  const handleReviewSubmit = async () => {
    let token = localStorage.getItem("token");
    let payload = {
      product_id: id,
      comment: reviewText,
      rating: rating,
    };
    const response = await axios.post(
      `${API_BASE_URL}products/reviews/submit`,
      payload,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response?.status == 200) {
      toast.success("reviews successfully submitted");
      setReviewText("");
      setRating(0);
    }
  };
  const getProductRatingDetails = async (encodedToken) => {
    try {
      const response = await api.get(`customer/reviews/rating/${id}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${encodedToken}`,
        },
      });
      setProductRating(response?.data);
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  console.log("productRating", productRating);
  useEffect(() => {
    let token = localStorage.getItem("token");
    getProductRatingDetails(token);
  }, []);
  return (
    <div className="product-info">
      <div className="tab-style3">
        <ul className="nav nav-tabs text-uppercase">
          <li className="nav-item">
            <a
              className={activeIndex === 1 ? "nav-link active" : "nav-link"}
              id="Description-tab"
              data-bs-toggle="tab"
              onClick={() => handleOnClick(1)}
            >
              Description
            </a>
          </li>
          {/* <li className="nav-item">
                        <a className={activeIndex === 2 ? "nav-link active" : "nav-link"} id="Additional-info-tab" data-bs-toggle="tab" onClick={() => handleOnClick(2)}>
                            Additional info
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className={activeIndex === 3 ? "nav-link active" : "nav-link"} id="Reviews-tab" data-bs-toggle="tab" onClick={() => handleOnClick(3)}>
                            Vendor
                        </a>
                    </li> */}
          <li className="nav-item">
            <a
              className={activeIndex === 4 ? "nav-link active" : "nav-link"}
              id="Reviews-tab"
              data-bs-toggle="tab"
              onClick={() => handleOnClick(4)}
            >
              Reviews {`(${total_reviews ? total_reviews : 0})`}
            </a>
          </li>
        </ul>
        <div className="tab-content shop_info_tab entry-main-content">
          <div
            className={
              activeIndex === 1 ? "tab-pane fade show active" : "tab-pane fade"
            }
            id="Description"
          >
            <div className="">{description}</div>
          </div>

          <div
            className={
              activeIndex === 4 ? "tab-pane fade show active" : "tab-pane fade"
            }
            id="Reviews"
          >
            <div className="comments-area">
              <div className="row">
                <div className="col-lg-8">
                  <h4 className="mb-30">Customer questions & answers</h4>
                  <div className="comment-list">
                    {review?.map((ITM) => {
                      return (
                        <div className="single-comment justify-content-between d-flex">
                          <div className="user justify-content-between d-flex">
                            <div className="thumb text-center">
                              <img src={ITM?.Img} alt="nest" />
                              <h6>
                                <a>{ITM?.customer?.f_name}</a>
                              </h6>
                              {/* <p className="font-xxs">Since 2012</p> */}
                            </div>
                            <div className="desc">
                              <div className="product-rate d-inline-block">
                                <div
                                  className="product-rating"
                                  style={{
                                    width: `${(ITM?.rating / 5) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <p>{ITM?.comment}</p>
                              <div className="d-flex justify-content-between">
                                <div className="d-flex align-items-center">
                                  <p className="font-xs mr-30">
                                    {ITM?.created_at
                                      ? moment(ITM?.created_at).format(
                                          "MMMM D YYYY HH:mm a"
                                        )
                                      : null}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="col-lg-4">
                  <h4 className="mb-30">Customer reviews</h4>
                  <div className="d-flex mb-30">
                    <div className="product-rate d-inline-block mr-15">
                      <div
                        className="product-rating"
                        style={{
                          width: `${
                            productRating?.overall_rating
                              ? productRating?.overall_rating
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <h6>{productRating?.overall_rating} of 5</h6>
                  </div>
                  <div className="progress">
                    <span>5 star</span>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${
                          productRating.ratings_details?.["5"]
                            ? productRating.ratings_details?.["5"]
                            : 0
                        }%`,
                      }}
                      aria-valuenow={productRating.ratings_details?.["5"]}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {(productRating.ratings_details?.["5"]
                        ? productRating.ratings_details?.["5"]
                        : 0) + "%"}
                    </div>
                  </div>
                  <div className="progress">
                    <span>4 star</span>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${
                          productRating?.ratings_details?.["4"]
                            ? productRating?.ratings_details?.["4"]
                            : 0
                        }%`,
                      }}
                      aria-valuenow={productRating?.ratings_details?.["4"]}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {(productRating?.ratings_details?.["4"]
                        ? productRating?.ratings_details?.["4"]
                        : 0) + "%"}
                    </div>
                  </div>
                  <div className="progress">
                    <span>3 star</span>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${
                          productRating?.ratings_details?.["3"]
                            ? productRating?.ratings_details?.["3"]
                            : 0
                        }%`,
                      }}
                      aria-valuenow={productRating?.ratings_details?.["3"]}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {(productRating?.ratings_details?.["3"]
                        ? productRating?.ratings_details?.["3"]
                        : 0) + "%"}
                    </div>
                  </div>
                  <div className="progress">
                    <span>2 star</span>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${
                          productRating?.ratings_details?.["2"]
                            ? productRating?.ratings_details?.["2"]
                            : 0
                        }%`,
                      }}
                      aria-valuenow={productRating?.ratings_details?.["2"]}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {(productRating?.ratings_details?.["2"]
                        ? productRating?.ratings_details?.["2"]
                        : 0) + "%"}
                    </div>
                  </div>
                  <div className="progress mb-30">
                    <span>1 star</span>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${
                          productRating?.ratings_details?.["1"]
                            ? productRating?.ratings_details?.["1"]
                            : 0
                        }%`,
                      }}
                      aria-valuenow={productRating?.ratings_details?.["1"]}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {(productRating?.ratings_details?.["1"]
                        ? productRating?.ratings_details?.["2"]
                        : 0) + "%"}
                    </div>
                  </div>
                  {/* <a href="#" className="font-xs text-muted">
                    How are ratings calculated?
                  </a> */}
                </div>
              </div>
            </div>

            <div className="comment-form">
              <h4 className="mb-15">Add a review</h4>
              <div className="mb-3">
                <StarRating
                  initialRating={rating}
                  onRatingChange={handleRatingChange}
                />
              </div>

              <div className="row">
                <div className="col-lg-8 col-md-12">
                  <form
                    className="form-contact comment_form"
                    action="#"
                    id="commentForm"
                  >
                    <div className="row">
                      <div className="col-12">
                        <div className="form-group">
                          <textarea
                            className="form-control w-100"
                            name="comment"
                            id="comment"
                            cols="30"
                            rows="9"
                            value={reviewText}
                            onChange={(e) => {
                              setReviewText(e?.target?.value);
                            }}
                            placeholder="Write Comment"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <button
                        className="button button-contactForm"
                        onClick={(e) => {
                          e.preventDefault();
                          handleReviewSubmit();
                        }}
                      >
                        Submit Review
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTab;
