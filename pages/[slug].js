import React, { useEffect, useState } from "react";
import ProductDetails from "../components/ecommerce/ProductDetails";
import Layout from "../components/layout/Layout";
import { useRouter } from "next/router";
import { ApiCall } from "../lib/other/other";
import Preloader from "../components/elements/Preloader";
import SEO from "../components/seo/SEO";
import { useIntl } from "react-intl";
import { fetchProduct } from "../redux/action/product";
import { connect } from "react-redux";
import ShowSelect from "../components/ecommerce/Filter/ShowSelect";
import SortSelect from "../components/ecommerce/Filter/SortSelect";
import Pagination from "../components/ecommerce/Pagination";
import CategoryProduct from "../components/ecommerce/Filter/CategoryProduct";
import PriceRangeSlider from "../components/ecommerce/Filter/PriceRangeSlider";
import QuickView from "../components/ecommerce/QuickView";
import SingleProduct from "../components/ecommerce/SingleProduct";
import Link from "next/link";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";

const ProductId = ({ products, productFilters, fetchProduct }) => {
  const router = useRouter();
  //  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  //  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  //  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->

  const [product, setProduct] = useState({});
  const [seoType, setSeoType] = useState("");
  const [manufacturer, setManufacturer] = useState({});
  const [loading, setLoading] = useState(true);
  const intl = useIntl();
  // const URL = window.location.pathname;
  useEffect(() => {
    setLoading(true);
    getProductDetailsBySlug();
  }, [router?.query?.slug]);

  const getProductDetailsBySlug = () => {
    if (router?.query?.slug) {
      let payload = {
        seo: `${router?.locale}/${router?.query?.slug}`,
      };
      ApiCall("post", intl, `seo_type_check`, payload).then((res) => {
        setSeoType(res?.data?.type);
        ApiCall(
          "get",
          intl,
          res?.data?.type == "product"
            ? `product_seo/${router?.query?.slug}`
            : `manufacture_seo/${router?.query?.slug}`
        ).then((response) => {
          if (res?.data?.type == "product") {
            setProduct(response?.data);
            getProductReviewed(response?.data);
          } else if (res?.data?.type == "manufacturer") {
            setManufacturer(response?.data);
          }
          setLoading(false);
        });
      });
    }
  };

  // router?.query?.slug add in useefect hook dependency for referesh page when user clicks on related product
  //  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  //  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  //  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  const [productsData, setProductsData] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [limit, setLimit] = useState(12);
  const [productTotal, setProductTotal] = useState([]);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("default");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const cratePagination = () => {
    let arr = new Array(Math.ceil(productTotal / limit))
      .fill()
      .map((_, idx) => idx + 1);

    setPagination(arr);
    setPages(Math.ceil(productTotal / limit));
  };

  const getPaginatedProducts = productsData;

  const getPaginationGroup = pagination;

  const next = () => {
    setCurrentPage((page) => page + 1);
  };

  const handleChangeSortBy = (changedSortBy) => {
    setSortBy(changedSortBy);
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
  const getAllProduct = async () => {
    let payload = {
      limit: limit,
      offset: currentPage,
      min: productFilters?.min,
      max: productFilters?.max,
      sort_by: productFilters?.featured,
      manufacturer_id: router?.query?.slug,
    };

    const request = await ApiCall("post", intl, "products/all", payload);
    const allProducts = await request?.data;
    setProductTotal(allProducts?.total_size);
    setProductsData(allProducts?.products);
  };

  const getProductReviewed = async (product) => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (token) {
      const response = await axios.get(
        `${API_BASE_URL}customer/order/purchased-product/${product.id}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-localization": intl.locale == "eng" ? "en" : "ja",
          },
        }
      );
      const data = await response.data;

      if (data.purchased && !data.reviewed) {
        setShowReviewForm(true);
      } else {
        setShowReviewForm(false);
      }
    } else {
      setShowReviewForm(false);
    }
  };

  useEffect(() => {
    getAllProduct();
    cratePagination();
  }, [productFilters, productFilters?.featured, limit, currentPage]);

  useEffect(() => {
    if (
      !window.location.pathname.includes("eng/") &&
      !window.location.pathname.includes("jp/") &&
      router.query.slug
    ) {
      let currentSlug = router.query.slug || "";
      let pathWithoutLanguage = currentSlug.replace(/^\/[a-z]{2}\//, "");
      router.push(`/${"eng"}/${pathWithoutLanguage}`);
    } else {
      if (router?.pathname?.includes("shop-compare")) {
        router.push(`/${intl.locale}/${router?.pathname}`);
      } else if (router.pathname.includes("shop-wishlist")) {
        router.push(`/${intl.locale}/${router?.pathname}`);
      }
    }
  }, []);
  return (
    <>
      {seoType == "product" ? (
        <Layout parent="Home" sub="Shop" subChild={product?.name}>
          <div className="container">
            {loading ? (
              <Preloader />
            ) : (
              <>
                <SEO
                  title={product?.meta_title}
                  description={product?.meta_tag_description}
                  keywords={product?.meta_tag_keywords}
                />
                <ProductDetails
                  intl={intl}
                  product={product}
                  showReviewForm={showReviewForm}
                  setShowReviewForm={setShowReviewForm}
                  getProductDetailsBySlug={getProductDetailsBySlug}
                />
              </>
            )}
          </div>
        </Layout>
      ) : seoType == "manufacturer" ? (
        <Layout parent="Home" sub="Store  " subChild="About">
          <section className="mt-50 mb-50">
            <div className="container mb-30">
              <div className="row flex-row-reverse">
                <div className="col-lg-4-5">
                  <div className="shop-product-fillter">
                    <div className="totall-product">
                      <p>
                        {intl.formatMessage({ id: "We found" })}
                        <strong className="text-brand">
                          {productsData?.length}
                        </strong>
                        {intl.formatMessage({ id: "items for you!" })}
                      </p>
                    </div>
                    <div className="sort-by-product-area">
                      <div className="sort-by-cover mr-10">
                        <ShowSelect
                          selectChange={selectChange}
                          showLimit={12}
                        />
                      </div>
                      <div className="sort-by-cover">
                        <SortSelect />
                      </div>
                    </div>
                  </div>
                  <div className="row product-grid">
                    {getPaginatedProducts?.length === 0 && (
                      <h3>
                        {intl.formatMessage({ id: "No Products Found" })}{" "}
                      </h3>
                    )}

                    {getPaginatedProducts?.map((item, i) => (
                      <div
                        className="col-lg-1-5 col-md-4 col-12 col-sm-6"
                        key={i}
                      >
                        <SingleProduct product={item} />
                      </div>
                    ))}
                  </div>

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

                    <br />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <QuickView />
        </Layout>
      ) : null}
    </>
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
// export default ;
export default connect(mapStateToProps, mapDidpatchToProps)(ProductId);
