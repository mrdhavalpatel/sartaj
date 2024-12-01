// // import { useRouter } from "next/router";
// // import { useEffect, useState } from "react";
// // import { connect } from "react-redux";
// // import CompareModal from "../components/ecommerce/CompareModal";
// // import Pagination from "../components/ecommerce/Pagination";
// // import QuickView from "../components/ecommerce/QuickView";
// // import ShowSelect from "../components/ecommerce/Filter/ShowSelect";
// // import SingleProduct from "../components/ecommerce/SingleProduct";
// // import SortSelect from "../components/ecommerce/Filter/SortSelect";
// // import ShowSelect1 from "../components/ecommerce/Filter/ShowSelect1";
// // import IconGame from "../public/assets/icongamee.svg"
// // import WishlistModal from "../components/ecommerce/WishlistModal";
// // import Layout from "../components/layout/Layout";
// // import { fetchProduct } from "../redux/action/product";
// // import { ApiCall } from "../lib/other/other";
// // import { useIntl } from "react-intl";
// // import { Spinner } from "react-bootstrap";
// // import Image from "next/image";
// // const ProductsFullWidth = ({ products, productFilters, cartItems }) => {
// //   const intl = useIntl();
// //   const router = useRouter();
// //   const [productsData, setProductsData] = useState([]);
// //   const [pagination, setPagination] = useState([]);
// //   const [limit, setLimit] = useState(10);
// //   const [productTotal, setProductTotal] = useState([]);
// //   const [pages, setPages] = useState(1);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [loading, setLoading] = useState(true);
// //   const [showOptions, setShowOptions] = useState(false);
// //
// //   const toggleOptions = (event) => {
// //     event.preventDefault();
// //     setShowOptions(!showOptions);
// //   };
// //   const next = () => {
// //     setCurrentPage((page) => page + 1);
// //   };
// //
// //   const prev = () => {
// //     setCurrentPage((page) => page - 1);
// //   };
// //
// //   const handleActive = (item) => {
// //     setCurrentPage(item);
// //   };
// //
// //   const selectChange = (e) => {
// //     setLimit(Number(e.target.value));
// //     setCurrentPage(1);
// //   };
// //   const getAllProduct = async () => {
// //     setLoading(true);
// //     let payload = {
// //       limit: limit,
// //       offset: currentPage,
// //       sort_by: productFilters?.featured,
// //     };
// //
// //     if (router?.query?.search) {
// //       payload.search = router.query.search;
// //     }
// //
// //     if (router?.query?.catId) {
// //       payload.categoryId = router.query.catId.toString();
// //     }
// //
// //     const request = await ApiCall("post", intl, "products/all", payload);
// //     const allProducts = await request?.data;
// //     setProductTotal(allProducts?.total_size);
// //     setProductsData(allProducts?.products);
// //
// //     let arr = new Array(Math.ceil(allProducts?.total_size / limit))
// //       .fill()
// //       .map((_, idx) => idx + 1);
// //     setPagination(arr);
// //     setPages(Math.ceil(allProducts?.total_size / limit));
// //     setLoading(false);
// //   };
// //
// //   useEffect(() => {
// //     getAllProduct();
// //   }, [productFilters, limit, currentPage]);
// //
// //   return (
// //     <Layout parent="Home" sub="Shop" subChild="Wide">
// //       <section className="mt-50 mb-50">
// //         <div className="container">
// //           <div className="row flex-row-reverse">
// //             <div className="col-lg-12">
// //               <div className="shop-product-fillter">
// //                 {loading ? null : <div className="totall-product">
// //                   <p>
// //                     {intl.formatMessage({ id: "We found" })}
// //                     <strong className="text-brand">{productTotal}</strong>
// //                     {intl.formatMessage({ id: "items for you!" })}
// //                   </p>
// //                 </div>}
// //                 <div className="sort-by-product-area" style={{ display: loading ? "none" : "flex" }}>
// //                   <div className="sort-by-cover mr-10">
// //                     <ShowSelect selectChange={selectChange} />
// //                   </div>
// //                   <div className="sort-by-cover">
// //                     <SortSelect />
// //                   </div>
// //                   {/* <div onClick={toggleOptions}>
// //                     <Image
// //                       priority
// //                       src={IconGame}
// //                       alt="next"
// //                       width={50}
// //                       height={50}
// //                     />
// //
// //                   </div> */}
// //                   {/* <div>
// //                 <div className="sort-by-cover">
// //                  {showOptions ?  <ShowSelect1 setShowOptions={setShowOptions} /> : null}
// //                     </div>
// //                   </div> */}
// //
// //                 </div>
// //               </div>
// //               {loading ? (
// //                 <div
// //                   style={{ height: "60vh" }}
// //                   className="d-flex justify-content-center align-items-center"
// //                 >
// //                   <Spinner animation="border" role="status">
// //                     <span className="visually-hidden">Loading...</span>
// //                   </Spinner>
// //                 </div>
// //               ) : (
// //                 <div className="row product-grid-3">
// //                   {productsData?.length === 0 && (
// //                     <h3>{intl.formatMessage({ id: "No Products Found" })} </h3>
// //                   )}
// //
// //                   {productsData?.map((item, i) => (
// //                     <div
// //                       className="col-lg-1-5 col-md-4 col-6 col-sm-6"
// //                       key={item.id}
// //                     >
// //                       <SingleProduct product={item} cartItems={cartItems} />
// //                       {/* <SingleProductList product={item}/> */}
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //               <div className="pagination-area mt-15 mb-sm-5 mb-lg-0">
// //                 <nav aria-label="Page navigation example">
// //                   {pages > 1 && (
// //                     <Pagination
// //                       getPaginationGroup={pagination}
// //                       currentPage={currentPage}
// //                       pages={pages}
// //                       next={next}
// //                       prev={prev}
// //                       handleActive={handleActive}
// //                     />
// //                   )}
// //                 </nav>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </section>
// //       <WishlistModal />
// //       {/* <CompareModal /> */}
// //       {/* <CartSidebar /> */}
// //       <QuickView />
// //       {/* <div className="container">
// //                     <div className="row">
// //                         <div className="col-xl-6">
// //                             <Search />
// //                         </div>
// //                         <div className="col-xl-6">
// //                             <SideBarIcons />
// //                         </div>
// //                     </div>
// //                     <div className="row justify-content-center text-center">
// //                         <div className="col-xl-6">
// //                             <CategoryProduct />
// //                         </div>
// //                     </div>
// //                     <div className="row">
// //                         <div className="col-xl-3">
// //
// //                         </div>
// //                         <div className="col-md-9">
// //
// //
// //
// //
// //
// //                         </div>
// //                     </div>
// //                 </div> */}
// //     </Layout>
// //   );
// // };
// //
// // const mapStateToProps = (state) => ({
// //   products: state.products,
// //   productFilters: state.productFilters,
// //   cartItems: state.cart,
// // });
// //
// // const mapDidpatchToProps = {
// //   // openCart,
// //   fetchProduct,
// //   // fetchMoreProduct,
// // };
// //
// // export default connect(mapStateToProps, mapDidpatchToProps)(ProductsFullWidth);
//
// import { useRouter } from "next/router";
// import { useEffect, useState, useCallback, useMemo } from "react";
// import { connect } from "react-redux";
// import CompareModal from "../components/ecommerce/CompareModal";
// import Pagination from "../components/ecommerce/Pagination";
// import QuickView from "../components/ecommerce/QuickView";
// import ShowSelect from "../components/ecommerce/Filter/ShowSelect";
// import SingleProduct from "../components/ecommerce/SingleProduct";
// import SortSelect from "../components/ecommerce/Filter/SortSelect";
// import ShowSelect1 from "../components/ecommerce/Filter/ShowSelect1";
// import IconGame from "../public/assets/icongamee.svg";
// import WishlistModal from "../components/ecommerce/WishlistModal";
// import Layout from "../components/layout/Layout";
// import { fetchProduct } from "../redux/action/product";
// import { ApiCall } from "../lib/other/other";
// import { useIntl } from "react-intl";
// import { Spinner } from "react-bootstrap";
// import Image from "next/image";
//
// const ProductsFullWidth = ({ productFilters, cartItems }) => {
//   const intl = useIntl();
//   const router = useRouter();
//   const [productsData, setProductsData] = useState([]);
//   const [pagination, setPagination] = useState([]);
//   const [limit, setLimit] = useState(10);
//   const [productTotal, setProductTotal] = useState(0);
//   const [pages, setPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [showOptions, setShowOptions] = useState(false);
//
//   // Memoize the API payload to prevent unnecessary object creation
//   const getApiPayload = useCallback(() => ({
//     limit,
//     offset: currentPage,
//     sort_by: productFilters?.featured,
//     ...(router?.query?.search && { search: router.query.search }),
//     ...(router?.query?.catId && { categoryId: router.query.catId.toString() })
//   }), [limit, currentPage, productFilters?.featured, router?.query]);
//
//   // Memoize navigation handlers
//   const navigationHandlers = useMemo(() => ({
//     next: () => setCurrentPage(page => page + 1),
//     prev: () => setCurrentPage(page => page - 1),
//     handleActive: (item) => setCurrentPage(item),
//     toggleOptions: (event) => {
//       event.preventDefault();
//       setShowOptions(prev => !prev);
//     },
//     selectChange: (e) => {
//       setLimit(Number(e.target.value));
//       setCurrentPage(1);
//     }
//   }), []);
//
//   // Optimize the getAllProduct function with useCallback
//   const getAllProduct = useCallback(async () => {
//     try {
//       setLoading(true);
//       const payload = getApiPayload();
//       const request = await ApiCall("post", intl, "products/all", payload);
//       const allProducts = request?.data;
//
//       setProductTotal(allProducts?.total_size ?? 0);
//       setProductsData(allProducts?.products ?? []);
//
//       const paginationArray = new Array(Math.ceil(allProducts?.total_size / limit))
//           .fill()
//           .map((_, idx) => idx + 1);
//       setPagination(paginationArray);
//       setPages(Math.ceil(allProducts?.total_size / limit));
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       setProductsData([]);
//       setProductTotal(0);
//       setPagination([]);
//       setPages(1);
//     } finally {
//       setLoading(false);
//     }
//   }, [getApiPayload, intl, limit]);
//
//   useEffect(() => {
//     getAllProduct();
//   }, [getAllProduct]);
//
//   // Memoize the products grid to prevent unnecessary re-renders
//   const productsGrid = useMemo(() => {
//     if (productsData?.length === 0) {
//       return <h3>{intl.formatMessage({ id: "No Products Found" })}</h3>;
//     }
//
//     return productsData?.map((item) => (
//         <div className="col-lg-1-5 col-md-4 col-6 col-sm-6" key={item.id}>
//           <SingleProduct product={item} cartItems={cartItems} />
//         </div>
//     ));
//   }, [productsData, cartItems, intl]);
//
//   return (
//       <Layout parent="Home" sub="Shop" subChild="Wide">
//         <section className="mt-50 mb-50">
//           <div className="container">
//             <div className="row flex-row-reverse">
//               <div className="col-lg-12">
//                 <div className="shop-product-fillter">
//                   {!loading && <div className="totall-product">
//                     <p>
//                       {intl.formatMessage({ id: "We found" })}
//                       <strong className="text-brand">{productTotal}</strong>
//                       {intl.formatMessage({ id: "items for you!" })}
//                     </p>
//                   </div>}
//                   <div className="sort-by-product-area" style={{ display: loading ? "none" : "flex" }}>
//                     <div className="sort-by-cover mr-10">
//                       <ShowSelect selectChange={navigationHandlers.selectChange} />
//                     </div>
//                     <div className="sort-by-cover">
//                       <SortSelect />
//                     </div>
//                     <div onClick={navigationHandlers.toggleOptions}>
//                       <Image
//                           priority
//                           src={IconGame}
//                           alt="next"
//                           width={50}
//                           height={50}
//                       />
//                     </div>
//                     <div>
//                       <div className="sort-by-cover">
//                         {showOptions && <ShowSelect1 setShowOptions={setShowOptions} />}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 {loading ? (
//                     <div style={{ height: "60vh" }} className="d-flex justify-content-center align-items-center">
//                       <Spinner animation="border" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                       </Spinner>
//                     </div>
//                 ) : (
//                     <div className="row product-grid-3">
//                       {productsGrid}
//                     </div>
//                 )}
//                 <div className="pagination-area mt-15 mb-sm-5 mb-lg-0">
//                   <nav aria-label="Page navigation example">
//                     {pages > 1 && (
//                         <Pagination
//                             getPaginationGroup={pagination}
//                             currentPage={currentPage}
//                             pages={pages}
//                             next={navigationHandlers.next}
//                             prev={navigationHandlers.prev}
//                             handleActive={navigationHandlers.handleActive}
//                         />
//                     )}
//                   </nav>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         <WishlistModal />
//         <QuickView />
//       </Layout>
//   );
// };
//
// const mapStateToProps = (state) => ({
//   productFilters: state.productFilters,
//   cartItems: state.cart,
// });
//
// const mapDispatchToProps = {
//   fetchProduct,
// };
//
// export default connect(mapStateToProps, mapDispatchToProps)(ProductsFullWidth);

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
                    <div onClick={handlers.toggleOptions}>
                      <Image
                          priority
                          src={IconGame}
                          alt="next"
                          width={50}
                          height={50}
                      />
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