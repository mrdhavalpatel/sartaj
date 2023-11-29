import Link from "next/link";
import { useEffect, useState } from "react";
import SwiperCore, { Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { ApiCall } from "../../lib/other/other";

SwiperCore.use([Navigation, Autoplay]);

const CategorySlider2 = () => {
  const [categories, setCategories] = useState([]);

  const getAllCategories = async () => {
    const request = await ApiCall("get", "categories");
    const allCategories = await request;

    setCategories(allCategories?.data);
  };

  useEffect(() => {
    getAllCategories();
  }, []);
  return (
    <>
      <Swiper
        slidesPerView={8}
        spaceBetween={0}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          0: {
            slidesPerView: 2,
          },
          639: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 7,
          },
        }}
        navigation={{
          prevEl: ".custom_prev_ct1",
          nextEl: ".custom_next_ct1",
        }}
        className="custom-class"
      >
        {categories?.map((item, i) => (
          <SwiperSlide key={i}>
            <div className="card-1">
              <figure className=" img-hover-scale overflow-hidden">
                <Link href="/shop-grid-right">
                  <img src={item?.image} alt={item?.name} />
                </Link>
              </figure>
              <h6>
                <Link href="/shop-grid-right">{item?.name}</Link>
              </h6>
              <span className="count">{`(${item?.total_produts} items)`}</span>
              {/* <span>{"26 item"}</span> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className="slider-arrow slider-arrow-2 flex-right carausel-10-columns-arrow"
        id="carausel-10-columns-arrows"
      >
        <span className="slider-btn slider-prev slick-arrow custom_prev_ct1">
          <i className="fi-rs-arrow-small-left"></i>
        </span>
        <span className="slider-btn slider-next slick-arrow custom_next_ct1">
          <i className="fi-rs-arrow-small-right"></i>
        </span>
      </div>
    </>
  );
};

export default CategorySlider2;
