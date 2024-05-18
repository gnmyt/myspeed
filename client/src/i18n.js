import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import EnglishFlag from "@/common/languages/en.webp";
import GermanFlag from "@/common/languages/de.webp";
import BulgarianFlag from "@/common/languages/bg.webp";
import ChineseFlag from "@/common/languages/zh.webp";
import DutchFlag from "@/common/languages/nl.webp";
import FranceFlag from "@/common/languages/fr.webp";
import ItalianFlag from "@/common/languages/it.webp";
import PortugueseBrazilFlag from "@/common/languages/br.webp";
import RussianFlag from "@/common/languages/ru.webp";
import SpanishFlag from "@/common/languages/es.webp";
import TurkishFlag from "@/common/languages/tr.webp";

if (localStorage.getItem('language') === null)
    localStorage.setItem('language', navigator.language.split('-')[0]);

export const languages = [
    {name: 'English', code: 'en', flag: EnglishFlag},
    {name: 'Deutsch', code: 'de', flag: GermanFlag},
    {name: 'Български', code: 'bg', flag: BulgarianFlag},
    {name: '中文', code: 'zh', flag: ChineseFlag},
    {name: 'Nederlands', code: 'nl', flag: DutchFlag},
    {name: 'Français', code: 'fr', flag: FranceFlag},
    {name: 'Italiano', code: 'it', flag: ItalianFlag},
    {name: 'Português do Brasil', code: 'pt', flag: PortugueseBrazilFlag},
    {name: 'Русский', code: 'ru', flag: RussianFlag},
    {name: 'Español', code: 'es', flag: SpanishFlag},
    {name: 'Türkçe', code: 'tr', flag: TurkishFlag}
]

i18n.use(initReactI18next).use(LanguageDetector).use(HttpApi).init({
    supportedLngs: languages.map(lang => lang.code),
    fallbackLng: 'en',
    backend: {
        loadPath: '/assets/locales/{{lng}}.json'
    },
    detection: {
        order: ['localStorage'],
        lookupLocalStorage: 'language'
    }
});

export default i18n;