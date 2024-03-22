import { useState } from "react";
import SwiperCore, { Navigation, Thumbs } from "swiper";
import "swiper/css/thumbs";
import { Swiper, SwiperSlide } from "swiper/react";
import ImageMagnifier from "./ImageMagnifier";
SwiperCore.use([Navigation, Thumbs]);

const ThumbSlider = ({ product }) => {
  console.log("data============================", product);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  return (
    <div>
      <Swiper
        style={{
          "--swiper-navigation-color": "#3e4493",
          "--swiper-pagination-color": "#3e4493",
        }}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        className="mySwiper2"
      >
        {product?.image?.map((item, index) => (
          <SwiperSlide key={index}>
            <ImageMagnifier imgUrl={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ThumbSlider;
