import Link from "next/link";
import { useEffect, useState } from "react";
import SwiperCore, { Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { ApiCall } from "../../lib/other/other";
import { useRouter } from "next/router";
import { updateProductCategory } from "../../redux/action/productFiltersAction";
import { connect } from "react-redux";
import { useIntl } from "react-intl";
import { translatedItemDetails } from "../../util/util";

SwiperCore.use([Navigation, Autoplay]);

const CategorySlider2 = ({ updateProductCategory }) => {
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const intl = useIntl();
  const getAllCategories = async () => {
    const request = await ApiCall("get", intl, "categories");
    const allCategories = await request;

    setCategories(allCategories?.data);
  };

  useEffect(() => {
    getAllCategories();
  }, []);
  const selectCategory = (e, item) => {
    e.preventDefault();
    updateProductCategory(item?.name);
    console.log(window.location.pathname);
    router.push({
      pathname: `${
        intl.locale === "eng"
          ? item.seo_en.replace("/eng", "")
          : item.seo_ja.replace("/jp", "")
      }`,
    });
  };
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
          <SwiperSlide key={item.id}>
            <div className="card-1" onClick={(e) => selectCategory(e, item)}>
              <figure className=" img-hover-scale overflow-hidden">
                <div style={{ cursor: "pointer" }}>
                  <img src={item?.image} alt={item?.name} />
                </div>
              </figure>
              <h6>
                <div style={{ cursor: "pointer" }}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translatedItemDetails("name", intl, item),
                    }}
                  />
                </div>
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

// export default CategorySlider2;
export default connect(null, { updateProductCategory })(CategorySlider2);
