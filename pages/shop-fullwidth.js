import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import CompareModal from "../components/ecommerce/CompareModal";
import Pagination from "../components/ecommerce/Pagination";
import QuickView from "../components/ecommerce/QuickView";
import ShowSelect from "../components/ecommerce/Filter/ShowSelect";
import SingleProduct from "../components/ecommerce/SingleProduct";
import SortSelect from "../components/ecommerce/Filter/SortSelect";
import WishlistModal from "../components/ecommerce/WishlistModal";
import Layout from "../components/layout/Layout";
import { fetchProduct } from "../redux/action/product";
import { ApiCall } from "../lib/other/other";
import { useIntl } from "react-intl";
const ProductsFullWidth = ({ products, productFilters }) => {
  const intl = useIntl();
  const [productsData, setProductsData] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [limit, setLimit] = useState(10);
  const [productTotal, setProductTotal] = useState([]);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

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
  };

  useEffect(() => {
    getAllProduct();
  }, [productFilters, limit, currentPage]);

  return (
    <Layout parent="Home" sub="Shop" subChild="Wide">
      <section className="mt-50 mb-50">
        <div className="container">
          <div className="row flex-row-reverse">
            <div className="col-lg-12">
              <div className="shop-product-fillter">
                <div className="totall-product">
                  <p>
                    {intl.formatMessage({ id: "We found" })}
                    <strong className="text-brand">{productTotal}</strong>
                    {intl.formatMessage({ id: "items for you!" })}
                  </p>
                </div>
                <div className="sort-by-product-area">
                  <div className="sort-by-cover mr-10">
                    <ShowSelect selectChange={selectChange} />
                  </div>
                  <div className="sort-by-cover">
                    <SortSelect />
                  </div>
                </div>
              </div>
              <div className="row product-grid-3">
                {productsData?.length === 0 && (
                  <h3>{intl.formatMessage({ id: "No Products Found" })} </h3>
                )}

                {productsData?.map((item, i) => (
                  <div className="col-lg-1-5 col-md-4 col-6 col-sm-6" key={i}>
                    <SingleProduct product={item} />
                    {/* <SingleProductList product={item}/> */}
                  </div>
                ))}
              </div>
              <div className="pagination-area mt-15 mb-sm-5 mb-lg-0">
                <nav aria-label="Page navigation example">
                  {pages > 1 && (
                    <Pagination
                      getPaginationGroup={pagination}
                      currentPage={currentPage}
                      pages={pages}
                      next={next}
                      prev={prev}
                      handleActive={handleActive}
                    />
                  )}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
      <WishlistModal />
      {/* <CompareModal /> */}
      {/* <CartSidebar /> */}
      <QuickView />
      {/* <div className="container">
                    <div className="row">
                        <div className="col-xl-6">
                            <Search />
                        </div>
                        <div className="col-xl-6">
                            <SideBarIcons />
                        </div>
                    </div>
                    <div className="row justify-content-center text-center">
                        <div className="col-xl-6">
                            <CategoryProduct />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-3">
                            
                        </div>
                        <div className="col-md-9">
                            

                            

                            
                        </div>
                    </div>
                </div> */}
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

export default connect(mapStateToProps, mapDidpatchToProps)(ProductsFullWidth);
