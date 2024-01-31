import { useRouter } from "next/router";
import { connect } from "react-redux";
import { updateProductCategory } from "../../../redux/action/productFiltersAction";
import { useEffect, useState } from "react";
import { ApiCall } from "../../../lib/other/other";
import { useIntl } from "react-intl";

const CategoryProduct = ({ updateProductCategory }) => {
  const router = useRouter();
  const intl = useIntl();
  const [categories, setCategories] = useState([]);

  const getAllCategories = async () => {
    const request = await ApiCall("get", intl, "categories");
    const allCategories = await request;

    setCategories(allCategories?.data);
  };
  const selectCategory = (e, item) => {
    e.preventDefault();
    // removeSearchTerm();
    updateProductCategory(item?.name);
    console.log(window.location.pathname);
    router.push({
      pathname: `${
        intl.locale === "eng"
          ? item.seo_en.replace("/eng", "")
          : item.seo_ja.replace("/jp", "")
      }`,
    });
  };
  useEffect(() => {
    getAllCategories();
  }, []);
  return (
    <>
      <ul>
        <li onClick={(e) => selectCategory(e, "")}>
          <a>All</a>
        </li>
        {categories?.map((Itm) => {
          return (
            <li onClick={(e) => selectCategory(e, Itm)}>
              <a>
                <img src={Itm?.image} alt="nest" />
                <span dangerouslySetInnerHTML={{ __html: Itm?.name }} />
              </a>
              <span className="count">{Itm?.total_produts}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default connect(null, { updateProductCategory })(CategoryProduct);
