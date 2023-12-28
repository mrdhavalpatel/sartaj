import Layout from "../components/layout/Layout";
import Link from "next/link";
import { useIntl } from "react-intl";
function Custom404() {
  const intl = useIntl();
  return (
    <>
      <Layout parent="Home" sub="Pages" subChild="404">
        <main className="main page-404">
          <div className="page-content pt-150 pb-150">
            <div className="container">
              <div className="row">
                <div className="col-xl-8 col-lg-10 col-md-12 m-auto text-center">
                  <p className="mb-20">
                    <img
                      src="assets/imgs/page/page-404.png"
                      alt="nest"
                      className="hover-up"
                    />
                  </p>
                  <h1 className="display-2 mb-30">
                    {intl.formatMessage({ id: "Page Not Found" })}
                  </h1>
                  <p className="font-lg text-grey-700 mb-30">
                    {intl.formatMessage({
                      id: "The link you clicked may be broken or the page may have been removed.",
                    })}
                    <br />
                    {intl.formatMessage({ id: "visit the" })}{" "}
                    <Link href="/">
                      <span> {intl.formatMessage({ id: "Homepage" })}</span>
                    </Link>
                    {intl.formatMessage({ id: "or" })}{" "}
                    <Link href="/page-contact">
                      <span>{intl.formatMessage({ id: "Contact us" })}</span>
                    </Link>
                    {intl.formatMessage({ id: "about the problem" })}
                  </p>
                  <div className="search-form">
                    <form action="#">
                      <input type="text" placeholder="Search…" />
                      <button type="submit">
                        <i className="fi-rs-search"></i>
                      </button>
                    </form>
                  </div>
                  <Link
                    className="btn btn-default submit-auto-width font-xs hover-up mt-30"
                    href="/"
                  >
                    <i className="fi-rs-home mr-5"></i>{" "}
                    {intl.formatMessage({ id: "Back To Home Page" })}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}

export default Custom404;
