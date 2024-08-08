import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ApiCall } from "../../lib/other/other";
import { Formik, Field, Form } from "formik";
import { toast } from "sonner";
import { useIntl } from "react-intl";
import { useAuth } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/action/cart";

const Footer = () => {
  const [isLoggin, setIsLoggin] = useState(false);
  const { logout } = useAuth();
  const dispatch = useDispatch();
  // const checkoutUrl = intl.locale === "eng" ? "/shop-checkout" : "/jp/shop-checkout";

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      setIsLoggin(true);
    } else {
      setIsLoggin(false);
    }
  }, []);
  const [footerData, setFooterData] = useState([]);
  const intl = useIntl();
  const initialValues = {
    email: "",
  };
  const fetchFooterData = async () => {
    const request = await ApiCall("get", intl, "config");
    const newArrivals = await request?.data;
    setFooterData(newArrivals);
  };
  useEffect(() => {
    fetchFooterData();
  }, []);
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let payload = values;
      const response = await ApiCall(
        "post",
        intl,
        "subscribe-newsletter",
        payload
      );

      if (response?.status === 200) {
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.response?.data?.message);
      }
      resetForm();
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }

    setSubmitting(false);
  };

  useEffect(() => {
    // Add Tawk.to script when component mounts
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
      (function(){
      var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
      s1.async=true;
      s1.src='https://embed.tawk.to/5dccff93d96992700fc75e90/default';
      s1.charset='UTF-8';
      s1.setAttribute('crossorigin','*');
      s0.parentNode.insertBefore(s1,s0);
      })();
    `;
    document.body.appendChild(script);

    // Clean up function to remove the script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <footer className="main">
        <section className="newsletter mb-15  wow animate__animated animate__fadeIn">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="position-relative newsletter-inner">
                  <div className="newsletter-content">
                    <h2 className="mb-20">
                      {intl.formatMessage({ id: "ONLINE GROCERY" })}
                      <br />
                      {intl.formatMessage({ id: "SHOPPING" })}
                      <br />
                      {intl.formatMessage({ id: "MADE EASY" })}
                    </h2>
                    <p className="mb-45">
                      {intl.formatMessage({
                        id: "Start Your Daily Shopping with",
                      })}{" "}
                      <span className="text-brand">
                        {intl.formatMessage({ id: "Sartaj" })}
                      </span>
                    </p>
                    {/* <form className="form-subcriber d-flex">
                      <input type="email" placeholder="Your emaill address" />
                      <button className="btn" type="submit">
                        Subscribe
                      </button>
                    </form> */}
                    <Formik
                      initialValues={initialValues}
                      onSubmit={(values, { setSubmitting, resetForm }) => {
                        handleSubmit(values, { setSubmitting, resetForm });
                      }}
                    >
                      <Form className="form-subscriber d-flex">
                        <Field
                          required
                          type="email"
                          name="email"
                          placeholder={intl.formatMessage({
                            id: "Your email address",
                          })}
                          className="form-control"
                        />

                        <button className="btn" type="submit">
                          {intl.formatMessage({ id: "Subscribe" })}
                        </button>
                      </Form>
                    </Formik>
                  </div>
                  <img
                    src="/assets/imgs/banner/banner-9.png"
                    alt="newsletter"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="featured  section-padding">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-3 col-12 col-sm-6 mb-md-4 mb-xl-0">
                <div
                  className="banner-left-icon d-flex align-items-center  wow animate__animated animate__fadeInUp"
                  data-wow-delay="0"
                >
                  <div className="banner-icon">
                    <img src="/assets/imgs/theme/icons/icon-1.svg" alt="nest" />
                  </div>
                  <div className="banner-text">
                    <h3 className="icon-box-title">
                      {intl.formatMessage({ id: "Best prices & offers" })}
                    </h3>
                    <p>{intl.formatMessage({ id: "Every week" })}</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-12 col-sm-6">
                <div
                  className="banner-left-icon d-flex align-items-center  wow animate__animated animate__fadeInUp"
                  data-wow-delay=".1s"
                >
                  <div className="banner-icon">
                    <img src="/assets/imgs/theme/icons/icon-2.svg" alt="nest" />
                  </div>
                  <div className="banner-text">
                    <h3 className="icon-box-title">
                      {intl.formatMessage({ id: "Free delivery" })}
                    </h3>
                    <p>{intl.formatMessage({ id: "On bulk quantity" })}</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-12 col-sm-6">
                <div
                  className="banner-left-icon d-flex align-items-center  wow animate__animated animate__fadeInUp"
                  data-wow-delay=".2s"
                >
                  <div className="banner-icon">
                    <img src="/assets/imgs/theme/icons/icon-3.svg" alt="nest" />
                  </div>
                  <div className="banner-text">
                    <h3 className="icon-box-title">
                      {intl.formatMessage({ id: "Great weekly deal" })}
                    </h3>
                    <p>{intl.formatMessage({ id: "When you sign up" })}</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-12 col-sm-6">
                <div
                  className="banner-left-icon d-flex align-items-center  wow animate__animated animate__fadeInUp"
                  data-wow-delay=".5s"
                >
                  <div className="banner-icon">
                    <img src="/assets/imgs/theme/icons/icon-6.svg" alt="nest" />
                  </div>
                  <div className="banner-text">
                    <h3 className="icon-box-title">
                      {intl.formatMessage({ id: "Safe delivery" })}
                    </h3>
                    <p>{intl.formatMessage({ id: "Within 30 days" })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section-padding footer-mid">
          <div className="container pt-15 pb-20">
            <div className="row">
              <div className="col">
                <div
                  className="widget-about font-md mb-md-3 mb-lg-3 mb-xl-0  wow animate__animated animate__fadeInUp"
                  data-wow-delay="0"
                >
                  <div className="logo  mb-30">
                    <Link href="/" className="mb-15">
                      <img src="/assets/imgs/theme/logo.svg" alt="logo" className="footer_logo" />
                    </Link>
                    <p className="font-lg text-heading">
                      {footerData?.business_description}
                    </p>
                  </div>
                  <ul className="contact-infor">
                    <li>
                      <img
                        src="/assets/imgs/theme/icons/icon-location.svg"
                        alt="nest"
                      />
                      <strong>{intl.formatMessage({ id: "Address" })}: </strong>{" "}
                      <span>{footerData?.ecommerce_address}</span>
                    </li>
                    <li>
                      <img
                        src="/assets/imgs/theme/icons/icon-contact.svg"
                        alt="nest"
                      />
                      <strong>{intl.formatMessage({ id: "Call Us" })}:</strong>
                      <span>{footerData?.ecommerce_phone}</span>
                    </li>
                    <li>
                      <img
                        src="/assets/imgs/theme/icons/icon-email-2.svg"
                        alt="nest"
                      />
                      <strong>{intl.formatMessage({ id: "Email" })}:</strong>
                      <span> {footerData?.ecommerce_email}</span>
                    </li>
                    <li>
                      <img
                        src="/assets/imgs/theme/icons/icon-clock.svg"
                        alt="nest"
                      />
                      <strong>{intl.formatMessage({ id: "Hours" })}:</strong>
                      <span>{footerData?.business_hours}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className="footer-link-widget col  wow animate__animated animate__fadeInUp"
                data-wow-delay=".1s"
              >
                <h4 className="widget-title">
                  {intl.formatMessage({ id: "Company" })}
                </h4>
                <ul className="footer-list  mb-sm-5 mb-md-0">
                  <li>
                    <a href="/about-sartaj">
                      {intl.formatMessage({ id: "About Us" })}
                    </a>
                  </li>
                  <li>
                    <a href="/delivery_Information">
                      {intl.formatMessage({ id: "Delivery Information" })}
                    </a>
                  </li>
                  <li>
                    {intl.locale == "eng" ? (
                      <a href="/privacy-policy">
                        {intl.formatMessage({ id: "Privacy Policy" })}
                      </a>
                    ) : (
                      <a href="/jp/privacy-policy">
                        {intl.formatMessage({ id: "Privacy Policy" })}
                      </a>
                    )}
                  </li>
                  <li>
                    <a href="/terms_conditions">
                      {intl.formatMessage({ id: "Terms" })} &amp;{" "}
                      {intl.formatMessage({ id: "Conditions" })}
                    </a>
                  </li>
                  <li>
                    <a href="/contacts">
                      {intl.formatMessage({ id: "Contact Us" })}
                    </a>
                  </li>
                  {/* <li>
                    <a href="#">Support Center</a>
                  </li> 
                  <li>
                    <a href="#">Careers</a>
                  </li> */}
                </ul>
              </div>
              <div
                className="footer-link-widget col  wow animate__animated animate__fadeInUp"
                data-wow-delay=".2s"
              >
                <h4 className="widget-title ">
                  {intl.formatMessage({ id: "Account" })}
                </h4>
                <ul className="footer-list  mb-sm-5 mb-md-0">
                  {isLoggin ? <li>
                    <a href="/my-account">
                      {intl.formatMessage({ id: "My Profile" })}
                    </a>
                  </li> : null}
                  {isLoggin ? (
                    <li>
                      <a
                        href="/sign-in"
                        onClick={() => {
                          localStorage.removeItem("token");
                          logout();
                          dispatch(clearCart());
                        }}
                      >
                        {intl.formatMessage({ id: "Sign Out" })}
                      </a>

                    </li>
                  ) : (
                    <li>
                      <a href="/sign-in">
                        {intl.formatMessage({ id: "Sign In" })}
                      </a>
                    </li>
                  )}
                  {isLoggin ? null : (
                    <li>
                      <a href="/register">
                        {intl.formatMessage({ id: "Create account" })}
                      </a>
                    </li>
                  )}


                  {/* <li>
                    <a href="/sign-in">{intl.formatMessage({ id: "Sign In" })}</a>
                  </li> */}
                  <li>
                    <a href="/shop-cart">
                      {intl.formatMessage({ id: "View Cart" })}
                    </a>
                  </li>
                  <li>
                    <a href={`/${intl.locale}/shop-wishlist`}>
                      {intl.formatMessage({ id: "My Wishlist" })}
                    </a>
                  </li>
                  {/* <li>
                    <a href="#">Track My Order</a>
                  </li>
                  <li>
                    <a href="#">Help Ticket</a>
                  </li> */}
                  <li>
                    <a href="/delivery_Information">
                      {intl.formatMessage({ id: "Shipping Details" })}
                    </a>
                  </li>
                  <li>
                    <a href={`/${intl?.locale}/shop-compare`}>
                      {intl.formatMessage({ id: "Compare products" })}
                    </a>
                  </li>
                </ul>
              </div>
              {/* <div
                className="footer-link-widget widget-install-app col  wow animate__animated animate__fadeInUp"
                data-wow-delay=".5s"
              >
                <h4 className="widget-title ">
                  {intl.formatMessage({ id: "Install App" })}
                </h4>
                <p className="">
                  {intl.formatMessage({ id: "From App Store or Google Play" })}
                </p>
                <div className="download-app ">
                  <a href="#" className="hover-up mb-sm-2 mb-lg-0">
                    <img
                      className="active"
                      src="/assets/imgs/theme/app-store.jpg"
                      alt="nest"
                    />
                  </a>
                  <a href="#" className="hover-up mb-sm-2">
                    <img src="/assets/imgs/theme/google-play.jpg" alt="nest" />
                  </a>
                </div>
                <p className="mb-20 ">
                  {intl.formatMessage({ id: "Secured Payment Gateways" })}
                </p>
                <img
                  className=""
                  src="/assets/imgs/theme/payment-method.png"
                  alt="nest"
                />
              </div> */}
            </div>
          </div>
        </section>
        <div
          className="container pb-30  wow animate__animated animate__fadeInUp"
          data-wow-delay="0"
        >
          <div className="row align-items-center justify-content-center">
            <div className="col-12 mb-30">
              <div className="footer-bottom"></div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 text-end">
              <p className="font-sm mb-0">
                {intl.formatMessage({ id: "Copyright" })} &copy;{" "}
                {intl.formatMessage({
                  id: "2024 , by Sartaj Foods All Rights Reserved.",
                })}
              </p>
            </div>
            <div className="col-xl- col-lg-6 col-md-6 text-end d-none d-md-block ">
              <div className="mobile-social-icon  d-flex justify-content-start ">
                <h6>{intl.formatMessage({ id: "Follow Us" })}</h6>
                <a href="https://www.facebook.com/sartaj.foods" target="_blank">
                  <img
                    src="/assets/imgs/theme/icons/icon-facebook-white.svg"
                    alt="nest"
                  />
                </a>
                <a href="https://twitter.com/FoodsSartaj" target="_blank">
                  <img
                    src="/assets/imgs/theme/icons/icon-twitter-white.svg"
                    alt="nest"
                  />
                </a>
                <a
                  href="https://www.instagram.com/sartaj_foods_official/"
                  target="_blank"
                >
                  <img
                    src="/assets/imgs/theme/icons/icon-instagram-white.svg"
                    alt="nest"
                  />
                </a>
                <a
                  href="https://www.linkedin.com/company/sartaj-foods-japan/"
                  target="_blank"
                >
                  <img
                    src="/assets/imgs/theme/icons/icon-linkedin-white.svg"
                    alt="nest"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="footer_bottom_menu">
        <div className="container">
          <div className="row">
            <div className="col footer_menu">
              <Link href="/" className="active">
                <img src="/assets/imgs/menu/home.png" alt="Home" className="bottom_menu_icon" />
                <span className="footer_menu_text">{intl.formatMessage({ id: "Home" })}</span>
              </Link>
            </div>
            <div className="col footer_menu">
              <Link href={`/${intl.locale}/shop`}>
                <img src="/assets/imgs/menu/shop.png" alt="Shop" className="bottom_menu_icon" />
                <span className="footer_menu_text">{intl.formatMessage({ id: "Shop" })}</span>
              </Link>
            </div>
            <div className="col footer_menu">
              <Link
                href={`/${intl.locale}/shop-cart`}
                className="mini-cart-icon"
              >
                <img src="/assets/imgs/menu/cart.svg" alt="Cart" className="bottom_menu_icon" />
                <span className="footer_menu_text">{intl.formatMessage({ id: "Cart" })}</span>
              </Link>
            </div>
            <div className="col footer_menu">
              <Link href={`/${intl.locale}/shop-wishlist`}>
              <img src="/assets/imgs/menu/wishlist.svg" alt="Wishlist" className="bottom_menu_icon" />
                <span className="footer_menu_text">{intl.formatMessage({ id: "Wishlist" })}</span>
              </Link>
            </div>
            <div className="col footer_menu">
              <Link href="/my-account">
              <img src="/assets/imgs/menu/account.svg" alt="Account" className="bottom_menu_icon" />
                <span className="footer_menu_text">{intl.formatMessage({ id: "Account" })}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Footer;
