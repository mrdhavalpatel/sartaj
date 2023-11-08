import React from "react";
import Link from "next/link";

const Footer = () => {
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
                      Stay home & get your daily
                      <br />
                      needs from our shop
                    </h2>
                    <p className="mb-45">
                      Start You'r Daily Shopping with{" "}
                      <span className="text-brand">Sartaj</span>
                    </p>
                    <form className="form-subcriber d-flex">
                      <input type="email" placeholder="Your emaill address" />
                      <button className="btn" type="submit">
                        Subscribe
                      </button>
                    </form>
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
              <div className="col-lg-1-5 col-md-4 col-12 col-sm-6 mb-md-4 mb-xl-0">
                <div
                  className="banner-left-icon d-flex align-items-center  wow animate__animated animate__fadeInUp"
                  data-wow-delay="0"
                >
                  <div className="banner-icon">
                    <img src="/assets/imgs/theme/icons/icon-1.svg" alt="nest" />
                  </div>
                  <div className="banner-text">
                    <h3 className="icon-box-title">Best prices & offers</h3>
                    <p>Orders $50 or more</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-1-5 col-md-4 col-12 col-sm-6">
                <div
                  className="banner-left-icon d-flex align-items-center  wow animate__animated animate__fadeInUp"
                  data-wow-delay=".1s"
                >
                  <div className="banner-icon">
                    <img src="/assets/imgs/theme/icons/icon-2.svg" alt="nest" />
                  </div>
                  <div className="banner-text">
                    <h3 className="icon-box-title">Free delivery</h3>
                    <p>24/7 amazing services</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-1-5 col-md-4 col-12 col-sm-6">
                <div
                  className="banner-left-icon d-flex align-items-center  wow animate__animated animate__fadeInUp"
                  data-wow-delay=".2s"
                >
                  <div className="banner-icon">
                    <img src="/assets/imgs/theme/icons/icon-3.svg" alt="nest" />
                  </div>
                  <div className="banner-text">
                    <h3 className="icon-box-title">Great daily deal</h3>
                    <p>When you sign up</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-1-5 col-md-4 col-12 col-sm-6">
                <div
                  className="banner-left-icon d-flex align-items-center  wow animate__animated animate__fadeInUp"
                  data-wow-delay=".3s"
                >
                  <div className="banner-icon">
                    <img src="/assets/imgs/theme/icons/icon-4.svg" alt="nest" />
                  </div>
                  <div className="banner-text">
                    <h3 className="icon-box-title">Wide assortment</h3>
                    <p>Mega Discounts</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-1-5 col-md-4 col-12 col-sm-6">
                <div
                  className="banner-left-icon d-flex align-items-center  wow animate__animated animate__fadeInUp"
                  data-wow-delay=".4s"
                >
                  <div className="banner-icon">
                    <img src="/assets/imgs/theme/icons/icon-5.svg" alt="nest" />
                  </div>
                  <div className="banner-text">
                    <h3 className="icon-box-title">Easy returns</h3>
                    <p>Within 30 days</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-1-5 col-md-4 col-12 col-sm-6 d-xl-none">
                <div
                  className="banner-left-icon d-flex align-items-center  wow animate__animated animate__fadeInUp"
                  data-wow-delay=".5s"
                >
                  <div className="banner-icon">
                    <img src="/assets/imgs/theme/icons/icon-6.svg" alt="nest" />
                  </div>
                  <div className="banner-text">
                    <h3 className="icon-box-title">Safe delivery</h3>
                    <p>Within 30 days</p>
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
                      <img src="/assets/imgs/theme/logo.svg" alt="logo" />
                    </Link>
                    <p className="font-lg text-heading">
                      Sartaj offer you a wide variety of Indian grocery foods
                      with best quality and outstanding service.
                    </p>
                  </div>
                  <ul className="contact-infor">
                    <li>
                      <img
                        src="/assets/imgs/theme/icons/icon-location.svg"
                        alt="nest"
                      />
                      <strong>Address: </strong>{" "}
                      <span>osaka-fu, ikeda-shi, koda 2-10-23</span>
                    </li>
                    <li>
                      <img
                        src="/assets/imgs/theme/icons/icon-contact.svg"
                        alt="nest"
                      />
                      <strong>Call Us:</strong>
                      <span> 072-751-1975</span>
                    </li>
                    <li>
                      <img
                        src="/assets/imgs/theme/icons/icon-email-2.svg"
                        alt="nest"
                      />
                      <strong>Email:</strong>
                      <span> info@sartajfoods.jp</span>
                    </li>
                    <li>
                      <img
                        src="/assets/imgs/theme/icons/icon-clock.svg"
                        alt="nest"
                      />
                      <strong>Hours:</strong>
                      <span>
                        Monday to Saturday from 09:00AM-18:00PM (except national
                        holiday)
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className="footer-link-widget col  wow animate__animated animate__fadeInUp"
                data-wow-delay=".1s"
              >
                <h4 className="widget-title">Company</h4>
                <ul className="footer-list  mb-sm-5 mb-md-0">
                  <li>
                    <a href="#">About Us</a>
                  </li>
                  <li>
                    <a href="#">Delivery Information</a>
                  </li>
                  <li>
                    <a href="/page-privacy-policy">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="/page-terms">Terms &amp; Conditions</a>
                  </li>
                  <li>
                    <a href="#">Contact Us</a>
                  </li>
                  <li>
                    <a href="#">Support Center</a>
                  </li>
                  <li>
                    <a href="#">Careers</a>
                  </li>
                </ul>
              </div>
              <div
                className="footer-link-widget col  wow animate__animated animate__fadeInUp"
                data-wow-delay=".2s"
              >
                <h4 className="widget-title ">Account</h4>
                <ul className="footer-list  mb-sm-5 mb-md-0">
                  <li>
                    <a href="#">Sign In</a>
                  </li>
                  <li>
                    <a href="#">View Cart</a>
                  </li>
                  <li>
                    <a href="#">My Wishlist</a>
                  </li>
                  <li>
                    <a href="#">Track My Order</a>
                  </li>
                  <li>
                    <a href="#">Help Ticket</a>
                  </li>
                  <li>
                    <a href="#">Shipping Details</a>
                  </li>
                  <li>
                    <a href="/shop-compare">Compare products</a>
                  </li>
                </ul>
              </div>
              <div
                className="footer-link-widget widget-install-app col  wow animate__animated animate__fadeInUp"
                data-wow-delay=".5s"
              >
                <h4 className="widget-title ">Install App</h4>
                <p className="">From App Store or Google Play</p>
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
                <p className="mb-20 ">Secured Payment Gateways</p>
                <img
                  className=""
                  src="/assets/imgs/theme/payment-method.png"
                  alt="nest"
                />
              </div>
            </div>
          </div>
        </section>
        <div
          className="container pb-30  wow animate__animated animate__fadeInUp"
          data-wow-delay="0"
        >
          <div className="row align-items-center">
            <div className="col-12 mb-30">
              <div className="footer-bottom"></div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6">
              <p className="font-sm mb-0">
                Copyright &copy; 2024 , by Sartaj Foods All Rights Reserved.
              </p>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 text-end d-none d-md-block">
              <div className="mobile-social-icon">
                <h6>Follow Us</h6>
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
    </>
  );
};

export default Footer;
