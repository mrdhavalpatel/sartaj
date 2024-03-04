import { useRouter } from "next/router";
import { connect } from "react-redux";
import { updateProductCategory } from "../../../redux/action/productFiltersAction";
import { useEffect, useState } from "react";
import { ApiCall } from "../../../lib/other/other";
import { useIntl } from "react-intl";
import { translatedItemDetails } from "../../../util/util";
import Modal from "../../elements/ModalAlcohole";


const CategoryProduct = ({ updateProductCategory }) => {
  const router = useRouter();
  const intl = useIntl();
  const [categories, setCategories] = useState([]);
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
  const getAllCategories = async () => {
    const request = await ApiCall("get", intl, "categories");
    const allCategories = await request;

    setCategories(allCategories?.data);
  };
  const selectCategory = (e, item) => {
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
  useEffect(() => {
    getAllCategories();
  }, []);
  return (
    <>
      <ul>
      <Modal isOpen={isModalOpen} onClose={closeModal} onYesClick={handleYesClick} />

        {categories?.map((Itm) => {
          return (
            <li onClick={(e) => selectCategory(e, Itm)}>
              <a>
                <img src={Itm?.image} alt="nest" />
                <span
                  dangerouslySetInnerHTML={{
                    __html: translatedItemDetails("name", intl, Itm),
                  }}
                />
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
