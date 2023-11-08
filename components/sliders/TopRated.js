import Link from "next/link";
import React, { useEffect, useState } from "react";
import SwiperCore, { Navigation } from "swiper";
import { fetchByCatagory } from "../../redux/action/product";
import { ApiCall } from "../../lib/other/other";

SwiperCore.use([Navigation]);

const TopRatedSlider = () => {
  const [discount, setDiscount] = useState([]);

  // console.log(discount);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const request = await ApiCall("get", "/products/rated-three-products");
    const topRated = await request?.data;
    setDiscount(topRated);
  };
  return (
    <>
      {discount?.map((product, i) => (
        <article className="row align-items-center hover-up" key={i}>
          <figure className="col-md-4 mb-0">
            <Link href="/products/[slug]" as={`/products/${product.name}`}>
              <img src={product?.image?.[0]} alt="nest" />
            </Link>
          </figure>
          <div className="col-md-8 mb-0">
            <h6>
              <Link href="/products/[slug]" as={`/products/${product.id}`}>
                {product.name}
              </Link>
            </h6>
            <div className="product-rate-cover">
              <div className="product-rate d-inline-block">
                <div className="product-rating" style={{ width: "90%" }}></div>
              </div>
              <span className="font-small ml-5 text-muted">
                {" "}
                ({product?.rating})
              </span>
            </div>
            <div className="product-price">
              <span>¥{product?.price} </span>
              {/* <span className="old-price">
                {product?.price && `¥ ${product?.oldPrice}`}
              </span> */}
            </div>
          </div>
        </article>
      ))}
    </>
  );
};

export default TopRatedSlider;
