import React, { useEffect, useState } from "react";
import { server } from "../../config/index";
import Deals1 from "../elements/Deals1";
import { ApiCall } from "../../lib/other/other";

function FeatchDeals() {
  const [deals, setDeals] = useState([]);

  const dealsProduct = async () => {
    const request = await ApiCall("get", "products/sale-products");
    const allProducts = await request;
    // Discount
    setDeals(allProducts?.data?.products);
    console.log("allProducts?.data?.products", allProducts?.data?.products);
  };

  useEffect(() => {
    dealsProduct();
  }, []);

  return (
    <>
      <div className="row">
        {deals?.slice(0, 4).map((product, i) => (
          <div className="col-xl-3 col-lg-4 col-md-6" key={i}>
            <Deals1 product={product} />
          </div>
        ))}
      </div>
    </>
  );
}
export default FeatchDeals;
