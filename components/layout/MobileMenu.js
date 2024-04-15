import Link from "next/link";
import { useEffect, useState } from "react";
import useClickOutside from "../../util/outsideClick";
import { ApiCall } from "../../lib/other/other";
import { updateProductCategory } from "../../redux/action/productFiltersAction";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { useAuth } from "../context/AuthContext";
import { useDispatch } from "react-redux";
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
  const [toggle, setToggle] = useState(false)

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [collapsed, setCollapsed] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [arrowRotations, setArrowRotations] = useState(
    categories?.reduce((acc, item) => ({ ...acc, [item.id]: false }), {}) || {}
  );
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const router = useRouter();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleToggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  const [isLoggin, setIsLoggin] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      setIsLoggin(true);
    } else {
      setIsLoggin(false);
    }
  }, []);

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
    console.log("e", e, "item", item)
    if (item == 66) {
      setIsModalOpen(true)
      setSelectedItem(item)
      setSelectedEvent(e)

      console.log("age verify required before open this cat")
    } else {
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
    console.log("mobile menu cat" , allCategories.data)
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
                  className={`categori-dropdown-wrap categori-dropdown-active-small ${isMenuOpen ? "active" : ""
                    }`}
                >
                  <ul>
                    {categories?.map((itm) => {
                      return (
                        <li
                          key={itm?.id}
                         
                        >
                          <div>
                            <a  onClick={(e) => selectCategory(e, itm?.id)}>
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
                            
                            {itm?.sub_categories && itm?.sub_categories.length > 0 && (
                              <i
                                className={`fi-rs-angle-${arrowRotations[itm.id] ? 'up' : 'down'}`}
                                onClick={() => { toggleSubCategories(itm.id) }}
                                style={{color:"white" , marginLeft:"10px"}}
                              ></i>
                            )}
                          </div>
                          {itm.sub_categories &&
              itm.sub_categories.length > 0 &&
              selectedCategoryId === itm.id && (
                <ul className={"sub-cat"}>
                  {/* Map through subcategories */}
                  {itm.sub_categories.map((subCategory) => (
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
                </div>
                <span className="fi-rs-angle-small-down"></span>
              </div>

              <nav>
                <ul className="mobile-menu" ref={domNode}>
                  <li>
                    <Link href="/" className="active">
                      <img src="/assets/imgs/menu/home.png" alt="Home" className="menu_icon" />{intl.formatMessage({ id: "Home" })}
                    </Link>
                  </li>
                  <li>
                    <Link href="/about-sartaj">
                      <img src="/assets/imgs/menu/about.png" alt="About" className="menu_icon" />{intl.formatMessage({ id: "About" })}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${intl.locale}/shop`}>
                      <img src="/assets/imgs/menu/shop.png" alt="Shop" className="menu_icon" />{intl.formatMessage({ id: "Shop" })}
                    </Link>
                  </li>
                  <li>
                    <Link href="/contacts">
                      <img src="/assets/imgs/menu/contact.png" alt="Contact" className="menu_icon" />{intl.formatMessage({ id: "Contact" })}
                    </Link>
                  </li>
                  <li>
                    <Link href="/delivery_Information">
                      <img src="/assets/imgs/menu/delivery.png" alt="Delivery Information" className="menu_icon" />{intl.formatMessage({ id: "Delivery Information" })}
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms_conditions">
                      <img src="/assets/imgs/menu/terms.png" alt="Terms" className="menu_icon" />
                      {intl.formatMessage({ id: "Terms" })} &amp;{" "}
                      {intl.formatMessage({ id: "Conditions" })}

                    </Link>
                  </li>
                  <li>
                    <Link href="/faqs">
                      <img src="/assets/imgs/menu/faq.png" alt="FAQs" className="menu_icon" />{intl.formatMessage({ id: "FAQs" })}
                    </Link>
                  </li>
                  {isLoggin ? (
                    <li>
                      <Link
                        href="/sign-in"
                        onClick={() => {
                          localStorage.removeItem("token");
                          logout();
                          dispatch(clearCart());
                        }}
                      >
                        <img src="/assets/imgs/menu/logout.png" alt="logout" className="menu_icon" />{intl.formatMessage({ id: "Sign Out" })}
                      </Link>

                    </li>
                  ) : (
                    <li>
                      <Link href="/sign-in">
                        <img src="/assets/imgs/menu/login.png" alt="login" className="menu_icon" />{intl.formatMessage({ id: "Sign In" })}
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>

            </div>

            <div className="sidemenu_bottom d-flex justify-content-around">
              <Link href="mailto:info@sartajfoods.jp">
                <img src="/assets/imgs/menu/mail.png" alt="Email" className="sidemenu_bottom_icon" />{intl.formatMessage({ id: "Email" })}
              </Link>
              <Link href="tel:+810727511975">
                <img src="/assets/imgs/menu/call.png" alt="FAQs" className="sidemenu_bottom_icon" />{intl.formatMessage({ id: "Phone" })}
              </Link>
              <Link href="https://instagram.com/sartaj_foods_official">
                <img src="/assets/imgs/menu/instagram.png" alt="FAQs" className="sidemenu_bottom_icon" />instagram
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default connect(null, { updateProductCategory })(MobileMenu);

// export default MobileMenu;
