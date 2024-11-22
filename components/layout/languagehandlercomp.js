import { useState, useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useLanguage } from "../context/LanguageContext";

const LanguageSwitcher = ({ text }) => {
    const intl = useIntl();
    const router = useRouter();
    const { switchLanguage } = useLanguage();
    const [translatedText, setTranslatedText] = useState(text);
    const [currentLang, setCurrentLang] = useState(intl.locale);
    const googleTranslateInitialized = useRef(false);

    const LOCAL_LANGUAGES = ["eng", "jp"];
    const GOOGLE_TRANSLATE_LANGUAGES = ["ne", "hi", "bn"];

    // Reset Google Translate when switching to local languages
    const resetGoogleTranslate = () => {
        const frame = document.querySelector('.goog-te-banner-frame');
        if (frame) {
            const reset = document.querySelector('.goog-te-banner-frame').contentWindow.document.querySelector('.goog-te-button button');
            if (reset) {
                reset.click();
            }
        }
    };

    // Initialize Google Translate
    useEffect(() => {
        const initializeGoogleTranslate = () => {
            if (!window.google || !window.google.translate || googleTranslateInitialized.current) {
                return;
            }

            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'eng',
                    includedLanguages: GOOGLE_TRANSLATE_LANGUAGES.join(','),
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                },
                'google_translate_element'
            );
            googleTranslateInitialized.current = true;
        };

        // Add Google Translate Script
        if (!document.querySelector('script[src*="translate.google.com"]')) {
            const script = document.createElement("script");
            script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            
            window.googleTranslateElementInit = initializeGoogleTranslate;
            
            document.body.appendChild(script);
        } else if (window.google && window.google.translate) {
            initializeGoogleTranslate();
        }

        return () => {
            // Cleanup function
            delete window.googleTranslateElementInit;
        };
    }, []);

    // Handle language switch
    const handleLanguageSwitch = async (newLanguage) => {
        console.log("Switching to language:", newLanguage);
        
        if (LOCAL_LANGUAGES.includes(newLanguage)) {
            // If switching to a local language, first reset Google Translate
            if (GOOGLE_TRANSLATE_LANGUAGES.includes(currentLang)) {
                resetGoogleTranslate();
            }
            
            setCurrentLang(newLanguage);
            switchLanguage(newLanguage);
            setTranslatedText(text);
            updateUrlForNativeLanguages(newLanguage);
        } else if (GOOGLE_TRANSLATE_LANGUAGES.includes(newLanguage)) {
            // Wait for Google Translate to be fully initialized
            await waitForGoogleTranslate();
            setCurrentLang(newLanguage);
            translateUsingGoogle(newLanguage);
        }
    };

    // Wait for Google Translate to be initialized
    const waitForGoogleTranslate = () => {
        return new Promise((resolve) => {
            const checkForGoogle = setInterval(() => {
                const dropdown = document.querySelector('.goog-te-combo');
                if (dropdown) {
                    clearInterval(checkForGoogle);
                    resolve();
                }
            }, 100);

            // Timeout after 5 seconds
            setTimeout(() => {
                clearInterval(checkForGoogle);
                resolve();
            }, 5000);
        });
    };

    // Translate using Google Translate
    const translateUsingGoogle = (language) => {
        const dropdown = document.querySelector('.goog-te-combo');
        if (dropdown) {
            dropdown.value = language;
            dropdown.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`Triggered Google Translate for: ${language}`);
        } else {
            console.error("Google Translate dropdown not found");
        }
    };

    // Update URL for native languages
    const updateUrlForNativeLanguages = (newLanguage) => {
        const path = router.pathname.replace(/^\/(eng|jp)\//, "/").replace("/[...slug]", "");
        let newUrl = `/${newLanguage}${path}`;
        const slug = router.query.slug;

        if (slug) {
            newUrl += `/${Array.isArray(slug) ? slug.join('/') : slug}`;
        }
        
        window.location.replace(newUrl.replace(/\/+/g, "/"));
    };

    return (
        <div className="language-switcher">
            <div className="text-content">
                {translatedText}
            </div>

            <div className="language-controls">
                <label htmlFor="languageDropdown" className="language-label">
                    {intl.formatMessage({ id: "Select Language" })}
                </label>
                <select
                    id="languageDropdown"
                    onChange={(e) => handleLanguageSwitch(e.target.value)}
                    value={currentLang}
                    className="language-select"
                >
                    <option value="eng">English</option>
                    <option value="jp">日本語</option>
                </select>

                {/* Hidden Google Translate element */}
                <div id="google_translate_element" style={{ display: 'none' }} />
            </div>
        </div>
    );
};

export default LanguageSwitcher;
