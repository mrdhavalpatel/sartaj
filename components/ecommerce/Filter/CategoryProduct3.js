import { useRouter } from "next/router";
import { connect } from "react-redux";
import { updateProductCategory } from "../../../redux/action/productFiltersAction";

const CategoryProduct3 = ({ updateProductCategory, data }) => {
  const router = useRouter();

  // const removeSearchTerm = () => {
  //     router.push({
  //         pathname: "/products",
  //     });
  // };

  const selectCategory = (e, category, catId) => {
    e.preventDefault();
    // removeSearchTerm();
    updateProductCategory(category);
    router.push({
      pathname: "/products",
      query: {
        cat: category,
        catId: catId,
      },
    });
  };

  return (
    <>
      <ul className="end">
        {data?.map((Item) => {
          return (
            <li onClick={(e) => selectCategory(e, Item?.name, Item?.id)}>
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

export default connect(null, { updateProductCategory })(CategoryProduct3);
