import { useEffect, useState } from "react";
import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { fetchByCatagory } from "../../redux/action/product";
import SingleProduct from "./../ecommerce/SingleProduct";
import { ApiCall } from "../../lib/other/other";
import { useIntl } from "react-intl";

SwiperCore.use([Navigation]);

const RelatedSlider = ({ id }) => {
  const [related, setRelated] = useState([]);
  const intl = useIntl();
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const request = await ApiCall(
      "get",
      intl,
      `${"products/related-products"}/${id}`
    );
    const allProducts = await request?.data;
    setRelated(allProducts);
  };

  return (
    <>
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        navigation={{
          prevEl: ".custom_prev_n",
          nextEl: ".custom_next_n",
        }}
        className="custom-class"
      >
        {related?.length > 0 ? (
          related.map((product, i) => (
            <SwiperSlide key={i}>
              <SingleProduct product={product} />
            </SwiperSlide>
          ))
        ) : (
          <span> No Product Found</span>
        )}
      </Swiper>

      <div className="slider-arrow slider-arrow-2 carausel-6-columns-arrow">
        <span className="slider-btn slider-prev slick-arrow custom_prev_n">
          <i className="fi-rs-angle-left"></i>
        </span>
        <span className="slider-btn slider-next slick-arrow custom_next_n">
          <i className="fi-rs-angle-right"></i>
        </span>
      </div>
    </>
  );
};

export default RelatedSlider;
