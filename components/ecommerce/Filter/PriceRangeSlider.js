import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateProductFilters } from "../../../redux/action/productFiltersAction";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { ApiCall } from "../../../lib/other/other";
import { useIntl } from "react-intl";

const PriceRangeSlider = ({ updateProductFilters }) => {
  const Router = useRouter();
  const searchTerm = Router.query.search;
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState(null);
  const [price, setPrice] = useState({ value: { min: 0, max: maxPrice } });
  useEffect(() => {
    const filters = {
      price: price.value,
      min: price.value.min,
      max: price.value.max,
    };

    updateProductFilters(filters);
  }, [price, searchTerm]);

  useEffect(() => {
    const newPrice = { value: { ...price.value, max: maxPrice } };
    setPrice(newPrice);
  }, [maxPrice]);

  const [active, setActive] = useState(1);
  const handleActive = (index) => {
    setActive(index);
  };
  const getmaxPrice = async () => {
    setIsLoading(true);
    let res = await ApiCall("get", intl, "products/max-price");
    setMaxPrice(res?.data?.max_price);
    setIsLoading(false);
  };
  useEffect(() => {
    getmaxPrice();
  }, []);
  return (
    <>
      {!isLoading && (
        <>
          <Slider
            range
            allowCross={false}
            defaultValue={[0, maxPrice]}
            min={0}
            max={maxPrice}
            onChange={(value) =>
              setPrice({ value: { min: value[0], max: value[1] } })
            }
          />

          <div className="d-flex justify-content-between">
            <span>{price.value.min}</span>
            <span>{price.value.max}</span>
          </div>
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  products: state.products.items,
});

const mapDidpatchToProps = {
  updateProductFilters,
};

export default connect(mapStateToProps, mapDidpatchToProps)(PriceRangeSlider);
