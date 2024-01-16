import React, { useEffect, useState } from "react";
import { API_BASE_URL, api } from "../../lib/api";
import moment from "moment/moment";
import StarRating from "./StarRating";
import axios from "axios";
import { toast } from "react-toastify";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { auth } from "../../lib/auth/auth";
import {  useIntl } from "react-intl";
const ProductTab = ({ description, review, id, total_reviews}) => {
  const intl = useIntl();
  const [activeIndex, setActiveIndex] = useState(1);
  const [isLoggedIn, setIsloggedIn] = useState(false);
  const [productRating, setProductRating] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };
  const validationSchema = Yup.object().shape({
    usernameOrEmail: Yup.string().required("Username or Email is required"),
    currentpassword: Yup.string().required("Password is required"),
  });
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
  const handleSubmit = (values) => {
    const payload = {
      email_or_phone: values?.usernameOrEmail,
      password: values?.currentpassword,
    };
    auth("post", "auth/login", payload).then((res) => {
      if (res?.response?.data?.errors) {
        toast.error(res?.response?.data?.errors?.[0]?.message);
      } else {
        localStorage.setItem("token", res.token);
        setIsloggedIn(true);
        // router.push("/");
      }
    });
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
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      setIsloggedIn(true);
      getProductRatingDetails(token);
    }
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
              {intl.formatMessage({ id: 'Description' })}
            </a>
          </li>

          <li className="nav-item">
            <a
              className={activeIndex === 4 ? "nav-link active" : "nav-link"}
              id="Reviews-tab"
              data-bs-toggle="tab"
              onClick={() => handleOnClick(4)}
            >
              {intl.formatMessage({ id: 'Reviews' })} {`(${total_reviews ? total_reviews : 0})`}
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
                  <h4 className="mb-30">{intl.formatMessage({ id: 'Customer questions & answers' })}</h4>
                  <div className="comment-list">
                    {review?.map((ITM) => {
                      return (
                        <div className="single-comment justify-content-between d-flex">
                          <div className="user justify-content-between d-flex">
                            <div className="thumb text-center">
                              <img
                                src={
                                  "https://cdn.pixabay.com/photo/2017/02/23/13/05/avatar-2092113_1280.png"
                                }
                                alt="nest"
                              />
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
                  <h4 className="mb-30">{intl.formatMessage({ id: 'Customer reviews' })}</h4>
                  <div className="d-flex mb-30">
                    <div className="product-rate d-inline-block mr-15">
                      <div
                        className="product-rating"
                        style={{
                          width: `${
                            productRating?.overall_rating
                              ? (productRating?.overall_rating * 100) / 5
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
                        ? productRating?.ratings_details?.["1"]
                        : 0) + "%"}
                    </div>
                  </div>
                  {/* <a href="#" className="font-xs text-muted">
                    How are ratings calculated?
                  </a> */}
                </div>
              </div>
            </div>

            {isLoggedIn ? (
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
            ) : (
              <div className="row">
                <div className="col-xl-8 col-lg-10 col-md-12 m-auto">
                  <div className="row">
                    {/* <div className="col-lg-6 pr-30 d-none d-lg-block">
                      <img
                        className="border-radius-15"
                        src="assets/imgs/page/login-1.png"
                        alt="nest"
                      />
                    </div> */}
                    <div className="col-lg-6 col-md-8">
                      <div className="login_wrap widget-taber-content background-white">
                        <div className="padding_eight_all bg-white">
                          <div className="heading_s1">
                            <h3 className="mb-5">
                              To add a review login first{" "}
                            </h3>
                            <p className="mb-30">
                              Don't have an account?{" "}
                              <Link href="/page-register">Create here</Link>
                            </p>
                          </div>
                          <Formik
                            initialValues={{
                              usernameOrEmail: "",
                              currentpassword: "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                              // Prevent default form submission behavior
                              setSubmitting(false);

                              // Your custom submission logic goes here
                              await handleSubmit(values);

                              // Optionally reset the form
                              // resetForm();
                            }}
                          >
                            {({ isSubmitting, handleSubmit }) => (
                              <Form onSubmit={handleSubmit}>
                                <div className="form-group">
                                  <Field
                                    type="text"
                                    name="usernameOrEmail"
                                    placeholder="Username or Email *"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name="usernameOrEmail"
                                    component="div"
                                    style={{ color: "red" }}
                                  />
                                </div>
                                <div className="form-group">
                                  <Field
                                    type="password"
                                    name="currentpassword"
                                    placeholder="Your password *"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name="currentpassword"
                                    component="div"
                                    style={{ color: "red" }}
                                  />
                                </div>

                                <div className="form-group">
                                  <button
                                    type="submit"
                                    className="btn btn-heading btn-block hover-up"
                                    name="login"
                                    disabled={isSubmitting} // Disable the button while submitting
                                  >
                                    Log in
                                  </button>
                                </div>
                              </Form>
                            )}
                          </Formik>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTab;
