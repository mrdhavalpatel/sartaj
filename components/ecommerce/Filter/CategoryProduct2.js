import { useRouter } from "next/router";
import { connect } from "react-redux";
import { updateProductCategory } from "../../../redux/action/productFiltersAction";

const CategoryProduct2 = ({ updateProductCategory, data }) => {
  const router = useRouter();

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
  return (
    <>
      <ul>
        {data?.map((Item) => {
          return (
            <li onClick={(e) => selectCategory(e, Itm)}>
              <a>
                <img src={Item?.image} alt="nest" />
                <span dangerouslySetInnerHTML={{ __html: Item?.name }} />
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default connect(null, { updateProductCategory })(CategoryProduct2);
