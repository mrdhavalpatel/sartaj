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
import FeatchDeals from "../components/ecommerce/fetchDeals";
import { useEffect, useState } from "react";
import { ApiCall } from "../lib/other/other";
import Deals1 from "../components/elements/Deals1";
const Dealsoftheday = ({
  wishlist,
  clearWishlist,
  deleteFromWishlist,
  addToCart,
}) => {
  const intl = useIntl();
  const [deals, setDeals] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [limit, setLimit] = useState(1);
  const [productTotal, setProductTotal] = useState([]);
  const [pages, setPages] = useState(1);


  const dealsProduct = async () => {
    const request = await ApiCall("get", intl, "products/sale-products?limit=1000");
    const allProducts = await request;
    // Discount
    console.log("fetch sale products",allProducts.data)
    setDeals(allProducts?.data?.products);
    let arr = new Array(Math.ceil(deals.length / limit))
    .fill()
    .map((_, idx) => idx + 1);
    setPagination(arr);
    setPages(Math.ceil(allProducts?.total_size / limit));
  };

  useEffect(() => {
    dealsProduct();
  }, []);
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
            <h2>Deals Of The Day</h2>
      {deals.length > 0 ?
       <p>
                      {intl.formatMessage({ id: "We found" })}
                      <strong className="text-brand">
                        {" "}{deals?.length}{" "}
                      </strong>
                      {intl.formatMessage({ id: "items for you!" })}

                    </p> :
                    <p>
                    {intl.formatMessage({ id: "No Products Found" })}
                  </p>
                    }
                      <div className="row product-grid-3">
                      {deals?.length === 0 && (
                  <h3>{intl.formatMessage({ id: "No Products Found" })} </h3>
                )}
    {deals?.map((product, i) => (
          <div className="col-xl-4 col-lg-4 col-md-6" key={i}>
            <Deals1 product={product} />
          </div>
        ))}
        </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dealsoftheday;
