import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="main-container flex flex-col items-center text-primary">
      <div className="w-full md:max-w-6xl bg-white p-6 rounded-xl">
        <div className="text-center">
          <h1 className="text-5xl font-bold">{t("common.not-found.title")}</h1>
        </div>
        <div className="px-4 mt-4 text-center">
          <p>{t("common.not-found.message")}</p>
          <p className="my-4 p-4 border-2 rounded-xl">
            {
              'Le dice la maestra a Jaimito: "Jaimito, ¿cómo se dice en inglés el gato se cayó al agua y se ahogó?". "Fácil profe, se dice \'The cat cataplum in the water gluglu no more miau miau"'
            }
          </p>
          <button
            className="bg-blue-400 border-0 focus:outline-0 mt-1"
            onClick={() => navigate("/")}
          >
            {t("common.not-found.button")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
