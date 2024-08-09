import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { ApiCall } from "../lib/other/other";
import { useIntl } from "react-intl";
import SwiperCore, { Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
SwiperCore.use([Navigation, Autoplay]);
function About() {
  const intl = useIntl();
  const [aboutData, setAboutData] = useState([]);

  const getAboutUsData = async () => {
    const request = await ApiCall("get", intl, "config");
    const aboutUsData = await request;
    if (intl.locale === "eng") {
      setAboutData(aboutUsData?.data?.about_us);
    } else {
      setAboutData(aboutUsData?.data?.japanese_about_us);
    }
  };
  useEffect(() => {
    getAboutUsData();
  }, []);
  return (
    <>
      <Layout parent="Home" sub="Pages" subChild="About">
        <div className="container  pt-50">
          <div className="row">
            <div className="col-xl-10 col-lg-12 m-auto">
              <section className="row align-items-center mb-50 about_page">
                {/* <div className="col-lg-6">
                  <img
                    src="/assets/imgs/page/about.jpg"
                    alt="nest"
                    className="border-radius-15 mb-md-3 mb-lg-0 mb-sm-4"
                  />
                </div>
                <div className="col-lg-6">
                  <div className="pl-25">
                    <h2 className="mb-30">Welcome to Sartaj Co Ltd</h2>
                    <p className="mb-25">
                      Namaste, Sartaj offers you a wide variety of Indian
                      grocery foods with the best quality and outstanding
                      service. We have been serving to Hotel, restaurants, halal
                      food, Japanese curry shop, café and many other food
                      industries for the last 14 years. our goal is only one, to
                      provide an authentic taste of Indian spices and food and
                      full fill customer satisfaction as customer satisfaction
                      is our great achievement.
                    </p>
                    <p className="mb-50">
                      We believe in enhancing the Indian food culture in Japan
                      with Japanese standard quality and great service and
                      increase our relationship with customers.
                    </p>
                  </div>
                </div> */}
                {/* <div dangerouslySetInnerHTML={{ __html: aboutData }}></div> */}
                <div class="row">
                  <div class="col-md-6">
                    <img
                      alt=""
                      src="/assets/imgs/page/about.jpg"
                      class="img-fluid"
                    />
                  </div>
                  <div class="col-md-6">
                    <div class="about_text">
                      <h2>Welcome to Sartaj Co Ltd</h2>
                      <p>
                        At Sartaj Foods, we are passionate about bringing the
                        authentic flavors of India to Japan. Our journey began
                        with a simple vision: to share the rich culinary
                        heritage of India with food enthusiasts across Japan.
                        With a commitment to quality, authenticity, and customer
                        satisfaction, we have become a trusted name in the Food
                        Industry.
                      </p>
                      <h4>Our Story:</h4>
                      <p>
                        Since 2006, we have been importing Indian spices and
                        grocery products into Japan. Over the years, we have
                        built an extensive collection of spices and groceries to
                        meet the diverse needs of our customers.
                      </p>
                      <p>
                        We are now thrilled to announce our expansion into new
                        areas such as cosmetics, beverages, and instant meals.
                        At Sartaj Foods, we are committed to offering
                        high-quality products across various categories to
                        satisfy the evolving preferences of our valued clients.
                      </p>
                      <p>
                        From our modest beginnings, Sartaj Foods has been a
                        pioneer in sourcing and supplying premium Indian food
                        products to the Japanese market. What started as a small
                        venture has grown into a well-known provider of spices,
                        lentils, rice, snacks, and ready-to-eat meals.
                      </p>

                      <p>
                        As we enter this new phase of growth and
                        diversification, we remain dedicated to maintaining the
                        same high standards of excellence and customer
                        satisfaction that have defined us from the start.
                      </p>
                      <div className="card-product-small arrow-center position-relative about_slider">
                        <Swiper
                          spaceBetween={20}
                          loop={true}
                          slidesPerView={3}
                          autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                          }}
                          breakpoints={{
                            0: { slidesPerView: 1 },
                            639: { slidesPerView: 1 },
                            1024: { slidesPerView: 3 },
                          }}
                          navigation={{
                            prevEl: ".custom_prev_f",
                            nextEl: ".custom_next_f",
                          }}
                          className="custom-class"
                        >
                          <SwiperSlide>
                            <div>
                              <img
                                alt=""
                                src="/assets/imgs/page/about1.jpg"
                                class="img-fluid"
                              />
                            </div>
                          </SwiperSlide>
                          <SwiperSlide>
                            <div>
                              <img
                                alt=""
                                src="/assets/imgs/page/about2.jpg"
                                class="img-fluid"
                              />
                            </div>
                          </SwiperSlide>
                          <SwiperSlide>
                            <div>
                              <img
                                alt=""
                                src="/assets/imgs/page/about3.jpg"
                                class="img-fluid"
                              />
                            </div>
                          </SwiperSlide>
                          <SwiperSlide>
                            <div>
                              <img
                                alt=""
                                src="/assets/imgs/page/about4.jpg"
                                class="img-fluid"
                              />
                            </div>
                          </SwiperSlide>
                          <SwiperSlide>
                            <div>
                              <img
                                alt=""
                                src="/assets/imgs/page/about5.jpg"
                                class="img-fluid"
                              />
                            </div>
                          </SwiperSlide>
                        </Swiper>
                        <div className="slider-arrow slider-arrow-2">
                          <span className="slider-btn slider-prev slick-arrow custom_prev_f">
                            <i className="fi-rs-arrow-small-left"></i>
                          </span>
                          <span className="slider-btn slider-next slick-arrow custom_next_f">
                            <i className="fi-rs-arrow-small-right"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="about_text">
                      <h4>Our Mission:</h4>
                      <p>
                        Our mission is to deliver high-quality products and
                        authentic flavors to our customers. We are committed to
                        adhering to industry standards by providing sustainable
                        and safe food options.
                      </p>
                      <p>
                        At Sartaj Foods, we are devoted to offering premium
                        Indian food products that delight the senses and inspire
                        culinary adventure. We ensure the highest levels of
                        quality and authenticity in every product, allowing our
                        customers to savor the true essence of Indian cuisine
                        with every bite.
                      </p>
                      <p>
                        We focus on providing competitive prices, superior
                        ingredients, and exceptional service every day. Our goal
                        is to offer a wide selection of grocery items and
                        everyday products, delivering them straight to our
                        customers' doorsteps with ease.
                      </p>
                      <p>
                        Our aim is to become a leading importer and distributor
                        of Indian spices, cosmetics, and other grocery items.
                        Customer satisfaction is our top priority, and we
                        consistently work to exceed expectations.
                      </p>
                      <h4>Our Products:</h4>
                      <p>
                        From aromatic spices and nutritious lentils to fragrant
                        rice and crispy snacks, our diverse product range
                        showcases the rich variety of Indian cuisine. Whether
                        you're preparing a traditional Indian meal or
                        experimenting with new flavors in your kitchen, Sartaj
                        Foods provides everything you need to enhance your
                        culinary creations.
                      </p>
                      <h4>Why Choose Us?</h4>
                      <p>
                        <b>Quality Assurance:</b> We obtain our products from
                        reliable suppliers and implement rigorous quality
                        control procedures to guarantee that only the best
                        ingredients are delivered to your kitchen.
                      </p>
                      <p>
                        <b>Authenticity:</b> Our products are made using
                        traditional Indian recipes and methods, preserving the
                        true flavors and aromas of Indian cuisine.
                      </p>
                      <p>
                        <b>Customer Satisfaction:</b> We are dedicated to
                        offering outstanding customer service and ensuring that
                        each customer enjoys a positive experience with Sartaj
                        Foods.
                      </p>

                      <h4>Connect with Us:</h4>
                      <p>
                        We value hearing from our customers! If you have any
                        questions about our products or want to share feedback
                        about your shopping experience, our friendly team is
                        ready to help. Please don't hesitate to contact us by
                        phone at 072-751-1975 or by email at
                        sartajjapan6@gmail.com.
                      </p>
                      <p>
                        Thank you for choosing Sartaj Foods as your trusted
                        source for Indian food. We look forward to serving you!
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section className="text-center mb-50">
                <h2 className="title style-3 mb-40">
                  {intl.formatMessage({ id: "What We Provide?" })}
                </h2>
                <div className="row">
                  <div className="col-lg-4 col-md-6 mb-24">
                    <div className="featured-card">
                      <img
                        src="/assets/imgs/theme/icons/icon-1.svg"
                        alt="nest"
                      />
                      <h4>
                        {intl.formatMessage({ id: "Best Prices & Offers" })}
                      </h4>
                      <p>
                        {intl.formatMessage({
                          id: "At Sartaj Foods, we work hard to give our valued customers the greatest deals and discounts. Providing low rates is our commitment to ensuring that every purchase you make gets you exceptional value for your money. We also regularly update our special offers  to provide you fantastic bargains and savings on a variety of goods. ",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 mb-24">
                    <div className="featured-card">
                      <img
                        src="/assets/imgs/theme/icons/icon-2.svg"
                        alt="nest"
                      />
                      <h4>{intl.formatMessage({ id: "Wide Assortment" })}</h4>
                      <p>
                        {intl.formatMessage({
                          id: "At Sartaj Foods, we take pride in offering a wide assortment of products to cater to the diverse needs and preferences of our customers. Our extensive range includes a variety of spices, lentils, rice, snacks, ready-to-eat meals, and cosmetics sourced from trusted suppliers to ensure high quality and authenticity.",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 mb-24">
                    <div className="featured-card">
                      <img
                        src="/assets/imgs/theme/icons/icon-3.svg"
                        alt="nest"
                      />
                      <h4>{intl.formatMessage({ id: "Free Delivery" })}</h4>
                      <p>
                        {intl.formatMessage({
                          id: "We're delighted to offer free delivery services for orders worth  ¥6500/- (exclusive of tax) or more, excluding areas in Kyushu, Hokkaido, and Okinawa.",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 mb-24">
                    <div className="featured-card">
                      <img
                        src="/assets/imgs/theme/icons/icon-4.svg"
                        alt="nest"
                      />
                      <h4>{intl.formatMessage({ id: "Best Quality" })}</h4>
                      <p>
                        {intl.formatMessage({
                          id: "We are committed to providing our customers with the best quality and taste in every product we offer. Our dedication to excellence starts with sourcing the finest ingredients directly from trusted suppliers, ensuring that only the highest quality materials are used in our products. From aromatic spices to flavorful sauces, each item is carefully selected and rigorously inspected to meet our stringent quality standards.",
                        })}
                      </p>
                    </div>
                  </div>
                  {/* <div className="col-lg-4 col-md-6 mb-24">
                    <div className="featured-card">
                      <img
                        src="/assets/imgs/theme/icons/icon-5.svg"
                        alt="nest"
                      />
                      <h4>{intl.formatMessage({ id: "100% Satisfaction" })}</h4>
                      <p>
                        {intl.formatMessage({
                          id: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form",
                        })}
                      </p>
                    </div>
                  </div> */}
                  <div className="col-lg-4 col-md-6 mb-24">
                    <div className="featured-card">
                      <img
                        src="/assets/imgs/theme/icons/icon-6.svg"
                        alt="nest"
                      />
                      <h4>{intl.formatMessage({ id: "Great Weekly Deal" })}</h4>
                      <p>
                        {intl.formatMessage({
                          id: "We offer exclusive discounts and special offers on a variety of products every week. Customers can discover new deals on a range of items, including cosmetics, rice, and other products.",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default About;
