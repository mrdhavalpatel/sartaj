import React, { useEffect, useState } from "react";
import { server } from "../../config/index";
import Deals1 from "../elements/Deals1";
import { ApiCall } from "../../lib/other/other";
import { useIntl } from "react-intl";
import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { connect } from "react-redux";
import { fetchProduct } from "../../redux/action/product";


function FeatchDeals({ products , cartItems }) {
  const [deals, setDeals] = useState([]);
  const intl = useIntl();
  const dealsProduct = async () => {
    const request = await ApiCall("get", intl, "products/sale-products");
    const allProducts = await request;
    // Discount
    setDeals(allProducts?.data?.products);
  };

  useEffect(() => {
    dealsProduct();
  }, []);

  return (
    <>
      <Swiper
        spaceBetween={24}
        grid={{
          rows: 2,
        }}
        navigation={{
          prevEl: ".custom_prev_d",
          nextEl: ".custom_next_d",
        }}
        className="custom-class"
        breakpoints={{
          0: {
            slidesPerView: 2,
            spaceBetween: 0,
          },
          480: {
            slidesPerView: 2,
          },
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
      >
        {deals?.slice(0, 4).map((product, i) => (
          <SwiperSlide key={i}>
            <Deals1 product={product} cartItems={cartItems} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className="slider-arrow slider-arrow-2 flex-right carausel-10-columns-arrow"
        id="carausel-10-columns-arrows"
      >
        <span className="slider-btn slider-prev slick-arrow custom_prev_d">
          <i className="fi-rs-arrow-small-left"></i>
        </span>
        <span className="slider-btn slider-next slick-arrow custom_next_d">
          <i className="fi-rs-arrow-small-right"></i>
        </span>
      </div>
    </>
  );
}
const mapStateToProps = (state) => ({
  products: state.products,
  productFilters: state.productFilters,
  cartItems: state.cart,
});
const mapDidpatchToProps = {
  // openCart,
  fetchProduct,
  // fetchMoreProduct,
};
export default connect(mapStateToProps, mapDidpatchToProps)(FeatchDeals);
// export default FeatchDeals;
