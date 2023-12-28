import Link from "next/link";
import { connect } from "react-redux";
import { addToCart } from "../../redux/action/cart";
import { useIntl } from "react-intl";
const CompareTable = ({ data, features, deleteFromCompare, addToCart }) => {
  const intl = useIntl();
  const handleCart = (product) => {
    addToCart(product);
  };
  return (
    <table className="table text-center">
      <tbody>
        {features.map((feature) => (
          <tr>
            <th
              className="text-muted font-md fw-600"
              style={{ textTransform: "capitalize" }}
            >
              {feature}
            </th>
            {data.map((product) =>
              feature == "preview" ? (
                <td className="row_img">
                  <img src={product?.image?.[0]} />
                </td>
              ) : feature == "name" ? (
                <td className="product_name">
                  <h5>
                    <Link
                      href={`/${
                        intl?.locale == "eng"
                          ? product?.seo_en
                          : product?.seo_ja
                      }`}
                    >
                      {product?.name}
                    </Link>
                  </h5>
                </td>
              ) : feature == "price" ? (
                <td className="product_price">
                  <span className="price">¥{product?.price}</span>
                </td>
              ) : feature == "Category" ? (
                <td className="product_price">
                  <span>
                    {product?.category_ids?.map((item) =>
                      item.name ? `${item.name},` : null
                    )}
                  </span>
                </td>
              ) : feature == "rating" ? (
                <td>
                  <div className="rating_wrap">
                    {product.total_reviews >= 0 && (
                      <>
                        <div className="product-rate d-inline-block">
                          <div
                            className="product-rating"
                            style={{
                              width: `${
                                product?.overall_rating
                                  ? product?.overall_rating
                                  : product?.product?.overall_rating
                                  ? product?.product?.overall_rating
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>

                        <span className="rating_num">
                          {`(${
                            product?.total_reviews
                              ? product.total_reviews
                              : product?.product?.total_reviews
                              ? product?.product?.total_reviews
                              : 0
                          })`}
                        </span>
                      </>
                    )}
                  </div>
                </td>
              ) : feature == "description" ? (
                <td className="row_text font-xs">
                  <p>{product?.description}</p>
                </td>
              ) : feature == "stock" ? (
                <td className="row_stock">
                  {product?.out_of_stock_status === "in stock" ? (
                    <span className="text-success">
                      {intl.formatMessage({ id: "In Stock" })}
                    </span>
                  ) : (
                    <span className="text-danger font-weight-bold">
                      {intl.formatMessage({ id: "Out of stock" })}
                    </span>
                  )}
                </td>
              ) : feature == "weight" ? (
                <td className="row_weight">{product?.unit}</td>
              ) : feature == "dimensions" ? (
                <td className="row_dimensions">N/A</td>
              ) : feature == "buy" ? (
                <td className="row_btn">
                  {product.stock >= 0 ? (
                    <button
                      disabled={product?.out_of_stock_status !== "in stock"}
                      className="btn  btn-sm"
                      style={{
                        backgroundColor: `${
                          product?.out_of_stock_status !== "in stock"
                            ? "grey"
                            : ""
                        }`,
                      }}
                      onClick={(e) => handleCart(product)}
                    >
                      <i className="fi-rs-shopping-bag mr-5"></i>
                      {product?.out_of_stock_status !== "in stock"
                        ? "Out of stock"
                        : "Add to cart"}
                    </button>
                  ) : (
                    <Link
                      href="/products/[slug]"
                      as={`/products/${product?.id}`}
                    >
                      <button className="btn  btn-sm btn-secondary">
                        {intl.formatMessage({ id: "Buy Now" })}
                      </button>
                    </Link>
                  )}
                </td>
              ) : feature == " " ? (
                <td className="row_remove">
                  <a onClick={() => deleteFromCompare(product.id)}>
                    <i className="fi-rs-trash mr-5"></i>
                    <span>{intl.formatMessage({ id: "Remove" })}</span>
                  </a>
                </td>
              ) : null
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const mapDispatchToProps = {
  addToCart,
};

export default connect(null, mapDispatchToProps)(CompareTable);
