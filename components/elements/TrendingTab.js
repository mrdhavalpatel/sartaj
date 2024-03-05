import SwiperCore, { Navigation } from "swiper";
import SingleProduct from "../ecommerce/SingleProduct";
import { connect } from "react-redux";
import { fetchProduct } from "../../redux/action/product";


SwiperCore.use([Navigation]);

const TrendingTab = ({ products , cartItems }) => {
  const showItem = 10;
  return (
    <>
      {Array.isArray(products) &&
        products?.slice(0, showItem).map((product, i) => (
          <div className="col-lg-1-5 col-md-4 col-6 col-sm-6" key={i}>
            <SingleProduct product={product} cartItems={cartItems}/>
          </div>
        ))}
    </>
  );
};
const mapStateToProps = (state) => ({
  products: state.products,
  productFilters: state.productFilters,
  cartItems: state.cart,
});
const mapDidpatchToProps = {
  // openCart,
  fetchProduct,
  // fetchMoreProduct,
};
export default connect(mapStateToProps, mapDidpatchToProps)(TrendingTab);

// export default TrendingTab;
