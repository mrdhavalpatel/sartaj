import React, { useEffect, useState } from "react";
import ProductDetails from "../components/ecommerce/ProductDetails";
import Layout from "../components/layout/Layout";
import { useRouter } from "next/router";
import { ApiCall } from "../lib/other/other";
import Preloader from "../components/elements/Preloader";
import SEO from "../components/seo/SEO";
import { useIntl } from "react-intl";

const ProductId = () => {
  const router = useRouter();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const intl = useIntl();
  // const URL = window.location.pathname;
  useEffect(() => {
    setLoading(true);
    ApiCall("get", intl, `product_seo/${router?.query?.slug}`).then(
      (response) => {
        setProduct(response?.data);
        setLoading(false);
      }
    );
  }, []);

  // useEffect(() => {
  //   setLoading(true);

  //   // Get the current slug from the router
  //   const currentSlug = window.location.pathname;

  //   // Check if the current slug contains "/eng" or "/jp"
  //   if (
  //     !currentSlug ||
  //     !currentSlug.includes("/eng") ||
  //     !currentSlug.includes("/jp")
  //   ) {
  //     // If not, replace it with intl.locale
  //     const newSlug = `/${intl.locale}/${currentSlug}`;
  //     // Update the URL using window.location.replace
  //     const newUrl = window.location.pathname.replace(currentSlug, newSlug);
  //     window.location.replace(newUrl);
  //   }
  //   console.log("currentSlug", currentSlug);
  //   // Make the API call with the updated slug
  // }, []);
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
              <ProductDetails intl={intl} product={product} />
            </>
          )}
        </div>
      </Layout>
    </>
  );
};

export default ProductId;
