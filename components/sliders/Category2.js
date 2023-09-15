import Link from "next/link";
import SwiperCore, { Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

SwiperCore.use([Navigation, Autoplay]);

const CategorySlider2 = () => {
    var data = [
        {
            id: 1,
            title: "Ready To Cook",
            img: "category-1.svg"
        },
        {
            id: 2,
            title: "Leaves & Herbs",
            img: "category-2.svg"
        },
        {
            id: 3,
            title: "Spice",
            img: "category-3.svg"
        },
        {
            id: 4,
            title: "Atta & Flour",
            img: "category-4.svg"
        },
        {
            id: 6,
            title: "Sauce & Chutney",
            img: "category-6.svg"
        },
        {
            id: 7,
            title: "Fruits",
            img: "category-7.svg"
        },
        {
            id: 8,
            title: "Frozen Items",
            img: "category-8.svg"
        },
        {
            id: 9,
            title: "Beans",
            img: "category-9.svg"
        },
        {
            id: 10,
            title: "Snacks",
            img: "category-10.svg"
        },
        {
            id: 11,
            title: "Tea",
            img: "category-11.svg"
        },
        {
            id: 13,
            title: "Sweets",
            img: "category-13.svg"
        },
        {
            id: 14,
            title: "Beauty And Health",
            img: "category-14.svg"
        },
        {
            id: 15,
            title: "Rice",
            img: "category-15.svg"
        },
        {
            id: 16,
            title: "Juice",
            img: "category-16.svg"
        },
        {
            id: 17,
            title: "Alcohol",
            img: "category-17.svg"
        }
    ];
    return (
        <>
            <Swiper
                slidesPerView={8}
                spaceBetween={0}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false
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
                    }
                }}
                navigation={{
                    prevEl: ".custom_prev_ct1",
                    nextEl: ".custom_next_ct1"
                }}
                className="custom-class"
            >
                {data.map((item, i) => (
                    <SwiperSlide key={i}>
                        <div className="card-1">
                            <figure className=" img-hover-scale overflow-hidden">
                                <Link href="/shop-grid-right">
                                    <img src={`assets/imgs/theme/icons/${item.img}`} alt={item.title} />
                                </Link>
                            </figure>
                            <h6>
                                <Link href="/shop-grid-right">{item.title}</Link>
                            </h6>
                            <span>26 items</span>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="slider-arrow slider-arrow-2 flex-right carausel-10-columns-arrow" id="carausel-10-columns-arrows">
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
