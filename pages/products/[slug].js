import React, { useEffect, useState } from "react";
import ProductDetails from "../../components/ecommerce/ProductDetails";
import Layout from "../../components/layout/Layout";
import { useRouter } from "next/router";
import { ApiCall } from "../../lib/other/other";
import Preloader from "../../components/elements/Preloader";
import SEO from "../../components/seo/SEO";

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
          {loading ? (
            <Preloader />
          ) : (
            <>
              <SEO title={product.seo_eng} description={product?.description} />
              <ProductDetails product={product} />
            </>
          )}
        </div>
      </Layout>
    </>
  );
};

export default ProductId;
