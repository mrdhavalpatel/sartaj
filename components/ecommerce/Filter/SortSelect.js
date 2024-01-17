import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateProductFilters } from "../../../redux/action/productFiltersAction";
import { useIntl } from "react-intl";

const SortSelect = ({ updateProductFilters }) => {
    const intl = useIntl();
    const Router = useRouter();
    const searchTerm = Router.query.search;

    const [featured, setFeatured] = useState("");

    useEffect(() => {
        const filters = {
            featured,
        };

        updateProductFilters(filters);
    }, [searchTerm, featured]);

    const seleceOption = (e) => {
        setFeatured(e.target.value);
    };

    return (
        <>
            <div className="sort-by-product-wrap">
                <div className="sort-by">
                    <span>
                        <i className="fi-rs-apps-sort"></i>
                       {intl.formatMessage({ id: 'Sort by:' })}
                       
                    </span>
                </div>
                <div className="sort-by-dropdown-wrap custom-select">
                    <select onChange={(e) => seleceOption(e)}>
                        <option value="">{intl.formatMessage({ id: 'Defaults' })}</option>
                        {/* <option value="featured">Featured</option>
                        <option value="trending">Trending</option> */}
                        <option value="lowToHigh">{intl.formatMessage({ id: 'Low To High' })}</option>
                        <option value="highToLow">{intl.formatMessage({ id: 'High To Low' })}</option>
                    </select>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    products: state.products.items,
});

const mapDidpatchToProps = {
    updateProductFilters,
};

export default connect(mapStateToProps, mapDidpatchToProps)(SortSelect);
