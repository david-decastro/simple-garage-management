import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="main-container flex flex-col items-center">
      <div className="bg-gray-800 bg-opacity-90 p-8 w-full md:w-2/3 rounded-xl text-white">
        <div className="text-center mb-12">
          <p className="text-5xl font-bold">{t("home.title")}</p>
          <p className="text-lg">{t("home.subtitle")}</p>
          <img
            src="/kananos_garage_logo.webp"
            alt="Simple Garage Management"
            className="h-45 w-45 rounded-full object-cover mx-auto mt-4"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
