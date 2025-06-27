import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const TableLoading = () => {
  const [dots, setDots] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-4 text-center align-middle">
      <h1 className="">
        {t("common.loading")}
        {dots}
      </h1>
    </div>
  );
};

export default TableLoading;
