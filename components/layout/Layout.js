import React, { useState } from "react";
import Head from "next/head";
import Breadcrumb from "./Breadcrumb";
import Footer from "./Footer";
import Header from "./Header";
import MobileMenu from "./MobileMenu";

const Layout = ({
    children,
    parent,
    sub,
    subChild,
    noBreadcrumb,
    headerStyle,
}) => {
    const [isToggled, setToggled] = useState(false);
    const toggleClick = () => {
        setToggled(!isToggled);
        isToggled
            ? document
                  .querySelector("body")
                  .classList.remove("mobile-menu-active")
            : document
                  .querySelector("body")
                  .classList.add("mobile-menu-active");
    };

    return (
        <>
            <Head>
                <title>Sartaj Foods Japan :: The largest Online Indian Grocery Store in japan with a huge variety of indian spices and international brands in japan.</title>
                <meta name="description" content="SartajFoods Japan has all Indian grocery products, spices,  with the best quality and food products in Japan. Sartaj Co. ltd location 563-0043, 2 Chome-10-23 Koda, Ikeda, Osaka.  Contact Details of Food Store in Japan: 072-751-1975 Buy Online at: www.sartajfoods.jp. Sartaj Foods Japan also offers a large variety of cosmetics and beauty products in Japan. All Products available at Sartaj foods japan are 100% Veg and suitable for vegetarians to consume. SartajFoods offers delivery all over the region of Japan.  Sartaj Co. Ltd is an authenticate importer of  International brands like Vadilal, MDH, Haldiram Nagpur (Moplleez), Dabur Herbal, Basmati India Gate, Haldiram, Britannia, Mother's Recipe, Santa G, and other beauty brands like- Dabur, Khaadi Natural, Vatika, Dermoviva and Himalaya in japan. Vegan products are also available at SartajFoods in Japan. Order online and free delivery on orders worth YEN 6500/-. " />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {isToggled && <div className="body-overlay-1" onClick={toggleClick}></div>}

            <Header headerStyle={headerStyle} isToggled={isToggled} toggleClick={toggleClick} />
            <MobileMenu isToggled={isToggled} toggleClick={toggleClick} />
            <main className="main">
                <Breadcrumb parent={parent} sub={sub} subChild={subChild} noBreadcrumb={noBreadcrumb} />
                {children}
            </main>
            <Footer />
        </>
    );
};

export default Layout;
