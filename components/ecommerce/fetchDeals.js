import React, { useEffect, useState } from "react";
import { server } from "../../config/index";
import Deals1 from "../elements/Deals1";
import { ApiCall } from "../../lib/other/other";
import { useIntl } from "react-intl";

function FeatchDeals() {
  const [deals, setDeals] = useState([]);
  const intl = useIntl();
  const dealsProduct = async () => {
    const request = await ApiCall("get", intl, "products/sale-products");
    const allProducts = await request;
    // Discount
    setDeals(allProducts?.data?.products);
  };

  useEffect(() => {
    dealsProduct();
  }, []);

  return (
    <>
      <div className="row">
        {deals?.slice(0, 4).map((product, i) => (
          <div className="col-xl-4 col-lg-4 col-md-6" key={i}>
            <Deals1 product={product} />
          </div>
        ))}
      </div>
    </>
  );
}
export default FeatchDeals;
