import Link from "next/link";
import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/action/cart";
import { addToCompare } from "../../redux/action/compareAction";
import { openQuickView } from "../../redux/action/quickViewAction";
import { addToWishlist } from "../../redux/action/wishlistAction";
import storage from "../../util/localStorage";
import axios from "axios";
import { API_BASE_URL } from "../../lib/api";

const SingleProduct = ({
  product,
  addToCart,
  addToCompare,
  addToWishlist,
  openQuickView,
}) => {
  const handleCart = async (product) => {
    let token = localStorage.getItem("token");
    let payload = {
      product_id: product?.id,
      quantity: product?.quantity,
    };
    if (token) {
      const response = await axios
        .post(`${API_BASE_URL}customer/cart/add-to-cart`, payload, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .catch((error) => {
          console.log("error", error?.code === "ERR_NETWORK");
        });
    }
    addToCart(product);
    toast("Product added to Cart !");
  };

  const handleCompare = (product) => {
    addToCompare(product);
    toast("Added to Compare list !");
  };

  const handleWishlist = (product) => {
    addToWishlist(product);
    toast("Added to Wishlist !");
  };
  return (
    <>
      <div className="product-cart-wrap mb-30">
        <div className="product-img-action-wrap">
          <div className="product-img product-img-zoom">
            <Link href="/products/[slug]" as={`/products/${product?.id}`}>
              {product?.image?.map((itm) => {
                return <img className="default-img" src={itm} alt="nest" />;
              })}
            </Link>
          </div>
          <div className="product-action-1">
            <a
              aria-label="Quick view"
              className="action-btn hover-up"
              data-bs-toggle="modal"
              onClick={(e) => openQuickView(product)}
            >
              <i className="fi-rs-eye"></i>
            </a>
            <a
              aria-label="Add To Wishlist"
              className="action-btn hover-up"
              onClick={(e) => handleWishlist(product)}
            >
              <i className="fi-rs-heart"></i>
            </a>
            <a
              aria-label="Compare"
              className="action-btn hover-up"
              onClick={(e) => handleCompare(product)}
            >
              <i className="fi-rs-shuffle"></i>
            </a>
          </div>

          <div className="product-badges product-badges-position product-badges-mrg">
            {product?.badges?.map(() => {
              //
            })}
            {/* {product.trending && <span className="hot">Hot</span>}
            {product.created && <span className="new">New</span>}
            {product.totalSell > 100 && <span className="best">Best Sell</span>}
            {product.discount.isActive && <span className="sale">Sale</span>}
            {product.discount.percentage >= 5 && (
              <span className="hot">{product.discount.percentage}%</span>
            )} */}
          </div>
        </div>
        <div className="product-content-wrap">
          <div className="product-category">
            <Link href="/products">{product?.manufacturer?.name}</Link>
          </div>
          <h2>
            <Link href="/products/[slug]" as={`/products/${product?.id}`}>
              {product?.name}
            </Link>
          </h2>

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
              {/* {product?.rating} */}
            </span>
          </div>

          <div>
            <span className="font-small text-muted">
              By <Link href="/vendor/1">{product?.manufacturer?.name}</Link>
            </span>
          </div>

          <div className="product-card-bottom">
            <div className="product-price">
              <span>¥{product.price} </span>
              <span className="old-price">
                {product.oldPrice && `¥ ${product.oldPrice}`}
              </span>
            </div>
            <div className="add-cart">
              <a className="add" onClick={(e) => handleCart(product)}>
                <i className="fi-rs-shopping-cart mr-5"></i> Add
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapDispatchToProps = {
  addToCart,
  addToCompare,
  addToWishlist,
  openQuickView,
};

export default connect(null, mapDispatchToProps)(SingleProduct);
