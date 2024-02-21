import { useIntl } from "react-intl";
function SelectOp({ selectChange }) {
  const intl = useIntl();

  return (
    <>
      <div className="sort-by-product-wrap">
        <div className="sort-by">
          <span>
            <i className="fi-rs-apps"></i>
            {intl.formatMessage({ id: "Show" })}
          </span>
        </div>
        <div className="sort-by-dropdown-wrap custom-select">
          {/* Assuming that selectChange is a prop function */}
          <select onChange={selectChange} defaultValue={10}>
            <option value={5}>5</option>
            <option value={10} >
              10
            </option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
    </>
  );
}
export default SelectOp;
