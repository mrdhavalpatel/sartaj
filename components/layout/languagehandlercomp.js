import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useLanguage } from "../context/LanguageContext";

const MyComponent = ({ text }) => {
  const intl = useIntl();
  const [translatedText, setTranslatedText] = useState(text); // Native text initially
  const [DLang, setDLang] = useState(intl.locale);
  const { switchLanguage } = useLanguage();
  const router = useRouter();

  // Inject Google Translate Script for browser-based translations
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = function () {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en", // Default page language (English)
            includedLanguages: "en,ja,ne", // Add other languages you need
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false, // Prevent auto-translation on page load
          },
          "google_translate_element"
        );
      };
    };

    addGoogleTranslateScript();
  }, []);

//   const handleLanguageSwitch = (newLanguage) => {
//     console.log("Changing language to:", newLanguage);

//     if (newLanguage === "eng" || newLanguage === "jp") {
//       switchLanguage(newLanguage); // Updates language in context
//       setDLang(newLanguage); // Set state for local language
//       setTranslatedText(text); // Reset to original/native text
//       updateUrlForNativeLanguages(newLanguage); // Update the URL
//     } else {
//       // For other languages, use Google Translate
//       setDLang(newLanguage);

//       // Check if Google Translate dropdown exists
//       const googleTranslateDropdown = document.querySelector(".goog-te-combo");
//       console.log("dfdf");
//       console.log(googleTranslateDropdown);
//       if (googleTranslateDropdown) {
//         console.log(
//           "Google Translate dropdown found. Changing language to:",
//           newLanguage
//         );
//         googleTranslateDropdown.value = newLanguage;
//         googleTranslateDropdown.dispatchEvent(new Event("change"));
//       } else {
//         setDLang(newLanguage);
//         const googleTranslateDropdown = document.querySelector(".goog-te-combo");
    
//         if (googleTranslateDropdown) {
//           googleTranslateDropdown.value = newLanguage;
//           const changeEvent = new Event("change", { bubbles: true });
//           googleTranslateDropdown.dispatchEvent(changeEvent);
          
//           // Trigger Google Translate manually
//           if (window.google) {
//             window.google.translate.TranslateElement.getInstance().setEnabled(true);
//           }
//         } else {
//           console.error("Google Translate dropdown not found.");
//         }
//       }
//     }
//   };

const handleLanguageSwitch = (newLanguage) => {
    console.log("Attempting to change language to:", newLanguage);
    setDLang(newLanguage);
  
    const googleTranslateDropdown = document.querySelector(".goog-te-combo");
  
    if (newLanguage === "eng" || newLanguage === "jp") {
      // Handle native translations
      switchLanguage(newLanguage);
      setTranslatedText(text);
      updateUrlForNativeLanguages(newLanguage);
    } else {
      // Wait for dropdown to be available
      const checkDropdown = setInterval(() => {
        const dropdown = document.querySelector(".goog-te-combo");
        if (dropdown) {
          clearInterval(checkDropdown);
          console.log("Google Translate dropdown found. Changing language to:", newLanguage);
          dropdown.value = newLanguage;
          dropdown.dispatchEvent(new Event("change"));
          console.log("Google Translate change event dispatched for:", newLanguage);
        } else {
          console.log("Waiting for Google Translate dropdown...");
        }
      }, 500);
    }
  };
  

  const updateUrlForNativeLanguages = (newLanguage) => {
    const pathWithoutLanguage = router.pathname
      .replace(/^\/(eng|jp)\//, "/")
      .replace("/[...slug]", "");
    var newUrl = `/${newLanguage}/${pathWithoutLanguage}`;
    const currentToken = router.query.token || "";
    const slug = router.query?.slug;

    if (router.pathname.includes("reset-password")) {
      window.location.replace(
        `/${newLanguage}/reset-password?token=${currentToken}`
      );
    } else if (router.pathname.includes("orders")) {
      window.location.replace(`/${newLanguage}/orders/${router?.query?.id}`);
    } else if (router.pathname.includes("fail")) {
      window.location.replace(
        `/${newLanguage}/fail?order_id=${router?.query?.order_id}&name=${router?.query?.name}`
      );
    } else {
      if (slug) newUrl += `/${slug}`;
      window.location.replace(newUrl.replace(/\/\//g, "/"));
    }
  };

  return (
    <>
      <p>{translatedText}</p>

      {/* Dropdown for language selection */}
      <label htmlFor="languageDropdown">
        {intl.formatMessage({ id: "Select Language" })}
      </label>
      <select
        id="languageDropdown"
        onChange={(e) => handleLanguageSwitch(e.target.value)}
        value={DLang}
      >
        <option value="eng">English</option>
        <option value="jp">日本語</option>
        <option value="ne">नेपाली (Google Translate)</option>{" "}
        {/* Nepali option */}
      </select>

      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" ></div>
    </>
  );
};

export default MyComponent;
