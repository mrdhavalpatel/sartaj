import { connect } from "react-redux";
import Layout from "../components/layout/Layout";
import { addToCart } from "../redux/action/cart";
import {
  clearWishlist,
  closeWishlistModal,
  deleteFromWishlist,
} from "../redux/action/wishlistAction";
import { useIntl } from "react-intl";
import { translatedItemDetails } from "../util/util";
const Wishlist = ({
  wishlist,
  clearWishlist,
  deleteFromWishlist,
  addToCart,
}) => {
  const intl = useIntl();
  const handleCart = (product) => {
    product = {
      ...product,
      quantity: 1,
    };
    addToCart(product, intl);
  };

  return (
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
                          {intl.formatMessage({ id: "Product" })}
                        </th>
                        <th scope="col">
                          {intl.formatMessage({ id: "Price" })}
                        </th>
                        <th scope="col">
                          {intl.formatMessage({ id: "Stock Status" })}
                        </th>
                        <th scope="col">
                          {intl.formatMessage({ id: "Action" })}
                        </th>
                        <th scope="col" className="end">
                          {intl.formatMessage({ id: "Remove" })}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {wishlist?.items?.map((product, i) => (
                        <tr className="pt-30" key={product.id}>
                          <td className="image product-thumbnail pt-40">
                            <img
                              src={product?.image?.[0]}
                              alt="nest"
                              className="img-fluid"
                            />
                          </td>

                          <td className="product-des product-name">
                            <h6 className="product-name  mb-10">
                              <a
                                href={`/${
                                  intl.locale == "eng"
                                    ? product?.seo_en
                                    : product?.seo_ja
                                }`}
                              >
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: translatedItemDetails(
                                      "name",
                                      intl,
                                      product
                                    ),
                                  }}
                                />
                              </a>
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
                            <h3 className="text-brand">
                              <div className="product-price mt-10">
                                {product?.actual_price !== product?.price ? (
                                  <>
                                    <span
                                      className="old-price"
                                      style={{
                                        textDecoration: "line-through",
                                        color: "grey",
                                        fontSize: "0.8em",
                                      }}
                                    >
                                      ¥{product?.price}
                                    </span>
                                    <span> ¥{product?.actual_price}</span>
                                  </>
                                ) : (
                                  <span>¥{product?.actual_price}</span>
                                )}
                              </div>
                            </h3>
                          </td>
                          <td
                            className="text-center detail-info"
                            data-title="Stock"
                          >
                            {product.out_of_stock_status === "out of stock" ? (
                              <span className="stock-status out-stock mb-0">
                                {intl.formatMessage({ id: "Out of stock" })}
                              </span>
                            ) : product?.out_of_stock_status === "2-3 days" ? (
                              <span className="stock-status in-stock mb-0">
                                {intl.formatMessage({ id: "2-3 days" })}
                              </span>
                            ) : product?.out_of_stock_status === "pre order" ? (
                              <span className="stock-status in-stock mb-0">
                                {intl.formatMessage({ id: "Pre Order" })}
                              </span>
                            ) : (
                              <span className="stock-status in-stock mb-0">
                                {intl.formatMessage({ id: "In stock" })}
                              </span>
                            )}
                          </td>
                          <td className="text-right" data-title="Cart">
                            {product.stock === 0 ? (
                              <button className="btn btn-sm btn-secondary">
                                {intl.formatMessage({ id: "Contact Us" })}
                              </button>
                            ) : (
                              <button
                                disabled={
                                  product?.out_of_stock_status !== "in stock"
                                }
                                style={{
                                  backgroundColor: `${
                                    product?.out_of_stock_status !== "in stock"
                                      ? "grey"
                                      : ""
                                  }`,
                                }}
                                className="btn btn-sm"
                                onClick={(e) => handleCart(product)}
                              >
                                {product?.out_of_stock_status !== "in stock"
                                  ? 
                                  intl.formatMessage({ id: "Out of stock" })
                                  :  intl.formatMessage({ id: "Add to cart" })}
                              </button>
                            )}
                          </td>
                          <td className="action" data-title="Remove">
                            <a onClick={(e) => deleteFromWishlist(product.id)}>
                              <i className="fi-rs-trash"></i>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-right">
                    <span className="clear-btn" onClick={clearWishlist}>
                      {intl.formatMessage({ id: "Clear All" })}
                    </span>
                  </div>
                </div>
              ) : (
                <h4 className="mb-0">
                  {intl.formatMessage({ id: "No Products" })}
                </h4>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
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
