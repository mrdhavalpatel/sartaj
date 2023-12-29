import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ApiCall } from "../../lib/other/other";
import { useIntl } from "react-intl";
const Search = () => {
  const intl = useIntl();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesValue, setCategoriesValue] = useState("");
  const [productsSuggestions, setProductsSuggestions] = useState([]);
  const router = useRouter();

  const getAllCategories = async () => {
    const request = await ApiCall("get", intl, "categories");
    const allCategories = await request;
    setCategories(allCategories?.data);
  };

  const handleInput = async () => {
    let payload = {
      category_id: categoriesValue,
      search: searchTerm,
    };
    let res = await ApiCall("post", intl, "products/all", payload);
    setProductsSuggestions(res?.data?.products);
    return res;
  };

  useEffect(() => {
    if (searchTerm.length > 0) {
      handleInput();
    }
  }, [categoriesValue, searchTerm]);

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <>
      <form
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <select
          className="select-active"
          value={categoriesValue}
          onChange={(e) => {
            setCategoriesValue(e.target.value);
          }}
          style={{
            marginRight: "10px",
            padding: "8px",
            borderRadius: "4px",
          }}
        >
          <option value="">
            {intl.formatMessage({ id: "All Categories" })}
          </option>
          {categories?.map((itm) => (
            <option key={itm.id} value={itm.id}>
              {itm.name}
            </option>
          ))}
        </select>
        {console.log("search =====>",searchTerm)}
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          placeholder={intl.formatMessage({ id: "Search" })}
          style={{
            padding: "8px",
            borderRadius: "4px",
          }}
        />
        {searchTerm?.length > 0 && (
          <ul
            style={{
              position: "absolute",
              listStyle: "none",
              padding: "0",
              margin: "0",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              borderRadius: "4px",
              backgroundColor: "rgba(255, 255, 255, 1)", // Set to white with full opacity
              width: "100%",
              top: "52px",
              zIndex: 999,
            }}
          >
            {productsSuggestions?.map((result, index) => (
              <li
                key={index}
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #ddd",
                  cursor: "pointer",
                }}
              >
                <a
                  href={`/${
                    intl.locale == "eng" ? result?.seo_en : result?.seo_ja
                  }`}
                >
                  {result?.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </form>
    </>
  );
};

export default Search;
