import React, { useEffect, useState } from "react";
import PriceRangeSlider from "./Filter/PriceRangeSlider";
import CategoryProduct from "./Filter/CategoryProduct";
import Pagination from "./Pagination";
import SingleProduct from "./SingleProduct";
import { Spinner } from "react-bootstrap";
import SortSelect from "./Filter/SortSelect";
import Layout from "../layout/Layout";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import ShowSelect from "./Filter/ShowSelect";
import QuickView from "./QuickView";
import { ApiCall } from "../../lib/other/other";
import { translatedItemDetails } from "../../util/util";

const CategoryProducts = ({ productFilters }) => {
  const router = useRouter();

  const [product, setProduct] = useState({});
  const [seoType, setSeoType] = useState("");
  const [manufacturer, setManufacturer] = useState({});
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState({});
  const intl = useIntl();
  const [productsData, setProductsData] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [limit, setLimit] = useState(10);
  const [productTotal, setProductTotal] = useState([]);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("default");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [catName , setCatName]=useState("")
const [isCollapsed,setisCollapsed]=useState(false)
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

  const getProducts = async () => {
    setIsLoading(true);
    ApiCall(
      "get",
      intl,
      `category_seo/${intl.locale}/${router?.query?.slug
        .join("/")
        .replace(",", "/")}`
    ).then(async (response) => {
      setCatName(response?.data[0]?.categories)
 
      let payload = {
        limit: limit,
        offset: currentPage,
        min: productFilters?.min,
        max: productFilters?.max,
        sort_by: productFilters?.featured,
        category_id: response?.data[0]?.categories?.id?.toString(),
      };

      const request = await ApiCall("post", intl, "products/all", payload);
      const allProducts = await request?.data;
      setProductTotal(allProducts?.total_size);
      setProductsData(allProducts?.products);

      let arr = new Array(Math.ceil(allProducts?.total_size / limit))
        .fill()
        .map((_, idx) => idx + 1);

      setPagination(arr);
      setPages(Math.ceil(allProducts?.total_size / limit));
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getProducts();
  }, [
    productFilters,
    productFilters?.featured,
    limit,
    currentPage,
    router.query?.slug,
  ]);

  return (
    <Layout parent="Home" sub="Store  " subChild="About">
      <section className="mt-50 mb-50">
        <div className="container mb-30">
          <div className="row flex-row-reverse">
            <div className="col-lg-4-5">
              <div className="shop-product-fillter">
                <div className="totall-product">
                  {!isLoading && (
                    <p>
                       <span
                    dangerouslySetInnerHTML={{
                      __html: translatedItemDetails("name", intl, catName),
                    }}
                  /> , {intl.formatMessage({ id: "We found" })}
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
              {isLoading ? (
                <div
                  style={{ height: "60vh" }}
                  className="d-flex justify-content-center align-items-center"
                >
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <div className="row product-grid">
                  {getPaginatedProducts?.length === 0 && (
                    <h3>{intl.formatMessage({ id: "No Products Found" })} </h3>
                  )}

                  {getPaginatedProducts?.map((item, i) => (
                    <div
                      className="col-lg-1-5 col-md-4 col-6 col-sm-6"
                      key={item.id}
                    >
                      <SingleProduct product={item} />
                    </div>
                  ))}
                </div>
              )}
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
                
                <CategoryProduct isCollapsed={isCollapsed}/>
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
  );
};

export default CategoryProducts;
