import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import ShowSelect from "../components/ecommerce/Filter/ShowSelect";
import SortSelect from "../components/ecommerce/Filter/SortSelect";
import Breadcrumb2 from "../components/layout/Breadcrumb2";
import CategoryProduct from "../components/ecommerce/Filter/CategoryProduct";
import PriceRangeSlider from "../components/ecommerce/Filter/PriceRangeSlider";
import Pagination from "../components/ecommerce/Pagination";
import SingleProduct from "../components/ecommerce/SingleProduct";
import Layout from "../components/layout/Layout";
import { fetchProduct } from "../redux/action/product";
import { ApiCall } from "../lib/other/other";
import QuickView from "../components/ecommerce/QuickView";
import Link from "next/link";
import { useIntl } from "react-intl";
const Products = ({ productFilters }) => {
  const intl = useIntl();
  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [limit, setLimit] = useState(10);
  const [productTotal, setProductTotal] = useState([]);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const Router = useRouter();

  const cratePagination = async() => {
    // set pagination
    let arr = new Array(
      Math.ceil((productTotal ? productTotal : []) / (limit ? limit : 10))
    )
      .fill()
      .map((_, idx) => idx + 1);

   setPagination(arr);
   setPages(Math.ceil(productTotal / limit));
  };

  const startIndex = (currentPage - 1) * limit;
  const getPaginatedProducts = products;

  const getPaginationGroup = pagination;

  const next = () => {
    setCurrentPage((page) => page + 1);
  };

  const prev = () => {
    setCurrentPage((page) => page - 1);
  };

  const handleActive = (item) => {
    setCurrentPage(item);
  };

  const selectChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };
  const [maxPrice, setMaxPrice] = useState(20000);
  const getmaxPrice = async () => {
    let res = await ApiCall("get", intl, "products/max-price");
    setMaxPrice(res?.data?.max_price);
    getFilteredProduct(Router.query?.catId);
  };

  useEffect(() => {
    getmaxPrice();
  }, [
    Router.query?.catId,
    currentPage,
    pages,
    limit,
    productFilters,
    productFilters?.featured,
    productFilters?.actual_price?.min,
    productFilters?.actual_price?.max,
  ]);
  const getFilteredProduct = async (catId) => {
    let payload = {
      limit: limit,
      offset: currentPage,
      category_id: catId,
      min: productFilters?.actual_price?.min
        ? productFilters?.actual_price?.min
        : 0,
      max: productFilters?.actual_price?.max
        ? productFilters?.actual_price?.max
        : maxPrice,
      sort_by: productFilters?.featured,
    };
    let res = await ApiCall("post", intl, "products/all", payload);
    setProducts(res?.data?.products);
    setProductTotal(res?.data?.total_size);
  };

  // useEffect(() => {
  //   getFilteredProduct(Router.query?.catId);
  // }, [
  //   Router.query?.catId,
  //   currentPage,
  //   pages,
  //   limit,
  //   productFilters?.featured,
  //   productFilters?.actual_price?.min,
  //   productFilters?.actual_price?.max,
  // ]);
  const fetchProducts = async () => {
    const request = await ApiCall(
      "get",
      intl,
      "products/latest-three-products"
    );
    const newArrivals = await request?.data?.products;
    setNewProducts(newArrivals);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    cratePagination();
  }, [products, limit, currentPage]);

  return (
    <Layout noBreadcrumb="d-none">
      <Breadcrumb2 />
      <section className="mt-50 mb-50">
        <div className="container mb-30">
          <div className="row flex-row-reverse">
            <div className="col-lg-4-5">
              <div className="shop-product-fillter">
                <div className="totall-product">
                  {products?.length == 0 ? null : (
                    <p>
                      {intl.formatMessage({ id: "We found" })}
                      <strong className="text-brand">{productTotal}</strong>
                      {intl.formatMessage({ id: "items for you!" })}

                    </p>
                  )}
                </div>
                <div className="sort-by-product-area">
                  <div className="sort-by-cover mr-10">
                    <ShowSelect selectChange={selectChange} showLimit={10} />
                  </div>
                  <div className="sort-by-cover">
                    <SortSelect />
                  </div>
                </div>
              </div>
              <div className="row product-grid">
                {getPaginatedProducts?.length === 0 && (
                  <h3>{intl.formatMessage({ id: "No Products Found" })} </h3>
                )}

                {getPaginatedProducts?.map((item, i) => (
                  <div className="col-lg-1-5 col-md-4 col-6 col-sm-6" key={i}>
                    <SingleProduct product={item} />
                  </div>
                ))}
              </div>

              {getPaginatedProducts?.length === 0 ? null : (
                <div className="pagination-area mt-15 mb-sm-5 mb-lg-0">
                  <nav aria-label="Page navigation example">
                    <Pagination
                      getPaginationGroup={getPaginationGroup}
                      currentPage={currentPage}
                      pages={pages}
                      next={next}
                      prev={prev}
                      handleActive={handleActive}
                    />
                  </nav>
                </div>
              )}
            </div>
            <div className="col-lg-1-5 primary-sidebar sticky-sidebar">
              <div className="sidebar-widget widget-category-2 mb-30">
                <h5 className="section-title style-1 mb-30">
                  {intl.formatMessage({ id: "Category" })}
                </h5>
                <CategoryProduct />
              </div>
              <div className="sidebar-widget price_range range mb-30">
                <h5 className="section-title style-1 mb-30">
                  {intl.formatMessage({ id: "Fill by price" })}
                </h5>

                <div className="price-filter">
                  <div className="price-filter-inner">
                    <br />
                    <PriceRangeSlider />
                    <br />
                  </div>
                </div>
              </div>
              <div className="sidebar-widget product-sidebar  mb-30 p-30 bg-grey border-radius-10">
                <h5 className="section-title style-1 mb-30">
                  {intl.formatMessage({ id: "New products" })}
                </h5>
                {newProducts?.slice(0, 5)?.map((newProducts) => {
                  return (
                    <div className="single-post clearfix">
                      <div className="image">
                        <img src={newProducts?.image?.[0]} alt="#" />
                      </div>
                      <div className="content pt-10">
                        <h5>
                          <Link
                            href="/products/[slug]"
                            as={`/products/${newProducts?.id}`}
                          >
                            <span
                              dangerouslySetInnerHTML={{
                                __html: newProducts?.name,
                              }}
                            />
                          </Link>
                        </h5>
                        <p className="price mb-0 mt-5">¥{newProducts?.price}</p>
                        <div className="product-rate">
                          <div
                            className="product-rating"
                            style={{
                              width: `${
                                newProducts?.overall_rating
                                  ? newProducts?.overall_rating
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="font-small ml-5 text-muted">
                          {`(${
                            newProducts?.total_reviews
                              ? newProducts?.total_reviews
                              : 0
                          })`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuickView />
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  products: state.products,
  productFilters: state.productFilters,
});

const mapDidpatchToProps = {
  // openCart,
  fetchProduct,
  // fetchMoreProduct,
};

export default connect(mapStateToProps, mapDidpatchToProps)(Products);
