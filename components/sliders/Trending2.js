import Link from "next/link";
import React, { useEffect, useState } from "react";

import { fetchByCatagory } from "../../redux/action/product";
import { ApiCall } from "../../lib/other/other";
import { translatedItemDetails } from "../../util/util";

const TrendingSlider = ({ intl }) => {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const request = await ApiCall(
      "get",
      intl,
      "/products/trending-three-products"
    );
    const trendingItem = await request?.data?.products;
    setTrending(trendingItem);
  };

  return (
    <>
      {trending?.slice(0, 3)?.map((product, i) => (
        <article key={i}>
          <div className="row align-items-center hover-up bottom_row_div">
            <figure className="col-md-4 mb-0">
              <Link
                href={`/${intl.locale == "eng" ? product.seo_en : product.seo_ja
                  }`}
              >
                <img src={product?.image?.[0]} alt="nest" />
              </Link>
            </figure>
            <div className="col-md-8 mb-0">
              <h6>
                <Link
                  href={`/${intl.locale == "eng" ? product.seo_en : product.seo_ja
                    }`}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translatedItemDetails("name", intl, product),
                    }}
                  />
                </Link>
              </h6>
              <span className="reviews_bottom">
                {product.overall_rating > 0 ? (
                  <div className="product-rate-cover">
                    <div className="product-rate d-inline-block">
                      <div
                        className="product-rating"
                        style={{
                          width: `${product?.overall_rating ? product.overall_rating : 0
                            }%`,
                        }}
                      ></div>
                    </div>
                    <span className="font-small ml-5 text-muted">
                      {`(${product?.total_reviews ? product?.total_reviews : 0})`}
                    </span>
                  </div>
                ) : (
                  intl.formatMessage({ id: "No reviews available" })
                )}
              </span>
              <div className="product-price">
                <span>¥{product?.actual_price} </span>
                <span className="old-price">
                  {product?.Price && `¥ ${product?.oldPrice}`}
                </span>
              </div>
            </div>
          </div>
        </article>
      ))}
    </>
  );
};

export default TrendingSlider;
