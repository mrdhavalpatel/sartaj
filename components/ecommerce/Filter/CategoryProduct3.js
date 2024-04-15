import { useRouter } from "next/router";
import { connect } from "react-redux";
import { updateProductCategory } from "../../../redux/action/productFiltersAction";
import { translatedItemDetails } from "../../../util/util";
import { useIntl } from "react-intl";
import { useState } from "react";
import Modal from "../../elements/ModalAlcohole";

const CategoryProduct3 = ({ updateProductCategory, data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  // Use an object to manage subcategory visibility and arrow rotation state
  const [toggle,setToggle]=useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [arrowRotations, setArrowRotations] = useState(
    data?.reduce((acc, item) => ({ ...acc, [item.id]: false }), {}) || {}
  );
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleYesClick = () => {
    closeModal();

    selectedEvent.preventDefault();
    updateProductCategory(selectedItem.name);
    router.push({
      pathname: `${intl.locale === "eng"
          ? selectedItem.seo_en.replace("/eng", "")
          : selectedItem.seo_ja.replace("/jp", "")
        }`,
    });
  };

  const router = useRouter();
  const intl = useIntl();

  const selectCategory = (e, item) => {
    if (item.id === 66) {
      setIsModalOpen(true);
      setSelectedItem(item);
      setSelectedEvent(e);
    } else {
      e.preventDefault();
      updateProductCategory(item?.name);
      router.push({
        pathname: `${intl.locale === "eng"
            ? item.seo_en.replace("/eng", "")
            : selectedItem.seo_ja.replace("/jp", "")
          }`,
      });
    }

    // Update showSubCategories state for the clicked category
    // setShowSubCategories({
    //   ...showSubCategories,
    //   [item.id]: {
    //     visible: !showSubCategories[item.id].visible,
    //     rotated: !showSubCategories[item.id].rotated, // Toggle arrow rotation
    //   },
    // });
  };
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
      <ul className="end">
        <Modal isOpen={isModalOpen} onClose={closeModal} onYesClick={handleYesClick} />
        {data?.map((Item) => {
 

          return (
            <li key={Item?.id} className="main-cat" >
              <div>
              <a onClick={(e) => selectCategory(e, Item)}>
                <img src={Item?.image} alt="nest" />
                <span
                  dangerouslySetInnerHTML={{
                    __html: translatedItemDetails("name", intl, Item),
                  }}
                />

              </a>
              {Item.sub_categories && Item.sub_categories.length > 0 && (
                <i
                className={`fi-rs-angle-${arrowRotations[Item.id] ? 'up' : 'down'}`}
                  style={{ zIndex: 99999 }}
                  onClick={() => {toggleSubCategories(Item.id)}}
                ></i> // Use fi-rs-angle-down class with rotation
              )}
               </div>
              {Item.sub_categories &&
              Item.sub_categories.length > 0 &&
              selectedCategoryId === Item.id && (
                <ul className={"sub-cat"}>
                  {/* Map through subcategories */}
                  {Item.sub_categories.map((subCategory) => (
                    <li key={subCategory.id}>
                      {/* Add click handler to navigate to subcategory */}
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          updateProductCategory(subCategory.name);
                          router.push({
                            pathname: `${intl.locale === "eng"
                                ? subCategory.seo_en.replace("/eng", "")
                                : subCategory.seo_ja.replace("/jp", "")
                              }`,
                          });
                        }}
                      >
                        {/* Display subcategory name */}
                        {subCategory.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );

        })}
      </ul>
    </>
  );
};

export default connect(null, { updateProductCategory })(CategoryProduct3);
