import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ApiCall } from "../../lib/other/other";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);

  const router = useRouter();

  const handleSearch = () => {
    router.push({
      pathname: "/products",
      query: {
        search: searchTerm,
      },
    });
    setSearchTerm("");
  };
  const getAllCategories = async () => {
    const request = await ApiCall("get", "categories");
    const allCategories = await request;
    setCategories(allCategories?.data);
  };
  const handleInput = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };
  useEffect(() => {
    getAllCategories();
  }, []);
  return (
    <>
      <form>
        <select className="select-active">
          <option>All Categories</option>
          {categories?.map((itm) => {
            return <option>{itm?.name}</option>;
          })}
        </select>
        <input
          value={searchTerm}
          onKeyDown={handleInput}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          placeholder="Search"
        />
      </form>
    </>
  );
};

export default Search;
