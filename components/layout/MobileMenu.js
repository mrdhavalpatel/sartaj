import Link from "next/link";
import { useEffect, useState } from "react";
import useClickOutside from "../../util/outsideClick";
import { ApiCall } from "../../lib/other/other";
import { updateProductCategory } from "../../redux/action/productFiltersAction";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { translatedItemDetails } from "../../util/util";
import Search from "../ecommerce/Search";
import Modal from "../elements/ModalAlcohole";

const MobileMenu = ({ updateProductCategory, isToggled, toggleClick }) => {
  const [isActive, setIsActive] = useState({
    status: false,
    key: "",
  });
  const intl = useIntl();
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const router = useRouter();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleToggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  const handleToggle = (key) => {
    if (isActive.key === key) {
      setIsActive({
        status: false,
      });
    } else {
      setIsActive({
        status: true,
        key,
      });
    }
  };
  const handleYesClick = () => {
    closeModal();

    selectedEvent.preventDefault();
    // removeSearchTerm();
    updateProductCategory(selectedItem);
//    console.log(window.location.pathname);
router.push({
  pathname: "/products",
  query: {
    catId: selectedItem, //
  },
});
  };
  const selectCategory = (e, item) => {
    console.log("e" , e , "item" , item)
    if (item == 66 )
    {
      setIsModalOpen(true)
      setSelectedItem(item)
      setSelectedEvent(e)
 
      console.log("age verify required before open this cat")
    }else {
      e.preventDefault();
      // removeSearchTerm();
      updateProductCategory(item);
  //    console.log(window.location.pathname);
  router.push({
        pathname: "/products",
        query: {
          catId: item, //
        },
      });
    }
 
  };
  let domNode = useClickOutside(() => {
    setIsActive({
      status: false,
    });
  });
  const getAllCategories = async () => {
    const request = await ApiCall("get", intl, "categories");
    const allCategories = await request;
    setCategories(allCategories?.data);
  };
  // const selectCategory = (e, category) => {
  //   console.log("e==========>", e , "category========>",category)
  //   e.preventDefault();
  //   // removeSearchTerm();
  //   updateProductCategory(category);
  //   router.push({
  //     pathname: "/products",
  //     query: {
  //       catId: category, //
  //     },
  //   });
  // };
  useEffect(() => {
    getAllCategories();
  }, []);
  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal} onYesClick={handleYesClick} />

      <div
        className={
          isToggled
            ? "mobile-header-active mobile-header-wrapper-style sidebar-visible"
            : "mobile-header-active mobile-header-wrapper-style"
        }
      >
        <div className="mobile-header-wrapper-inner">
          <div className="mobile-header-top">
            <div className="mobile-header-logo">
              <Link href="/">
                <img src="/assets/imgs/theme/logo.svg" alt="logo" />
              </Link>
            </div>

            <div className="mobile-menu-close close-style-wrap close-style-position-inherit">
              <button
                className="close-style search-close"
                onClick={toggleClick}
              >
                <i className="icon-top"></i>
                <i className="icon-bottom"></i>
              </button>
            </div>
          </div>
          <div className="mobile-header-content-area">
            {/* <div className="mobile-search search-style-3 mobile-header-border">
              <form action="#">
                <input type="text" placeholder="Search for items…" />
                <button type="submit">
                  <i className="fi-rs-search"></i>
                </button>
              </form>
            </div> */}
            <div className="mobile-menu-wrap mobile-header-border">
              <div className="main-categori-wrap mobile-header-border">
                <Link
                  href="javascript:"
                  className="categori-button-active-2"
                  onClick={handleToggleMenu}
                >
                  <span className="fi-rs-apps"></span> Browse Categories
                </Link>
                <div
                  className={`categori-dropdown-wrap categori-dropdown-active-small ${
                    isMenuOpen ? "active" : ""
                  }`}
                >
                  <ul>
                    {categories?.map((itm) => {
                      return (
                        <li
                          key={itm?.id}
                          onClick={(e) => selectCategory(e, itm?.id)}
                        >
                          <a >
                            <i className="evara-font-dress"></i>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: translatedItemDetails(
                                  "name",
                                  intl,
                                  itm
                                ),
                              }}
                            />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <nav>
                <ul className="mobile-menu" ref={domNode}>
                  <li>
                    <Link href="/" className="active">
                      {intl.formatMessage({ id: "Home" })}
                    </Link>
                  </li>
                  <li>
                    <Link href="/about-sartaj">
                      {intl.formatMessage({ id: "About" })}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${intl.locale}/shop`}>
                      {intl.formatMessage({ id: "Shop" })}
                    </Link>
                  </li>
                  <li>
                    <Link href="/contacts">
                      {intl.formatMessage({ id: "Contact" })}
                    </Link>
                  </li>
                  <li>
                    <Link href="/delivery_Information">
                      {intl.formatMessage({ id: "Delivery Information" })}
                    </Link>
                  </li>
                  <li>
                    <Link href="/faqs">
                      {intl.formatMessage({ id: "FAQs" })}
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default connect(null, { updateProductCategory })(MobileMenu);

// export default MobileMenu;
