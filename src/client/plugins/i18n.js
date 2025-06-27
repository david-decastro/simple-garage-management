import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

const savedLanguage = localStorage.getItem("language") || "es";

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: savedLanguage,
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath:
        import.meta.env.VITE_APP_ENV === "dev"
          ? "/locales/{{lng}}/messages.json"
          : "/locales/{{lng}}/messages.json",
    },
  });

export default i18n;
