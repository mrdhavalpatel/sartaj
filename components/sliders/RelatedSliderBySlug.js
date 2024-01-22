import { useEffect, useState } from "react";
import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import SingleProduct from "./../ecommerce/SingleProduct";
import { useIntl } from "react-intl";
import { api } from "../../lib/api";

SwiperCore.use([Navigation]);

const RelatedSliderBySlug = ({ slug }) => {
  const intl = useIntl();
  const [related, setRelated] = useState([]);
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const request = await api.get(`${"product_seo"}/${slug}`, {
        headers: {
          "X-localization": intl.locale === "eng" ? "en" : "ja",
        },
      });
      const allProducts = await request?.data?.related_products;
      setRelated(allProducts);
    } catch (error) {
      console.log(error);
    }
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
              <SingleProduct product={product?.related_product} />
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

export default RelatedSliderBySlug;
