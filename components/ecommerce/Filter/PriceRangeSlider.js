import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
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
  const [tempPrice, setTempPrice] = useState({ min: 0, max: maxPrice });

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const debouncedSetPrice = useCallback(
    debounce((newPrice) => setPrice(newPrice), 500),
    []
  );

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

  useEffect(() => {
    getmaxPrice();
  }, []);

  const getmaxPrice = async () => {
    setIsLoading(true);
    let res = await ApiCall("get", intl, "products/max-price");
    setMaxPrice(res?.data?.max_price);
    setIsLoading(false);
  };

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
            onChange={(value) => {
              setTempPrice({ min: value[0], max: value[1] });
              debouncedSetPrice({ value: { min: value[0], max: value[1] } });
            }}
          />

          <div className="d-flex justify-content-between">
            <span>{tempPrice.min}</span>
            <span>{tempPrice.max || maxPrice}</span>
          </div>
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  products: state.products.items,
});

const mapDispatchToProps = {
  updateProductFilters,
};

export default connect(mapStateToProps, mapDispatchToProps)(PriceRangeSlider);
