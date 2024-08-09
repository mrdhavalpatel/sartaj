import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import CompareTable from "../components/ecommerce/CompareTable";
import Layout from "../components/layout/Layout";
import {
  clearCompare,
  deleteFromCompare,
  updateCompareProducts,
} from "../redux/action/compareAction";
import { useIntl } from "react-intl";
const Compare = ({ compare, clearCompare, deleteFromCompare }) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateCompareProducts(intl));
  }, []);

  return (
    <Layout parent="Home" sub="Shop" subChild="Compare">
      <section className="mt-50 mb-50">
        <div className="container">
          <div className="row">
            <div className="col-xl-10 col-lg-12 m-auto">
              <h1 className="heading-2 mb-10">
                {intl.formatMessage({ id: "Products Comparison" })}
              </h1>

              <div className="table-responsive compare-table">
                {compare.items.length > 0 ? (
                  <>
                    <div className="text-end">
                      <span
                        className="clear-btn"
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={clearCompare}
                      >
                        {intl.formatMessage({ id: "Reset" })}
                      </span>
                    </div>
                    <CompareTable
                      data={compare.items}
                      features={[
                        "preview",
                        "name",
                        "Category",
                        "price",
                        "rating",
                        "description",
                        // "color",
                        // "sizes",
                        "stock",
                        "weight",
                        "dimensions",
                        "buy",
                        " ",
                      ]}
                      deleteFromCompare={deleteFromCompare}
                    />
                  </>
                ) : (
                  <>
                    <div className="mt-40">
                      <a className="btn" href={`/${intl.locale}/shop`}>
                        {intl.formatMessage({ id: "Let's Shop" })}
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  compare: state.compare,
});

const mapDispatchToProps = {
  clearCompare,
  deleteFromCompare,
};

export default connect(mapStateToProps, mapDispatchToProps)(Compare);
