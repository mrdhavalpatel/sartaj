import React, { useEffect, useState } from "react";
import ProductDetails from "../../components/ecommerce/ProductDetails";
import Layout from "../../components/layout/Layout";
import { useRouter } from "next/router";
import { ApiCall } from "../../lib/other/other";
import Preloader from "../../components/elements/Preloader";
import SEO from "../../components/seo/SEO";
import { useIntl } from "react-intl";

const ProductId = () => {
  const router = useRouter();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const intl = useIntl();
  console.log("router?.query?.slug", router?.query?.slug);
  useEffect(() => {
    setLoading(true);
    ApiCall("get", `${router?.query?.slug}`).then((response) => {
      setProduct(response?.data);
      console.log("response?.data", response);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Layout parent="Home" sub="Shop" subChild={product?.name}>
        <div className="container">
          {loading ? (
            <Preloader />
          ) : (
            <>
              <SEO
                title={product?.meta_title}
                description={product?.meta_tag_description}
                keywords={product?.meta_tag_keywords}
              />
              <ProductDetails product={product} />
            </>
          )}
        </div>
      </Layout>
    </>
  );
};

export default ProductId;
