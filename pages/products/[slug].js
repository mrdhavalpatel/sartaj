import React, { useEffect, useState } from "react";
import ProductDetails from "../../components/ecommerce/ProductDetails";
import Layout from "../../components/layout/Layout";
import { useRouter } from "next/router";
import { ApiCall } from "../../lib/other/other";
import Preloader from "../../components/elements/Preloader";

const ProductId = () => {
  const router = useRouter();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    ApiCall("get", `products/details/${router?.query?.slug}`).then(
      (response) => {
        setProduct(response?.data);
        setLoading(false);
      }
    );
  }, []);

  return (
    <>
      <Layout parent="Home" sub="Shop" subChild={product?.name}>
        <div className="container">
          {loading ? <Preloader /> : <ProductDetails product={product} />}
        </div>
      </Layout>
    </>
  );
};

export default ProductId;
