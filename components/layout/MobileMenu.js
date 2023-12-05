import Link from "next/link";
import { useEffect, useState } from "react";
import useClickOutside from "../../util/outsideClick";
import { ApiCall } from "../../lib/other/other";
import { updateProductCategory } from "../../redux/action/productFiltersAction";
import { connect } from "react-redux";
import { useRouter } from "next/router";

const MobileMenu = ({ updateProductCategory, isToggled, toggleClick }) => {
  const [isActive, setIsActive] = useState({
    status: false,
    key: "",
  });
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
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

  let domNode = useClickOutside(() => {
    setIsActive({
      status: false,
    });
  });
  const getAllCategories = async () => {
    const request = await ApiCall("get", "categories");
    const allCategories = await request;
    setCategories(allCategories?.data);
  };
  const selectCategory = (e, category) => {
    e.preventDefault();
    // removeSearchTerm();
    updateProductCategory(category);
    router.push({
      pathname: "/products",
      query: {
        catId: category, //
      },
    });
  };
  useEffect(() => {
    getAllCategories();
  }, []);
  return (
    <>
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
            <div className="mobile-search search-style-3 mobile-header-border">
              <form action="#">
                <input type="text" placeholder="Search for items…" />
                <button type="submit">
                  <i className="fi-rs-search"></i>
                </button>
              </form>
            </div>
            <div className="mobile-menu-wrap mobile-header-border">
              <div className="main-categori-wrap mobile-header-border">
                <Link
                  href="#"
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
                        <li onClick={(e) => selectCategory(e, itm?.id)}>
                          <Link href="/shop-fullwidth">
                            <i className="evara-font-dress"></i>
                            {itm?.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <nav>
                <ul className="mobile-menu" ref={domNode}>
                  <li
                    className={
                      isActive.key == 1
                        ? "menu-item-has-children active"
                        : "menu-item-has-children"
                    }
                  >
                    {/* <span
                      className="menu-expand"
                      onClick={() => handleToggle(1)}
                    >
                      <i className="fi-rs-angle-small-down"></i>
                    </span> */}
                    <Link href="/">Home</Link>
                    {/* <ul className={isActive.key == 1 ? "dropdown" : "d-none"}>
                                            <li>
                                                <Link href="/index">Home 1</Link>
                                            </li>
                                            <li>
                                                <Link href="/index-2">Home 2</Link>
                                            </li>
                                            <li>
                                                <Link href="/index-3">Home 3</Link>
                                            </li>
                                            <li>
                                                <Link href="/index-4">Home 4</Link>
                                            </li>
                                        </ul> */}
                  </li>
                  <li
                    className={
                      isActive.key == 2
                        ? "menu-item-has-children active"
                        : "menu-item-has-children"
                    }
                  >
                    {/* <span
                      className="menu-expand"
                      onClick={() => handleToggle(2)}
                    >
                      <i className="fi-rs-angle-small-down"></i>
                    </span> */}
                    <Link href="/shop-fullwidth">shop</Link>
                    {/* <ul className={isActive.key == 2 ? "dropdown" : "d-none"}>
                      <li>
                        <Link href="/shop-fullwidth">
                          Shop Grid – Right Sidebar
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop-grid-left">
                          Shop Grid – Left Sidebar
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop-list-right">
                          Shop List – Right Sidebar
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop-list-left">
                          Shop List – Left Sidebar
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop-fullwidth">Shop - Wide</Link>
                      </li>
                      <li>
                        <Link href="/shop-filter">Shop – Filter</Link>
                      </li>
                      <li>
                        <Link href="/shop-wishlist">Shop – Wishlist</Link>
                      </li>
                      <li>
                        <Link href="/shop-cart">Shop – Cart</Link>
                      </li>
                      <li>
                        <Link href="/shop-checkout">Shop – Checkout</Link>
                      </li>
                      <li>
                        <Link href="/shop-compare">Shop – Compare</Link>
                      </li>
                    </ul> */}
                  </li>
                  {/* <li
                    className={
                      isActive.key == 3
                        ? "menu-item-has-children active"
                        : "menu-item-has-children"
                    }
                  >
                    <span
                      className="menu-expand"
                      onClick={() => handleToggle(3)}
                    >
                      <i className="fi-rs-angle-small-down"></i>
                    </span>
                    <Link href="#">Mega menu</Link>
                    <ul className={isActive.key == 3 ? "dropdown" : "d-none"}>
                      <li className="menu-item-has-children">
                        <span className="menu-expand"></span>
                        <Link href="#">Women's Fashion</Link>
                        <ul className="dropdown">
                          <li>
                            <Link href="/shop-product-right">Dresses</Link>
                          </li>
                          <li>
                            <Link href="/shop-product-right">
                              Blouses & Shirts
                            </Link>
                          </li>
                          <li>
                            <Link href="/shop-product-right">
                              Hoodies & Sweatshirts
                            </Link>
                          </li>
                          <li>
                            <Link href="/shop-product-right">Women's Sets</Link>
                          </li>
                        </ul>
                      </li>
                      <li className="menu-item-has-children">
                        <span className="menu-expand"></span>
                        <Link href="#">Men's Fashion</Link>
                        <ul className="dropdown">
                          <li>
                            <Link href="/shop-product-right">Jackets</Link>
                          </li>
                          <li>
                            <Link href="/shop-product-right">
                              Casual Faux Leather
                            </Link>
                          </li>
                          <li>
                            <Link href="/shop-product-right">
                              Genuine Leather
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li className="menu-item-has-children">
                        <span className="menu-expand"></span>
                        <Link href="#">Technology</Link>
                        <ul className="dropdown">
                          <li>
                            <Link href="/shop-product-right">
                              Gaming Laptops
                            </Link>
                          </li>
                          <li>
                            <Link href="/shop-product-right">
                              Ultraslim Laptops
                            </Link>
                          </li>
                          <li>
                            <Link href="/shop-product-right">Tablets</Link>
                          </li>
                          <li>
                            <Link href="/shop-product-right">
                              Laptop Accessories
                            </Link>
                          </li>
                          <li>
                            <Link href="/shop-product-right">
                              Tablet Accessories
                            </Link>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li> */}
                  {/* <li
                    className={
                      isActive.key == 4
                        ? "menu-item-has-children active"
                        : "menu-item-has-children"
                    }
                  >
                    <span
                      className="menu-expand"
                      onClick={() => handleToggle(4)}
                    >
                      <i className="fi-rs-angle-small-down"></i>
                    </span>
                    <Link href="/blog-category-fullwidth">Blog</Link>
                    <ul className={isActive.key == 4 ? "dropdown" : "d-none"}>
                      <li>
                        <Link href="/blog-category-grid">
                          Blog Category Grid
                        </Link>
                      </li>
                      <li>
                        <Link href="/blog-category-list">
                          Blog Category List
                        </Link>
                      </li>
                      <li>
                        <Link href="/blog-category-big">Blog Category Big</Link>
                      </li>
                      <li>
                        <Link href="/blog-category-fullwidth">
                          Blog Category Wide
                        </Link>
                      </li>
                      <li className="menu-item-has-children">
                        <span className="menu-expand"></span>
                        <Link href="#">Single Product Layout</Link>
                        <ul className="dropdown">
                          <li>
                            <Link href="/blog-post-left">Left Sidebar</Link>
                          </li>
                          <li>
                            <Link href="/blog-post-right">Right Sidebar</Link>
                          </li>
                          <li>
                            <Link href="/blog-post-fullwidth">No Sidebar</Link>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li> */}
                  {/* <li
                    className={
                      isActive.key == 5
                        ? "menu-item-has-children active"
                        : "menu-item-has-children"
                    }
                  >
                    <span
                      className="menu-expand"
                      onClick={() => handleToggle(5)}
                    >
                      <i className="fi-rs-angle-small-down"></i>
                    </span>
                    <Link href="#">Pages</Link>
                    <ul className={isActive.key == 5 ? "dropdown" : "d-none"}>
                      <li>
                        <Link href="/page-about">About Us</Link>
                      </li>
                      <li>
                        <Link href="/page-contact">Contact</Link>
                      </li>
                      <li>
                        <Link href="/page-account">My Account</Link>
                      </li>
                      <li>
                        <Link href="/page-login-register">login/register</Link>
                      </li>
                      <li>
                        <Link href="/page-purchase-guide">Purchase Guide</Link>
                      </li>
                      <li>
                        <Link href="/page-privacy-policy">Privacy Policy</Link>
                      </li>
                      <li>
                        <Link href="/page-terms">Terms of Service</Link>
                      </li>
                      <li>
                        <Link href="/page-404">404 Page</Link>
                      </li>
                    </ul>
                  </li> */}
                  <li
                    className={
                      isActive.key == 6
                        ? "menu-item-has-children active"
                        : "menu-item-has-children"
                    }
                  >
                    {/* <span
                      className="menu-expand"
                      onClick={() => handleToggle(6)}
                    >
                      <i className="fi-rs-angle-small-down"></i>
                    </span> */}
                    <Link href="/page-contact">Contact</Link>
                    {/* <ul className={isActive.key == 6 ? "dropdown" : "d-none"}>
                      <li>
                        <Link href="#">English</Link>
                      </li>
                      <li>
                        <Link href="#">French</Link>
                      </li>
                      <li>
                        <Link href="#">German</Link>
                      </li>
                      <li>
                        <Link href="#">Spanish</Link>
                      </li>
                    </ul> */}
                  </li>
                  <li
                    className={
                      isActive.key == 5
                        ? "menu-item-has-children active"
                        : "menu-item-has-children"
                    }
                  >
                    <Link href="/page-purchase-guide">
                      Delivery Information
                    </Link>
                  </li>
                  <li
                    className={
                      isActive.key == 3
                        ? "menu-item-has-children active"
                        : "menu-item-has-children"
                    }
                  >
                    <Link href="/page-faqs">FAQs</Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="mobile-header-info-wrap mobile-header-border">
              <div className="single-mobile-header-info mt-30">
                <Link href="/page-contact">Our location</Link>
              </div>
              <div className="single-mobile-header-info">
                <Link href="/page-register">Sign Up</Link>
              </div>
              <div className="single-mobile-header-info">
                <Link href="/page-login">Log In</Link>
              </div>
              <div className="single-mobile-header-info">
                <Link href="#">(+01) - 2345 - 6789</Link>
              </div>
            </div>
            <div className="mobile-social-icon">
              <h5 className="mb-15 text-grey-4">Follow Us</h5>
              <Link href="#">
                <img
                  src="/assets/imgs/theme/icons/icon-facebook.svg"
                  alt="nest"
                />
              </Link>
              <Link href="#">
                <img
                  src="/assets/imgs/theme/icons/icon-twitter.svg"
                  alt="nest"
                />
              </Link>
              <Link href="#">
                <img
                  src="/assets/imgs/theme/icons/icon-instagram.svg"
                  alt="nest"
                />
              </Link>
              <Link href="#">
                <img
                  src="/assets/imgs/theme/icons/icon-pinterest.svg"
                  alt="nest"
                />
              </Link>
              <Link href="#">
                <img
                  src="/assets/imgs/theme/icons/icon-youtube.svg"
                  alt="nest"
                />
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
