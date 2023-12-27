import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import CategoryProduct from "../../components/ecommerce/Filter/CategoryProduct";
import PriceRangeSlider from "../../components/ecommerce/Filter/PriceRangeSlider";
import ShowSelect from "../../components/ecommerce/Filter/ShowSelect";
import SizeFilter from "../../components/ecommerce/Filter/SizeFilter";
import SortSelect from "../../components/ecommerce/Filter/SortSelect";
import VendorFilter from "../../components/ecommerce/Filter/VendorFilter";
import Pagination from "../../components/ecommerce/Pagination";
import QuickView from "../../components/ecommerce/QuickView";
import SingleProduct from "../../components/ecommerce/SingleProduct";
import Layout from "../../components/layout/Layout";
import { fetchProduct } from "../../redux/action/product";
import { ApiCall } from "../../lib/other/other";
import { useIntl } from "react-intl";
const Products = ({ products, productFilters, fetchProduct }) => {
  const intl = useIntl();
  const [productsData, setProductsData] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [limit, setLimit] = useState(12);
  const [productTotal, setProductTotal] = useState([]);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  // const [singleStore, setSingleStore] = useState([]);
  let Router = useRouter();
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
      sort_by: productFilters?.featured,
      manufacturer_id: Router?.query?.id,
    };

    const request = await ApiCall("post", "products/all", payload);
    const allProducts = await request?.data;
    setProductTotal(allProducts?.total_size);
    setProductsData(allProducts?.products);
  };

  useEffect(() => {
    getAllProduct();
    cratePagination();
  }, [productFilters?.featured, limit, currentPage]);

  return (
    <>
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
                      <ShowSelect selectChange={selectChange} showLimit={12} />
                    </div>
                    <div className="sort-by-cover">
                      <SortSelect />
                    </div>
                  </div>
                </div>
                <div className="row product-grid">
                  {getPaginatedProducts.length === 0 && (
                    <h3>{intl.formatMessage({ id: "No Products Found" })} </h3>
                  )}

                  {getPaginatedProducts.map((item, i) => (
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

export default connect(mapStateToProps, mapDidpatchToProps)(Products);
