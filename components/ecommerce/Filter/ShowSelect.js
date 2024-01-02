function SelectOp({ selectChange }) {
  return (
    <>
      <div className="sort-by-product-wrap">
        <div className="sort-by">
          <span>
            <i className="fi-rs-apps"></i>
            Show:
          </span>
        </div>
        <div className="sort-by-dropdown-wrap custom-select">
          <select onChange={selectChange}>
            <option value={5} selected>
              {" "}
              5
            </option>
            <option value={10}>10</option>
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
