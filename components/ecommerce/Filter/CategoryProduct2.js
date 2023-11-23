import { useRouter } from "next/router";
import { connect } from "react-redux";
import { updateProductCategory } from "../../../redux/action/productFiltersAction";

const CategoryProduct2 = ({ updateProductCategory, data }) => {
  const router = useRouter();

  // const removeSearchTerm = () => {
  //     router.push({
  //         pathname: "/products",
  //     });
  // };

  const selectCategory = (e, category) => {
    e.preventDefault();
    // removeSearchTerm();
    updateProductCategory(category);
    router.push({
      pathname: "/products",
      query: {
        cat: category, //
      },
    });
  };
  return (
    <>
      <ul>
        {data?.map((Item) => {
          return (
            <li onClick={(e) => selectCategory(e, Item?.name)}>
              <a>
                <img src={Item?.image} alt="nest" />
                {Item?.name}
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default connect(null, { updateProductCategory })(CategoryProduct2);
