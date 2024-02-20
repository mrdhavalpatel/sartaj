import { useRouter } from "next/router";
import { connect } from "react-redux";
import { updateProductCategory } from "../../../redux/action/productFiltersAction";
import { translatedItemDetails } from "../../../util/util";
import { useIntl } from "react-intl";

const CategoryProduct3 = ({ updateProductCategory, data }) => {
  const router = useRouter();
  const intl = useIntl();

  // const removeSearchTerm = () => {
  //     router.push({
  //         pathname: "/products",
  //     });
  // };

  const selectCategory = (e, item) => {
    e.preventDefault();
    // removeSearchTerm();
    updateProductCategory(item?.name);
//    console.log(window.location.pathname);
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
      <ul className="end">
        {data?.map((Item) => {
          return (
            <li onClick={(e) => selectCategory(e, Item)}>
              <a>
                <img src={Item?.image} alt="nest" />
                <span
                  dangerouslySetInnerHTML={{
                    __html: translatedItemDetails("name", intl, Item),
                  }}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default connect(null, { updateProductCategory })(CategoryProduct3);
