import common from "./en/common.json";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

export const defaultNS = "common";

export const resources = {
  en: {
    common,
  },
};

i18next.use(initReactI18next).init({
  lng: "en", // if you're using a language detector, do not define the lng option
  debug: true,
  resources,
  defaultNS,
});
