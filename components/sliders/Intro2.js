import { useEffect, useState } from "react";
import SwiperCore, { EffectFade, Navigation, Pagination } from "swiper";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { ApiCall } from "../../lib/other/other";
import { useIntl } from "react-intl";

SwiperCore.use([Navigation, Pagination, EffectFade]);

const Intro2 = () => {
  const [banners, setBanners] = useState([]);
  const intl = useIntl();
  const getAllBanners = async () => {
    const request = await ApiCall("get", intl, "banners/get-home-banners");
    const allBanners = await request;
    setBanners(allBanners?.data);
  };
  useEffect(() => {
    getAllBanners();
  }, []);
  return (
    <>
      <Swiper
        slidesPerView={1}
        // loop={true}
        spaceBetween={0}
        effect={"fade"}
        fadeEffect={{
          crossFade: true,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={{
          prevEl: ".custom_prev_i1",
          nextEl: ".custom_next_i1",
        }}
        className="hero-slider-1 style-4 dot-style-1 dot- style-1-position-1"
      >
        {banners?.map((banner) => {
          return (
            <SwiperSlide>
              <div
                className="single-hero-slider single-animation-wrap"
                style={{
                  backgroundImage: `url(${banner && banner?.image})`,
                }}
              >
                <div className="slider-content">
                  <h4>{banner?.title}</h4>
                  <h1 className="display-2 mb-100">{banner?.description}</h1>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="slider-arrow hero-slider-1-arrow">
        <span className="slider-btn slider-prev slick-arrow custom_prev_i1">
          <i className="fi-rs-angle-left"></i>
        </span>
        <span className="slider-btn slider-next slick-arrow custom_next_i1">
          <i className="fi-rs-angle-right"></i>
        </span>
      </div>
    </>
  );
};

export default Intro2;
