import Link from "next/link";
import BlogSidebar from "../components/elements/BlogSidebar";
import Layout from "../components/layout/Layout";
import { useEffect, useState } from "react";
import { ApiCall } from "../lib/other/other";
import { useIntl } from "react-intl";

function Terms() {
  const [termsData, setTermsData] = useState([]);
  const intl = useIntl();
  const getTermsData = async () => {
    const request = await ApiCall("get", intl, "config");
    const privacyPolicyData = await request;
    if(intl.locale === "eng"){

    setTermsData(privacyPolicyData?.data?.terms_and_conditions);}
    else{
      setTermsData(privacyPolicyData?.data?.japanese_terms_and_conditions);}

    
  };
  useEffect(() => {
    getTermsData();
  }, []);
  return (
    <>
      <Layout parent="Home" sub="Pages" subChild="Terms">
        <div className="page-content pt-50 terms_conditions_content">
          <div className="container">
            <div className="row">
              <div className="col-xl-10 col-lg-12 m-auto">
                <div className="row">
                  <div className="col-lg-9 mb-50">
                    <div dangerouslySetInnerHTML={{ __html: termsData }}></div>
                  </div>
                  {/* <div className="col-lg-3 primary-sidebar sticky-sidebar">
                                        <BlogSidebar />
                                    </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Terms;
