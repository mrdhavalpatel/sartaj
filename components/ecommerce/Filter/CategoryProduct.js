import { useRouter } from "next/router";
import { connect } from "react-redux";
import { updateProductCategory } from "../../../redux/action/productFiltersAction";
import { useEffect, useState } from "react";
import { ApiCall } from "../../../lib/other/other";
import { useIntl } from "react-intl";
import { translatedItemDetails } from "../../../util/util";
import Modal from "../../elements/ModalAlcohole";

const CategoryProduct = ({ updateProductCategory, isCollapsed }) => {
  const router = useRouter();
  const intl = useIntl();
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [toggle,setToggle]=useState(false)

  const [collapsed, setCollapsed] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [arrowRotations, setArrowRotations] = useState(
    categories?.reduce((acc, item) => ({ ...acc, [item.id]: false }), {}) || {}
  );
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleYesClick = () => {
    closeModal();
    selectedEvent.preventDefault();
    updateProductCategory(selectedItem.name);
    router.push({
      pathname: `${
        intl.locale === "eng"
          ? selectedItem.seo_en.replace("/eng", "")
          : selectedItem.seo_ja.replace("/jp", "")
      }`,
    });
  };

  const getAllCategories = async () => {
    const request = await ApiCall("get", intl, "categories");
    const allCategories = await request;
    setCategories(allCategories?.data);
  };

  const selectCategory = (e, item) => {
    if (item.id === 66) {
      setIsModalOpen(true);
      setSelectedItem(item);
      setSelectedEvent(e);
      console.log("age verify required before opening this category");
    } else {
      e.preventDefault();
      updateProductCategory(item?.name);
      router.push({
        pathname: `${
          intl.locale === "eng"
            ? item.seo_en.replace("/eng", "")
            : item.seo_ja.replace("/jp", "")
        }`,
      });
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);
  const toggleSubCategories = (itemId) => {
    setSelectedCategoryId((prevId) => (prevId === itemId ? null : itemId));
    setToggle(!toggle)
    setArrowRotations((prevRotations) => ({
      ...prevRotations,
      [itemId]: !prevRotations[itemId],
    }));
  };
  return (
    <>
      <h5 className="section-title style-1 mb-30" onClick={toggleCollapse}>
        {intl.formatMessage({ id: "Category" })}
        {collapsed ? (
          <i class="fi-rs-angle-down"></i>
        ) : (
          <i class="fi-rs-angle-up"></i>
        )}
      </h5>
      {!collapsed && (
        <ul className="end">
          <Modal isOpen={isModalOpen} onClose={closeModal} onYesClick={handleYesClick} />
          {categories?.map((category) => {
            return (
              <li key={category.id} className="main-cat">
                <div style={{flexDirection:"row" , display:"flex" , justifyContent:"space-between" , alignItems:"center" , alignContent:"center"}}>
                <a onClick={(e) => selectCategory(e, category)}>
                  <img src={category?.image} alt="nest" />
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translatedItemDetails("name", intl, category),
                    }}
                  />
                </a>
                <span className="count">{category?.total_produts}</span>
                {category.sub_categories && category.sub_categories.length > 0 && (
                <i
                className={`fi-rs-angle-${arrowRotations[category.id] ? 'up' : 'down'}`}
                  style={{ marginLeft:"7px" }}
                  onClick={() => {toggleSubCategories(category.id)}}
                ></i> // Use fi-rs-angle-down class with rotation
              )}
                </div>
                 {category.sub_categories && category.sub_categories.length > 0 
                &&selectedCategoryId === category.id   && (
                  <ul className="sub-cat">
                    {category.sub_categories.map((subcategory) => (
                      <li key={subcategory.id}>
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            updateProductCategory(subcategory.name);
                            router.push({
                              pathname: `${
                                intl.locale === "eng"
                                  ? subcategory.seo_en.replace("/eng", "")
                                  : subcategory.seo_ja.replace("/jp", "")
                              }`,
                            });
                          }}
                          style={{justifyContent:"space-between"}}
                        >
                          {subcategory.name}
                          <span className="count">{subcategory?.total_produts}</span>
                        </a>
                
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default connect(null, { updateProductCategory })(CategoryProduct);
