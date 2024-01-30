import Link from "next/link";
import React, { useEffect, useState } from "react";
import SwiperCore, { Navigation } from "swiper";
import { ApiCall } from "../../lib/other/other";
import { useIntl } from "react-intl";

SwiperCore.use([Navigation]);

const NewArrival2 = ({ intl }) => {
  const [newArrival, setNewArrival] = useState([]);
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const request = await ApiCall("get", intl, "products/restored-products");
    const allProducts = await await request?.data;

    setNewArrival(allProducts);
  };

  return (
    <>
      {newArrival?.slice(0, 3).map((product, i) => (
        <article className="row align-items-center hover-up" key={i}>
          <figure className="col-md-4 mb-0">
            <Link
              href={`/${
                intl.locale == "eng" ? product.seo_en : product.seo_ja
              }`}
            >
              <img src={product?.image?.[0]} alt="nest" />
            </Link>
          </figure>
          <div className="col-md-8 mb-0">
            <h6>
              <Link
                href={`/${
                  intl.locale == "eng" ? product.seo_en : product.seo_ja
                }`}
              >
                <span dangerouslySetInnerHTML={{ __html: product?.name }} />
              </Link>
            </h6>
            <div className="product-rate-cover">
              <div className="product-rate d-inline-block">
                <div
                  className="product-rating"
                  style={{
                    width: `${
                      product?.overall_rating ? product.overall_rating : 0
                    }%`,
                  }}
                ></div>
              </div>
              <span className="font-small ml-5 text-muted">
                {" "}
                {`(${product?.total_reviews ? product?.total_reviews : 0})`}
              </span>
            </div>
            <div className="product-price">
              <span>¥{product?.actual_price} </span>
              <span className="old-price">
                {product.oldPrice && `¥ ${product.oldPrice}`}
              </span>
            </div>
          </div>
        </article>
      ))}
    </>
  );
};

export default NewArrival2;
