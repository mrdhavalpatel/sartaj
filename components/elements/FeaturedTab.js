import SingleProduct from "../ecommerce/SingleProduct";

const FeaturedTab = ({ products  , cartItems}) => {
  const showItem = 10;
  return (
    <>
      {products &&
        products?.slice(0, showItem).map((product, i) => (
          <div className="col-lg-1-5 col-md-4 col-6 col-sm-6" key={i}>
            <SingleProduct product={product} cartItems={cartItems}/>
          </div>
        ))}
    </>
  );
};

export default FeaturedTab;
