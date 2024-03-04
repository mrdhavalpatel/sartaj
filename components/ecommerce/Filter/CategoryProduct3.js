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
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleYesClick = () => {
    closeModal();

    selectedEvent.preventDefault();
    // removeSearchTerm();
    updateProductCategory(selectedItem.name);
//    console.log(window.location.pathname);
    router.push({
      pathname: `${
        intl.locale === "eng"
          ? selectedItem.seo_en.replace("/eng", "")
          : selectedItem.seo_ja.replace("/jp", "")
      }`,
    });
  };
  const router = useRouter();
  const intl = useIntl();

  // const removeSearchTerm = () => {
  //     router.push({
  //         pathname: "/products",
  //     });
  // };

  const selectCategory = (e, item) => {
    console.log("e" , e , "item" , item)
    if (item.id == 66 )
    {
      setIsModalOpen(true)
      setSelectedItem(item)
      setSelectedEvent(e)
 
      console.log("age verify required before open this cat")
    }else {
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
    }
 
  };

  return (
    <>
      <ul className="end">
      <Modal isOpen={isModalOpen} onClose={closeModal} onYesClick={handleYesClick} />
        {data?.map((Item) => {
          return (
            <li key={Item?.id} onClick={(e) => selectCategory(e, Item)}>
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
