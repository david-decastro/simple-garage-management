import { useTranslation } from "react-i18next";

const Loading = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-8 text-center">
      <h1 className="text-5xl font-bold">{t("common.loading")}</h1>
      <div className="flex justify-center mt-4 gap-x-2">
        <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-black rounded-full animate-bounce delay-1000"></div>
        <div className="w-4 h-4 bg-white rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  );
};

export default Loading;
