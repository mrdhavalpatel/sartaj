import React, { useEffect, useState } from "react";
import ProductDetails from "../../components/ecommerce/ProductDetails";
import Layout from "../../components/layout/Layout";
import { server } from "../../config/index";
import { findProductIndex } from "../../util/util";
import { useRouter } from "next/router";
import { ApiCall } from "../../lib/other/other";

const ProductId = () => {
  const router = useRouter();
  const [product, setProduct] = useState({});
  useEffect(() => {
    ApiCall("get", `products/details/${router?.query?.slug}`).then(
      (response) => {
        setProduct(response?.data);
      }
    );
  }, []);
  return (
    <>
      <Layout parent="Home" sub="Shop" subChild={product?.name}>
        <div className="container">
          <ProductDetails product={product} />
        </div>
      </Layout>
    </>
  );
};

export default ProductId;
