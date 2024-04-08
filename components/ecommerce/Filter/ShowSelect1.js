import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateProductFilters } from "../../../redux/action/productFiltersAction";
import { useIntl } from "react-intl";

const SortSelect = ({ updateProductFilters , setShowOptions }) => {
    const intl = useIntl();
    const Router = useRouter();
    const searchTerm = Router.query.search;

    const [featured, setFeatured] = useState("");

    useEffect(() => {
        const filters = {
            featured,
        };

        updateProductFilters(filters)
    }, [searchTerm, featured]);

    const selectOption = (value) => {
      setFeatured(value);

    };

    // Array of options
    const options = [
        { value: "", label: intl.formatMessage({ id: 'Defaults' }) },
        { value: "lowToHigh", label: intl.formatMessage({ id: 'Low To High' }) },
        { value: "highToLow", label: intl.formatMessage({ id: 'High To Low' }) }
    ];

    return (
        <>
            <div className="sort-by-product-wrap">
              
                <div className="sort-by-dropdown-wrap custom-select">
                    {/* Render options */}
                    {options.map(option => (
                        <div key={option.value} onClick={() => selectOption(option.value)}>
                            {option.label}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    products: state.products.items,
});

const mapDispatchToProps = {
    updateProductFilters,
};

export default connect(mapStateToProps, mapDispatchToProps)(SortSelect);
