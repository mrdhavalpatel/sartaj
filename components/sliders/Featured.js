import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import SingleProduct from "./../ecommerce/SingleProduct";
import { connect } from "react-redux";
import { fetchProduct } from "../../redux/action/product";

SwiperCore.use([Navigation]);

const FeaturedSlider = ({ products , cartItems }) => {
  return (
    <>
      <Swiper
        spaceBetween={24}
        grid={{
          rows: 2,
        }}
        navigation={{
          prevEl: ".custom_prev_f",
          nextEl: ".custom_next_f",
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
            slidesPerView: 4,
          },
        }}
      >
        {products?.map((product, i) => (
          <SwiperSlide key={i}>
            <SingleProduct product={product} cartItems={cartItems} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="slider-arrow slider-arrow-2 carausel-4-columns-arrow">
        <span className="slider-btn slider-prev slick-arrow custom_prev_f">
          <i className="fi-rs-arrow-small-left"></i>
        </span>
        <span className="slider-btn slider-next slick-arrow custom_next_f">
          <i className="fi-rs-arrow-small-right"></i>
        </span>
      </div>
    </>
  );
};
const mapStateToProps = (state) => ({
  productFilters: state.productFilters,
  cartItems: state.cart,
});
const mapDidpatchToProps = {
  // openCart,
  fetchProduct,
  // fetchMoreProduct,
};
export default connect(mapStateToProps, mapDidpatchToProps)(FeaturedSlider);
// export default FeaturedSlider;
