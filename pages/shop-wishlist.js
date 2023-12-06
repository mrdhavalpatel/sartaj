import { connect } from "react-redux";
import { toast } from "react-toastify";
import Layout from "../components/layout/Layout";
import { addToCart } from "../redux/action/cart";
import {
  clearWishlist,
  closeWishlistModal,
  deleteFromWishlist,
} from "../redux/action/wishlistAction";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Wishlist = ({
  wishlist,
  clearWishlist,
  closeWishlistModal,
  deleteFromWishlist,
  addToCart,
}) => {
  const router = useRouter();
  const handleCart = (product) => {
    addToCart(product);
    toast("Product added to Cart !");
  };
  const addLocalWishlistToCart = (wishlist) => {
    wishlist.map((Item) => {
      console.log(Item?.product_id);
    });
  };
  // useEffect(() => {
  //   let encodedToken = localStorage.getItem("token");
  //   if (encodedToken) {
  //     let wishlist = JSON.parse(localStorage.getItem("dokani_wishlist"));
  //     addLocalWishlistToCart(wishlist);
  //   } else {
  //     router.push("/page-login");
  //   }
  // }, []);
  return (
    <>
      <Layout parent="Home" sub="Shop" subChild="Wishlist">
        <section className="mt-50 mb-50">
          <div className="container">
            <div className="row">
              <div className="col-xl-10 col-lg-12 m-auto">
                {wishlist.items.length > 0 ? (
                  <div className="table-responsive shopping-summery">
                    <table className="table table-wishlist">
                      <thead>
                        <tr className="main-heading">
                          <th
                            className="custome-checkbox start pl-30"
                            colSpan="2"
                          >
                            Product
                          </th>
                          <th scope="col">Price</th>
                          <th scope="col">Stock Status</th>
                          <th scope="col">Action</th>
                          <th scope="col" className="end">
                            Remove
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {wishlist?.items?.map((product, i) => (
                          <tr className="pt-30" key={i}>
                            {console.log("product---->", product)}
                            <td className="image product-thumbnail pt-40">
                              <img
                                src={product?.image?.[0]}
                                alt="nest"
                                className="img-fluid"
                              />
                            </td>

                            <td className="product-des product-name">
                              <h6 className="product-name  mb-10">
                                <a>{product.name}</a>
                              </h6>
                              <div className="product-rate-cover">
                                <div className="product-rate d-inline-block">
                                  <div
                                    className="product-rating"
                                    style={{
                                      width: `${
                                        product?.overall_rating
                                          ? product?.overall_rating
                                          : 0
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="font-small ml-5 text-muted">
                                  {" "}
                                  {`(${
                                    product?.total_reviews
                                      ? product.total_reviews
                                      : 0
                                  })`}
                                </span>
                              </div>
                            </td>
                            <td className="price" data-title="Price">
                              <h3 className="text-brand">¥{product.price}</h3>
                            </td>
                            <td
                              className="text-center detail-info"
                              data-title="Stock"
                            >
                              {product.out_of_stock_status ===
                              "out of stock" ? (
                                <span className="stock-status out-stock mb-0">
                                  Out of stock
                                </span>
                              ) : product?.out_of_stock_status ===
                                "2-3 days" ? (
                                <span className="stock-status in-stock mb-0">
                                  2-3 days
                                </span>
                              ) : product?.out_of_stock_status ===
                                "pre order" ? (
                                <span className="stock-status in-stock mb-0">
                                  Pre Order
                                </span>
                              ) : (
                                <span className="stock-status in-stock mb-0">
                                  In stock
                                </span>
                              )}
                            </td>
                            <td className="text-right" data-title="Cart">
                              {product.stock === 0 ? (
                                <button className="btn btn-sm btn-secondary">
                                  Contact Us
                                </button>
                              ) : (
                                <button
                                  className="btn btn-sm"
                                  onClick={(e) => handleCart(product)}
                                >
                                  Add to cart
                                </button>
                              )}
                            </td>
                            <td className="action" data-title="Remove">
                              <a
                                onClick={(e) => deleteFromWishlist(product.id)}
                              >
                                <i className="fi-rs-trash"></i>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="text-right">
                      <span className="clear-btn" onClick={clearWishlist}>
                        Clear All
                      </span>
                    </div>
                  </div>
                ) : (
                  <h4 className="mb-0">No Products</h4>
                )}
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

const mapStateToProps = (state) => ({
  wishlist: state.wishlist,
});

const mapDispatchToProps = {
  closeWishlistModal,
  deleteFromWishlist,
  clearWishlist,
  addToCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
