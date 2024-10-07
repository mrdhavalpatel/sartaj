import { useEffect, useState } from "react";
import SwiperCore, { Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { ApiCall } from "../../lib/other/other";
import { useIntl } from "react-intl";
import Link from "next/link";

SwiperCore.use([Navigation, Autoplay]);

const BrandSlider = () => {
  const [brands, setBrands] = useState([]);
  const intl = useIntl();

  const getSeoUrl = (brand) => {
    return intl.locale === "ja" ? brand.seo_ja : brand.seo_en;
  };

  const getAllBrands = async () => {
    try {
      const request = await ApiCall("get", intl, "list-manufacturer");
      const allBrands = request;
      console.log("API Response:", getSeoUrl); // Log the API response to the console
      setBrands(allBrands?.data);
    } catch (error) {
      console.error("Error fetching brands:", error); // Log any errors
    }
  };

  useEffect(() => {
    getAllBrands(); // Fetch brands on load
  }, []);

  return (
    <>
      {/* Brands Section */}
      <Swiper
        slidesPerView={6}
        spaceBetween={20}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: ".custom_prev_br1",
          nextEl: ".custom_next_br1",
        }}
        className="carausel-6-columns text-center"
      >
        {brands && brands.length > 0 ? (
          brands.map((brand, i) => (
            <SwiperSlide key={i}>
              <div className="brand-logo">
                <Link
                  href={`/${
                    intl.locale === "eng" ? brand?.seo_en : brand?.seo_ja
                  }`}
                >
                  <img
                    className="brand_logo_img"
                    src={`https://admin.sartajfoods.jp/storage/product/image/${brand.image}`}
                    alt={brand.name}
                  />
                </Link>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <p>No brands available</p>
        )}
      </Swiper>

      <div
        className="slider-arrow slider-arrow-2 flex-right carausel-10-columns-arrow"
        id="carausel-10-columns-arrows"
      >
        <span className="slider-btn slider-prev slick-arrow custom_prev_br1">
          <i className="fi-rs-arrow-small-left"></i>
        </span>
        <span className="slider-btn slider-next slick-arrow custom_next_br1">
          <i className="fi-rs-arrow-small-right"></i>
        </span>
      </div>
    </>
  );
};

export default BrandSlider;
