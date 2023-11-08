import { useEffect, useState } from "react";
import BlogSidebar from "../components/elements/BlogSidebar";
import Layout from "../components/layout/Layout";
import { ApiCall } from "../lib/other/other";

function Guide() {
  const [faqData, setFaqData] = useState([]);

  const getFaqData = async () => {
    const request = await ApiCall("get", "config");
    const faqData = await request;
    setFaqData(faqData?.data?.faq);
  };
  useEffect(() => {
    getFaqData();
  }, []);
  return (
    <>
      <Layout parent="Home" sub="Pages" subChild="Guide">
        <div className="page-content pt-50">
          <div className="container">
            <div className="row">
              <div className="col-xl-10 col-lg-12 m-auto">
                <div className="row">
                  <div className="col-lg-12 mb-50">
                    <div dangerouslySetInnerHTML={{ __html: faqData }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Guide;
