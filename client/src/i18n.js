import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

await i18n.use(initReactI18next).use(LanguageDetector).use(HttpApi).init({
    supportedLngs: ['en', 'de'],
    fallbackLng: 'en',
    backend: {
        loadPath: '/locales/{{lng}}.json'
    },
    detection: {
        order: ['localStorage', 'htmlTag'],
        lookupLocalStorage: 'language'
    }
});

export default i18n;