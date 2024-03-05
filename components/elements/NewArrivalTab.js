import SwiperCore, { Navigation } from "swiper";
import SingleProduct from "../ecommerce/SingleProduct";

SwiperCore.use([Navigation]);

const NewArrivalTab = ({ products , cartItems }) => {
  const showItem = 10;
  return (
    <>
      {products &&
        products?.slice(0, showItem)?.map((product, i) => (
          <div className="col-lg-1-5 col-md-4 col-6 col-sm-6" key={i}>
            <SingleProduct product={product} cartItems={cartItems}/>
          </div>
        ))}
    </>
  );
};

export default NewArrivalTab;
