import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useMemo } from "react";
import { connect } from "react-redux";
import CompareModal from "../components/ecommerce/CompareModal";
import Pagination from "../components/ecommerce/Pagination";
import QuickView from "../components/ecommerce/QuickView";
import ShowSelect from "../components/ecommerce/Filter/ShowSelect";
import SingleProduct from "../components/ecommerce/SingleProduct";
import SortSelect from "../components/ecommerce/Filter/SortSelect";
import ShowSelect1 from "../components/ecommerce/Filter/ShowSelect1";
import IconGame from "../public/assets/icongamee.svg";
import WishlistModal from "../components/ecommerce/WishlistModal";
import Layout from "../components/layout/Layout";
import { fetchProduct } from "../redux/action/product";
import { ApiCall } from "../lib/other/other";
import { useIntl } from "react-intl";
import { Spinner } from "react-bootstrap";
import Image from "next/image";

const ProductsFullWidth = ({ productFilters, cartItems }) => {
  const intl = useIntl();
  const router = useRouter();
  const [state, setState] = useState({
    productsData: [],
    pagination: [],
    limit: 10,
    productTotal: 0,
    pages: 1,
    currentPage: 1,
    loading: true,
    showOptions: false
  });

  // Memoize the API payload
  const getApiPayload = useCallback(() => ({
    limit: state.limit,
    offset: state.currentPage,
    sort_by: productFilters?.featured,
    ...(router?.query?.search && { search: router.query.search }),
    ...(router?.query?.catId && { categoryId: router.query.catId.toString() })
  }), [state.limit, state.currentPage, productFilters?.featured, router?.query]);

  // Optimize API call with useCallback and batch state updates
  const getAllProduct = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      const request = await ApiCall("post", intl, "products/all", getApiPayload());
      const allProducts = request?.data;

      const paginationArray = new Array(Math.ceil(allProducts?.total_size / state.limit))
          .fill()
          .map((_, idx) => idx + 1);

      setState(prev => ({
        ...prev,
        productsData: allProducts?.products ?? [],
        productTotal: allProducts?.total_size ?? 0,
        pagination: paginationArray,
        pages: Math.ceil(allProducts?.total_size / state.limit),
        loading: false
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      setState(prev => ({
        ...prev,
        productsData: [],
        productTotal: 0,
        pagination: [],
        pages: 1,
        loading: false
      }));
    }
  }, [getApiPayload, intl, state.limit]);

  // Memoize handlers to prevent unnecessary re-renders
  const handlers = useMemo(() => ({
    next: () => setState(prev => ({ ...prev, currentPage: prev.currentPage + 1 })),
    prev: () => setState(prev => ({ ...prev, currentPage: prev.currentPage - 1 })),
    handleActive: (item) => setState(prev => ({ ...prev, currentPage: item })),
    toggleOptions: (event) => {
      event.preventDefault();
      setState(prev => ({ ...prev, showOptions: !prev.showOptions }));
    },
    selectChange: (e) => {
      setState(prev => ({
        ...prev,
        limit: Number(e.target.value),
        currentPage: 1
      }));
    }
  }), []);

  // Effect for fetching products
  useEffect(() => {
    getAllProduct();
  }, [getAllProduct]);

  // Memoize products grid
  const productsGrid = useMemo(() => {
    if (state.productsData?.length === 0) {
      return <h3>{intl.formatMessage({ id: "No Products Found" })}</h3>;
    }

    return state.productsData?.map((item) => (
        <div className="col-lg-1-5 col-md-4 col-6 col-sm-6" key={item.id}>
          <SingleProduct product={item} cartItems={cartItems} />
        </div>
    ));
  }, [state.productsData, cartItems, intl]);

  return (
      <Layout parent="Home" sub="Shop" subChild="Wide">
        <section className="mt-50 mb-50">
          <div className="container">
            <div className="row flex-row-reverse">
              <div className="col-lg-12">
                <div className="shop-product-fillter">
                  {!state.loading && (
                      <div className="totall-product">
                        <p>
                          {intl.formatMessage({ id: "We found" })}
                          <strong className="text-brand">{state.productTotal}</strong>
                          {intl.formatMessage({ id: "items for you!" })}
                        </p>
                      </div>
                  )}
                  <div className="sort-by-product-area" style={{ display: state.loading ? "none" : "flex" }}>
                    <div className="sort-by-cover mr-10">
                      <ShowSelect selectChange={handlers.selectChange} />
                    </div>
                    <div className="sort-by-cover">
                      <SortSelect />
                    </div>
                   
                    <div>
                      <div className="sort-by-cover">
                        {state.showOptions && <ShowSelect1 setShowOptions={(value) =>
                            setState(prev => ({ ...prev, showOptions: value }))}
                        />}
                      </div>
                    </div>
                  </div>
                </div>
                {state.loading ? (
                    <div style={{ height: "60vh" }} className="d-flex justify-content-center align-items-center">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                ) : (
                    <div className="row product-grid-3">
                      {productsGrid}
                    </div>
                )}
                <div className="pagination-area mt-15 mb-sm-5 mb-lg-0">
                  <nav aria-label="Page navigation example">
                    {state.pages > 1 && (
                        <Pagination
                            getPaginationGroup={state.pagination}
                            currentPage={state.currentPage}
                            pages={state.pages}
                            next={handlers.next}
                            prev={handlers.prev}
                            handleActive={handlers.handleActive}
                        />
                    )}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>
        <WishlistModal />
        <QuickView />
      </Layout>
  );
};

const mapStateToProps = (state) => ({
  productFilters: state.productFilters,
  cartItems: state.cart,
});

const mapDispatchToProps = {
  fetchProduct,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductsFullWidth);